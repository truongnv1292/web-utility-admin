# Print Template Designer — Architecture (Phase 0)

## 1. Phân tích nghiệp vụ

### 1.1 Bối cảnh

Print Template Designer là module WYSIWYG cho phép thiết kế mẫu in (vận đơn, tem nhãn, hóa đơn, shipping label, v.v.) tương tự Bartender, Zebra Designer, NiceLabel, DYMO, Canva. Người dùng thiết kế trên web, lưu template có versioning, render dữ liệu động khi in/xuất.

### 1.2 Personas

| Persona | Mục tiêu |
|---------|----------|
| Logistics Admin | Thiết kế vận đơn, tem giao hàng với biến `${trackingNo}`, `${receiverAddress}` |
| Warehouse Staff | In phiếu kho, tem sản phẩm hàng loạt |
| E-commerce Ops | Shipping label tích hợp Shopify/OMS |
| IT Admin | Quản lý template, category, audit, rollback version |

### 1.3 Use Cases chính

1. **Design** — Kéo thả element, chỉnh layout trên canvas theo kích thước giấy/DPI.
2. **Preview** — Render template với sample data hoặc data thật.
3. **Manage** — CRUD template, clone, archive, phân loại category.
4. **Version** — Mỗi save tạo version mới; rollback khi cần.
5. **Export** — JSON (portable), PNG, PDF, in trực tiếp.
6. **Batch Print** — Engine thay `${variable}` bằng runtime data (API/Phase 7).

### 1.4 Non-Functional Requirements

| Yêu cầu | Mục tiêu |
|---------|----------|
| Performance | 500+ elements, 60fps pan/zoom |
| Scalability | Hàng nghìn template, pagination API |
| Type Safety | Strict TS, Zod validation, no `any` |
| Security | Sanitize text/HTML, validate import JSON |
| Extensibility | Thêm element type mới qua discriminated union |

---

## 2. Kiến trúc tổng thể

