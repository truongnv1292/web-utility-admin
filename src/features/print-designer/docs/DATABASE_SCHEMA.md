# Print Template Designer — Database Schema (Phase 0)

## 1. Tổng quan

Schema thiết kế cho PostgreSQL (có thể adapt sang MySQL). Hỗ trợ multi-tenant qua `tenant_id` (optional, nullable cho single-tenant).

**Chiến lược lưu elements:**
- **Primary:** JSONB `document` trong `template_version` — atomic save/load, phù hợp editor.
- **Secondary:** `template_element` denormalized — search, analytics, audit diff (async sync job).

---

## 2. ER Diagram

```
template_category ──< template ──< template_version
                        │                    │
                        │                    └── (document JSONB: paper + elements)
                        │
                        ├──< template_element (optional denormalized)
                        │
                        └──< template_audit_log
```

---

## 3. Tables

### 3.1 `template_category`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| tenant_id | UUID | NULL, FK tenants |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(100) | NOT NULL, UNIQUE per tenant |
| description | TEXT | NULL |
| sort_order | INT | DEFAULT 0 |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |
| deleted_at | TIMESTAMPTZ | NULL (soft delete) |

**Indexes:** `(tenant_id, slug)`, `(tenant_id, sort_order)`

---

### 3.2 `template`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| tenant_id | UUID | NULL |
| category_id | UUID | FK template_category, NULL |
| name | VARCHAR(255) | NOT NULL |
| description | TEXT | NULL |
| status | VARCHAR(20) | NOT NULL — `draft`, `active`, `archived` |
| current_version_id | UUID | FK template_version, NULL |
| thumbnail_url | VARCHAR(500) | NULL |
| tags | TEXT[] | DEFAULT '{}' |
| created_by | UUID | NOT NULL |
| updated_by | UUID | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |
| archived_at | TIMESTAMPTZ | NULL |
| deleted_at | TIMESTAMPTZ | NULL |

**Indexes:**
- `(tenant_id, status, updated_at DESC)` — list active templates
- `(tenant_id, category_id)`
- `(tenant_id, name)` — search
- GIN on `tags`

---

### 3.3 `template_version`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| template_id | UUID | FK template, NOT NULL |
| version_number | INT | NOT NULL — 1, 2, 3... |
| document | JSONB | NOT NULL — `{ paper, elements }` |
| document_hash | VARCHAR(64) | SHA-256 for dedup |
| change_summary | VARCHAR(500) | NULL |
| created_by | UUID | NOT NULL |
| created_at | TIMESTAMPTZ | NOT NULL |

**Unique:** `(template_id, version_number)`

**Indexes:**
- `(template_id, version_number DESC)`
- GIN on `document` (jsonb_path_ops) — optional query by element type

**document JSON structure:**
```json
{
  "paper": { "type": "CUSTOM", "width": 100, "height": 148, "unit": "MM", "dpi": 203 },
  "elements": [ { "id": "...", "type": "TEXT", "x": 10, "y": 20, ... } ]
}
```

---

### 3.4 `template_element` (denormalized, optional)

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| template_id | UUID | FK template |
| version_id | UUID | FK template_version |
| element_id | VARCHAR(36) | NOT NULL — client UUID |
| element_type | VARCHAR(30) | NOT NULL — maps ElementType enum |
| z_index | INT | NOT NULL |
| x | DECIMAL(12,4) | NOT NULL |
| y | DECIMAL(12,4) | NOT NULL |
| width | DECIMAL(12,4) | NOT NULL |
| height | DECIMAL(12,4) | NOT NULL |
| properties | JSONB | NOT NULL — type-specific props |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** `(template_id, element_type)`, `(version_id, z_index)`

**Sync:** Background job sau mỗi version save — delete old rows for version, bulk insert.

---

### 3.5 `template_audit_log`

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| template_id | UUID | FK template |
| version_id | UUID | FK template_version, NULL |
| action | VARCHAR(50) | NOT NULL — see AuditAction enum |
| actor_id | UUID | NOT NULL |
| metadata | JSONB | NULL — `{ fromVersion, toVersion, ip, userAgent }` |
| created_at | TIMESTAMPTZ | NOT NULL |

**Indexes:** `(template_id, created_at DESC)`, `(actor_id, created_at DESC)`

---

## 4. Enum Mapping (Application ↔ DB)

| App Enum | DB Value |
|----------|----------|
| TemplateStatus.DRAFT | `draft` |
| TemplateStatus.ACTIVE | `active` |
| TemplateStatus.ARCHIVED | `archived` |
| ElementType.TEXT | `TEXT` |
| AuditAction.CREATE | `template.create` |
| AuditAction.UPDATE | `template.update` |
| AuditAction.DELETE | `template.delete` |
| AuditAction.CLONE | `template.clone` |
| AuditAction.ARCHIVE | `template.archive` |
| AuditAction.RESTORE | `template.restore` |
| AuditAction.VERSION_CREATE | `version.create` |
| AuditAction.VERSION_ROLLBACK | `version.rollback` |

---

## 5. Sample SQL (PostgreSQL)

```sql
CREATE TABLE template_category (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (tenant_id, slug)
);

CREATE TABLE template (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  category_id UUID REFERENCES template_category(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  current_version_id UUID,
  thumbnail_url VARCHAR(500),
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_by UUID NOT NULL,
  updated_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  archived_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ
);

CREATE TABLE template_version (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES template(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  document JSONB NOT NULL,
  document_hash VARCHAR(64) NOT NULL,
  change_summary VARCHAR(500),
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (template_id, version_number)
);

ALTER TABLE template
  ADD CONSTRAINT fk_current_version
  FOREIGN KEY (current_version_id) REFERENCES template_version(id);

CREATE INDEX idx_template_list ON template (tenant_id, status, updated_at DESC);
CREATE INDEX idx_template_version_latest ON template_version (template_id, version_number DESC);
```

---

## 6. Scaling Considerations

| Concern | Giải pháp |
|---------|-----------|
| Thousands of templates | Cursor pagination `(updated_at, id)`, partial index `WHERE deleted_at IS NULL` |
| Large JSON documents | Max 2MB per version (app validation); compress thumbnail separately |
| Version history growth | Retention policy (keep last N versions), archive cold storage |
| Multi-region | `tenant_id` shard key, read replicas for list API |

---

## 7. API ↔ Entity Mapping

See `services/database-entities.ts` and `services/api-contracts.ts` for TypeScript DTOs aligned with this schema.
