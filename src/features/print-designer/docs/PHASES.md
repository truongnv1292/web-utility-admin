# Print Template Designer — Tiến trình Phase

> Cập nhật lần cuối: **16/06/2026**  
> Vị trí feature: `src/features/print-designer/`

## Tổng quan

| Trạng thái | Số phase |
|------------|----------|
| Hoàn thành | 1 |
| Đang thực hiện | 0 |
| Chưa bắt đầu | 12 |

**Phase hiện tại:** Chờ review Phase 0 → bắt đầu Phase 1

---

## Legend

| Ký hiệu | Ý nghĩa |
|---------|---------|
| ✅ | Hoàn thành |
| 🔄 | Đang thực hiện |
| ⏳ | Chưa bắt đầu |
| ⛔ | Bị chặn (chờ phase trước) |

---

## Chi tiết từng Phase

### Phase 0 — Phân tích & Thiết kế ✅

**Trạng thái:** Hoàn thành  
**Ngày hoàn thành:** 16/06/2026

| Hạng mục | Trạng thái |
|----------|------------|
| Phân tích nghiệp vụ | ✅ |
| Thiết kế kiến trúc | ✅ [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Thiết kế thư mục | ✅ |
| Enums | ✅ `enums/index.ts` |
| Types | ✅ `types/` |
| Schemas (Zod) | ✅ `schemas/` |
| Stores (6 stores) | ✅ `store/` |
| State flow | ✅ [`docs/STATE_FLOW.md`](./STATE_FLOW.md) |
| API contracts | ✅ `services/api-contracts.ts` |
| Database schema | ✅ [`docs/DATABASE_SCHEMA.md`](./DATABASE_SCHEMA.md) |
| UI | ⛔ Không code (theo scope Phase 0) |

**Deliverables đã tạo:**
- `enums/`, `types/`, `schemas/`, `constants/`, `store/`, `services/`, `utils/`
- Rename `modules/` → `features/` (align codebase)

---

### Phase 1 — Canvas Foundation ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 0 ✅

| Hạng mục | Trạng thái |
|----------|------------|
| Cài dependencies (Konva, React-Konva) | ⏳ |
| Route `/print-designer` | ⏳ |
| Sidebar nav item | ⏳ |
| Canvas (Konva Stage) | ⏳ |
| Grid | ⏳ |
| Zoom In/Out + Mouse Wheel | ⏳ |
| Pan | ⏳ |
| Paper Engine UI | ⏳ |
| Ruler (optional Phase 1) | ⏳ |

---

### Phase 2 — Drag Drop Engine ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 1

| Hạng mục | Trạng thái |
|----------|------------|
| Toolbar palette | ⏳ |
| React DnD drop to canvas | ⏳ |
| Add Element (10 loại) | ⏳ |
| Select Element | ⏳ |

---

### Phase 3 — Transform ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 2

| Hạng mục | Trạng thái |
|----------|------------|
| Move (drag on canvas) | ⏳ |
| Resize (Konva Transformer) | ⏳ |
| Rotate | ⏳ |

---

### Phase 4 — Layer Panel ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 3

| Hạng mục | Trạng thái |
|----------|------------|
| Layer list UI | ⏳ |
| Drag reorder | ⏳ |
| Lock / Unlock | ⏳ |
| Hide / Show | ⏳ |
| Duplicate / Delete | ⏳ |

---

### Phase 5 — Inspector Panel ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 3

| Hạng mục | Trạng thái |
|----------|------------|
| Position (X, Y) | ⏳ |
| Size (W, H) | ⏳ |
| Rotation | ⏳ |
| Typography | ⏳ |
| Colors & Border | ⏳ |
| Opacity & Alignment | ⏳ |

---

### Phase 6 — Barcode, QRCode, Dynamic Variables ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 5

| Hạng mục | Trạng thái |
|----------|------------|
| JsBarcode (CODE128, EAN13, PDF417) | ⏳ |
| QRCode render | ⏳ |
| Dynamic Field `${variable}` | ⏳ |
| Variable picker UI | ⏳ |

---

### Phase 7 — Template Engine ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 6

| Hạng mục | Trạng thái |
|----------|------------|
| Render engine (resolve variables) | ⏳ |
| Preview mode | ⏳ |
| Template Manager CRUD UI | ⏳ |
| TanStack Query API hooks | ⏳ |

---

### Phase 8 — Import / Export JSON ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 7

| Hạng mục | Trạng thái |
|----------|------------|
| Export JSON `{ paper, elements }` | ⏳ |
| Import JSON + Zod validate | ⏳ |

---

### Phase 9 — Export PDF, PNG, Print ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 8

| Hạng mục | Trạng thái |
|----------|------------|
| Export PNG (html-to-image) | ⏳ |
| Export PDF (jsPDF) | ⏳ |
| Print trực tiếp | ⏳ |

---

### Phase 10 — Undo / Redo & Shortcuts ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 3

| Hạng mục | Trạng thái |
|----------|------------|
| Ctrl+Z / Ctrl+Shift+Z | ⏳ |
| Delete, Ctrl+C/V/D | ⏳ |
| Arrow nudge | ⏳ |
| History integration | ⏳ |

---

### Phase 11 — Versioning ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 7

| Hạng mục | Trạng thái |
|----------|------------|
| Version list UI (v1, v2, v3...) | ⏳ |
| Rollback version | ⏳ |
| Change summary | ⏳ |

---

### Phase 12 — Optimization, Testing, Documentation ⏳

**Trạng thái:** Chưa bắt đầu  
**Phụ thuộc:** Phase 11

| Hạng mục | Trạng thái |
|----------|------------|
| Performance (500+ elements) | ⏳ |
| React.memo / virtual rendering | ⏳ |
| Unit tests (Vitest) | ⏳ |
| Integration tests | ⏳ |
| Store tests | ⏳ |
| Documentation | ⏳ |

---

## Cấu trúc thư mục (target)

```
src/features/print-designer/
├── docs/
│   ├── PHASES.md          ← file này
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   └── STATE_FLOW.md
├── components/            ⏳ Phase 1+
│   ├── canvas/
│   ├── toolbar/
│   ├── inspector/
│   ├── ruler/
│   ├── layers/
│   └── templates/
├── hooks/                 ⏳ Phase 1+
├── tests/                 ⏳ Phase 12
├── enums/                 ✅
├── types/                 ✅
├── schemas/               ✅
├── constants/             ✅
├── store/                 ✅
├── services/              ✅
├── utils/                 ✅
└── index.tsx              ⏳ Phase 1 (page shell)
```

---

## Quy tắc cập nhật file này

Mỗi khi hoàn thành hoặc bắt đầu phase:

1. Cập nhật trạng thái phase (✅ / 🔄 / ⏳)
2. Cập nhật bảng tổng quan ở đầu file
3. Ghi **ngày hoàn thành** và **deliverables** (file mới/sửa)
4. Ghi **Phase hiện tại** ở header

---

## Lịch sử thay đổi

| Ngày | Thay đổi |
|------|----------|
| 16/06/2026 | Phase 0 hoàn thành; rename `modules/` → `features/`; tạo file PHASES.md |