### 2.1 Layered Architecture (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│  Presentation (pages, components, hooks)                    │
│  canvas · toolbar · inspector · layers · ruler · templates  │
├─────────────────────────────────────────────────────────────┤
│  Application (stores, commands, render engine)              │
│  designerStore · historyStore · templateStore · render      │
├─────────────────────────────────────────────────────────────┤
│  Domain (types, enums, schemas, constants)                  │
│  Element model · Paper engine · Template variables          │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure (services, API, export adapters)            │
│  REST client · TanStack Query · jsPDF · html-to-image       │
└─────────────────────────────────────────────────────────────┘
```

**Lý do:** Tách domain khỏi UI giúp test render engine và validation độc lập; infrastructure có thể đổi backend mà không ảnh hưởng canvas logic.

### 2.2 Feature-Based Module Structure

Feature nằm tại `src/features/print-designer/`, route mỏng tại `src/routes/_authenticated/print-designer/`. Tuân thủ pattern hiện có của shadcn-admin (route = URL, feature = business logic).

```
src/features/print-designer/
├── docs/                    # Architecture, DB schema, state flow
├── pages/                   # Phase 1+: page shells
├── routes/                  # Re-exports for TanStack Router (optional)
├── components/
│   ├── canvas/              # Konva stage, elements, transformers
│   ├── toolbar/             # Element palette, tools
│   ├── inspector/           # Property panel
│   ├── ruler/               # Horizontal/vertical rulers
│   ├── layers/              # Layer panel (Photoshop-like)
│   └── templates/           # Template manager UI
├── services/                # API + React Query hooks
├── hooks/                   # useCanvasZoom, useKeyboardShortcuts, ...
├── store/                   # Zustand stores (6 stores)
├── types/                   # Domain types
├── enums/                   # All enumerations
├── constants/               # Paper presets, variables registry
├── schemas/                 # Zod schemas (runtime validation)
├── utils/                   # mm↔px, snap, sanitize
├── assets/                  # Icons, default templates
└── tests/                   # Unit + integration
```

### 2.3 Tech Stack Mapping

| Concern | Library | Vai trò |
|---------|---------|---------|
| Canvas rendering | Konva + React-Konva | Hardware-accelerated 2D, Transformer, events |
| Drag from toolbar | React DnD | HTML5 DnD palette → canvas drop |
| Client state | Zustand (6 stores) | Fine-grained subscriptions, devtools |
| Server state | TanStack Query | Template CRUD, versioning, cache |
| Validation | Zod v4 | Import JSON, API DTOs, forms |
| Export PNG | html-to-image | Rasterize Konva stage |
| Export PDF | jsPDF | Multi-page, mm units |
| Barcode | JsBarcode | CODE128, EAN13, PDF417 |
| QR | qrcode | Dynamic QR generation |

**Dependencies sẽ được cài từ Phase 1** (chưa thêm vào Phase 0 để tránh scope creep).

---

## 3. Paper Engine

### 3.1 Đơn vị và chuyển đổi

- **Design unit trên canvas:** pixel logic tại `designDpi` (mặc định 96 CSS px hoặc theo paper.dpi).
- **Physical unit:** mm (chuẩn in ấn logistics VN/quốc tế).
- **Công thức:** `px = (mm / 25.4) * dpi`

### 3.2 Presets

| PaperType | Portrait (mm) | Landscape (mm) |
|-----------|---------------|----------------|
| A4 | 210 × 297 | 297 × 210 |
| A5 | 148 × 210 | 210 × 148 |
| A6 | 105 × 148 | 148 × 105 |
| A7 | 74 × 105 | 105 × 74 |
| Custom | user width/height | user width/height |

Thêm presets logistics: `100×148 mm`, `100×100 mm`.

### 3.3 PaperConfig Model

```typescript
{
  type: PaperType
  orientation: Orientation
  width: number      // in PaperUnit
  height: number
  unit: PaperUnit
  dpi: number        // 203 | 300 | custom
  margin: { top, right, bottom, left }
  backgroundColor: string
}
```

---

## 4. Element Model

Tất cả elements kế thừa `BaseElement`. Dùng **discriminated union** theo `type: ElementType` để type-safe inspector và renderer.

### 4.1 Element Types

| ElementType | Mục đích |
|-------------|----------|
| TEXT | Một dòng, font styling |
| MULTILINE_TEXT | Paragraph, line height |
| BARCODE | JsBarcode, BarcodeType enum |
| QRCODE | qrcode lib, error correction |
| IMAGE | URL/base64, fit mode |
| RECTANGLE | Fill, stroke, corner radius |
| CIRCLE | Ellipse |
| LINE | Stroke, dash |
| TABLE | Rows/cols, cell merge (Phase 6+) |
| DYNAMIC_FIELD | Placeholder `${variable}` bind runtime |

### 4.2 Layer Model

`zIndex` trên mỗi element. Layer panel sort theo `zIndex` desc (top = foreground). `LayerType` enum dùng cho grouping UI (background layer vs foreground) — optional metadata trên element group.

---

## 5. Store Design (6 Stores)

Tách store theo **Single Responsibility** — tránh một god store gây re-render toàn canvas.

### 5.1 designerStore

**Trách nhiệm:** Canvas document state — paper, elements map, zoom, pan, grid, mode.

```typescript
{
  paper: PaperConfig
  elements: Record<string, DesignerElement>
  elementOrder: string[]        // sorted by zIndex for fast layer ops
  zoom: number                  // 0.1 - 5.0
  pan: { x: number; y: number }
  gridMode: GridMode
  snapToGrid: boolean
  mode: DesignerMode
  // actions: setPaper, addElement, updateElement, removeElement, ...
}
```

### 5.2 selectionStore

**Trách nhiệm:** Selection riêng để inspector/layer không subscribe elements.

```typescript
{
  selectedIds: string[]
  hoveredId: string | null
  isMultiSelect: boolean
  // actions: select, deselect, selectAll, toggleSelect
}
```

### 5.3 layerStore

**Trách nhiệm:** Layer panel UI state + operations delegate tới designerStore.

```typescript
{
  expandedGroups: string[]
  dragLayerId: string | null
  // actions: reorderLayer, duplicateLayer, toggleVisibility, toggleLock
}
```

Layer operations mutate `designerStore.elements` (zIndex, visible, locked).

### 5.4 historyStore

**Trách nhiệm:** Undo/Redo command stack.

```typescript
{
  past: HistorySnapshot[]
  future: HistorySnapshot[]
  maxSize: number               // default 50
  // actions: push, undo, redo, clear
}
```

**Pattern:** Command pattern — mỗi mutation push snapshot `{ paper, elements, elementOrder }` trước khi apply. `historyStore` listen qua middleware hoặc explicit `commit()` từ actions.

### 5.5 templateStore

**Trách nhiệm:** Metadata template hiện tại (id, name, category, version, dirty flag).

```typescript
{
  templateId: string | null
  name: string
  categoryId: string | null
  currentVersion: number
  isDirty: boolean
  status: TemplateStatus
  // actions: loadTemplate, markDirty, resetDirty
}
```

Server persistence qua TanStack Query mutations; `templateStore` giữ client metadata.

### 5.6 settingsStore

**Trách nhiệm:** User preferences persisted (localStorage).

```typescript
{
  defaultDpi: number
  defaultGridMode: GridMode
  snapToGrid: boolean
  showRulers: boolean
  keyboardShortcutsEnabled: boolean
  recentTemplates: string[]
}
```

---

## 6. State Flow

```
┌──────────┐    drop/add     ┌───────────────┐    commit    ┌──────────────┐
│ Toolbar  │ ──────────────► │ designerStore │ ───────────► │ historyStore │
└──────────┘                 └───────┬───────┘              └──────────────┘
                                     │
              select                 │ elements change
