# Print Template Designer — State Flow (Phase 0)

## 1. Store Dependency Graph

```
                    ┌─────────────────┐
                    │  settingsStore  │ (persisted preferences)
                    └────────┬────────┘
                             │ read defaults on init
                             ▼
┌──────────────┐      ┌─────────────────┐      ┌─────────────────┐
│templateStore │◄────►│  designerStore  │◄────►│  historyStore   │
│ (metadata)   │ load │  (document)     │commit│  (undo/redo)    │
└──────────────┘      └────────┬────────┘      └─────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
     │selectionStore│  │  layerStore  │  │ Render Engine│
     │ (UI select)  │  │ (panel ops)  │  │ (Phase 7)    │
     └──────────────┘  └──────────────┘  └──────────────┘
```

**Rule:** Stores không import lẫn nhau circular. Cross-store orchestration qua **hooks/commands** layer (Phase 2+).

---

## 2. User Interaction Flows

### 2.1 Add Element (Phase 2)

```
1. User drags TEXT from toolbar (React DnD)
2. onDrop(canvasCoords) → designerStore.addElement(defaultTextElement)
3. historyStore.pushSnapshot(getDocumentSnapshot())
4. selectionStore.select(newElement.id)
5. templateStore.markDirty()
6. Konva re-renders new Text node
```

### 2.2 Move / Resize / Rotate (Phase 3)

```
1. Konva Transformer dragend
2. designerStore.updateElement(id, { x, y, width, height, rotation })
3. On dragend (not every frame): historyStore.pushSnapshot()
4. Inspector reads selected element props reactively
```

### 2.3 Layer Reorder (Phase 4)

```
1. User drags layer row in panel
2. layerStore.reorderLayer(fromIndex, toIndex)
   → recalculate zIndex for all elements
   → designerStore.setElementOrder(newOrder)
3. historyStore.pushSnapshot()
```

### 2.4 Save Template (Phase 7)

```
1. User clicks Save
2. templateDocumentSchema.parse(designerStore.getDocument())
3. useUpdateTemplateMutation({ id, document, changeSummary })
4. API returns TemplateVersionResponse (version_number++)
5. templateStore.setVersion(newVersion); resetDirty()
6. toast success
```

### 2.5 Undo (Phase 10)

```
1. Ctrl+Z
2. historyStore.undo()
   → snapshot = past.pop()
   → designerStore.restoreSnapshot(snapshot)
   → future.push(previousState)
3. selectionStore.deselectAll() if selected ids no longer exist
```

### 2.6 Import JSON (Phase 8)

```
1. User selects file
2. JSON.parse → templateDocumentSchema.safeParse
3. On success: designerStore.loadDocument(parsed)
4. historyStore.clear()
5. templateStore.markDirty()
6. On failure: toast validation errors
```

### 2.7 Preview Mode (Phase 7)

```
1. User toggles DesignerMode.PREVIEW
2. designerStore.setMode(PREVIEW)
3. Render engine resolves variables with sampleRuntimeData
4. Canvas renders resolved elements (read-only, no transformer)
5. selectionStore.deselectAll()
```

---

## 3. Subscription Boundaries (Re-render Control)

| Component | Subscribes to |
|-----------|---------------|
| Canvas Stage | `designerStore.elements`, zoom, pan, paper |
| Element Node | Single element by id (selector) |
| Layer Panel | `elementOrder`, element visible/locked |
| Inspector | `selectionStore.selectedIds[0]` + element slice |
| Toolbar | `designerStore.mode`, `selectionStore` |
| Ruler | zoom, pan, paper dimensions |

**Zustand selector pattern:**
```typescript
const element = useDesignerStore((s) => s.elements[id])
const selectedIds = useSelectionStore((s) => s.selectedIds)
```

---

## 4. History Snapshot Shape

```typescript
interface HistorySnapshot {
  id: string
  timestamp: number
  label?: string
  paper: PaperConfig
  elements: Record<string, DesignerElement>
  elementOrder: string[]
}
```

**Not included in history:** zoom, pan, selection, mode — viewport state is ephemeral.

---

## 5. Dirty State & Navigation Guard

```
templateStore.isDirty === true
  → beforeunload warning
  → route blocker (TanStack Router) on navigate away
```

Clear dirty on: successful save, load new template, discard changes dialog.

---

## 6. Keyboard Shortcut Routing (Phase 10)

Central `useDesignerKeyboardShortcuts` hook:

| Shortcut | Handler |
|----------|---------|
| Delete | designerStore.removeSelected(selectionStore.selectedIds) |
| Ctrl+C | clipboardStore.copy (internal) |
| Ctrl+V | clipboardStore.paste |
| Ctrl+D | duplicate selected |
| Ctrl+Z | historyStore.undo |
| Ctrl+Shift+Z | historyStore.redo |
| Arrow | nudge selected ±1px |
| Shift+Arrow | nudge ±10px |

Hook checks `designerStore.mode === DESIGN` and not focused on input.