┌──────────┐ ◄──────────────────────┤
│selection │                        │
│  Store   │ ───────────────────────► Inspector (reads element + selection)
└──────────┘
                                     │
┌──────────┐    reorder/zIndex       │
│  layer   │ ◄───────────────────────┘
│  Store   │
└──────────┘

Save ──► validate(schemas) ──► API mutation ──► templateStore.resetDirty
                              ──► new TemplateVersion (v+1)
```

### 6.1 Data Flow Rules

1. **Unidirectional:** UI → action → store → Konva re-render.
2. **History boundary:** Chỉ `designerStore` document mutations trigger history; selection/pan/zoom không undo (hoặc optional — mặc định không).
3. **Import JSON:** Parse → Zod validate → replace designerStore → clear history.
4. **Export JSON:** Serialize `{ paper, elements }` từ designerStore.

---

## 7. Template Render Engine (Phase 7 preview)

```
TemplateDocument + RuntimeData → resolveVariables() → ResolvedDocument → Konva/PDF/PNG
```

- `RuntimeData`: `Record<TemplateVariableKey, string | number>`
- `DynamicFieldElement` và text chứa `${key}` được replace
- Barcode/QR encode resolved string value

---

## 8. Performance Strategy

| Technique | Áp dụng |
|-----------|---------|
| `Record<id, Element>` | O(1) update vs array scan |
| `elementOrder` cached | Layer panel không sort mỗi frame |
| React.memo on Konva nodes | Per-element component |
| `listening={false}` | Static elements khi không selected |
| Virtual layer list | react-window cho 500+ layers |
| Batch draw | Konva `Layer.batchDraw()` |
| Debounced inspector | 16ms throttle on drag resize |

---

## 9. Security

- **Import JSON:** Zod strict schema, max elements count (e.g. 1000), max string length.
- **Text sanitize:** DOMPurify hoặc strip HTML tags trước render.
- **Image URL:** Allowlist domains hoặc base64 only (configurable).
- **API:** Auth token từ `useAuthStore`, CSRF via axios defaults.

---

## 10. Integration với shadcn-admin

| Touchpoint | Phase |
|------------|-------|
| `src/routes/_authenticated/print-designer/` | Phase 1 |
| `sidebar-data.ts` nav item | Phase 1 |
| `Main fixed fluid` layout | Phase 1 |
| React Query hooks in `services/` | Phase 7+ |
| Vitest co-located tests | Phase 12 |

---

## 11. Phase Roadmap Reference

| Phase | Scope |
|-------|-------|
| 0 | Architecture, types, enums, stores, API, DB (this doc) |
| 1 | Canvas, grid, zoom, pan, paper |
| 2 | DnD toolbar, add/select |
| 3 | Move, resize, rotate |
| 4 | Layer panel |
| 5 | Inspector |
| 6 | Barcode, QR, dynamic vars |
| 7 | Template engine + API |
| 8 | Import/export JSON |
| 9 | PDF, PNG, print |
| 10 | Undo/redo, shortcuts |
| 11 | Versioning UI |
| 12 | Optimization, tests, docs |

---

## 12. Quyết định kiến trúc (ADR Summary)

| Quyết định | Lựa chọn | Lý do |
|------------|----------|-------|
| Canvas lib | Konva | Transformer built-in, performance, print DPI |
| State | 6 Zustand stores | Tránh re-render, SRP |
| Element storage API | JSON blob in version | Industry standard, atomic save |
| Normalized TemplateElement table | Optional audit/search | Query by type without parsing JSON |
| History | Snapshot stack | Simple, predictable for 500 elements |
| DnD | React DnD (toolbar) + Konva drag (canvas) | Separation of concerns |
