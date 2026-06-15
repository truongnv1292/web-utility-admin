import type { DesignerMode, GridMode, TemplateStatus } from '../enums'
import type {
  ClipboardPayload,
  DesignerDocument,
  DesignerElement,
  ElementUpdate,
  HistorySnapshot,
  PaperConfig,
} from '../types'

export interface DesignerStoreState extends DesignerDocument {
  mode: DesignerMode
  zoom: number
  panX: number
  panY: number
  gridMode: GridMode
  snapToGrid: boolean
  gridSize: number
}

export interface DesignerStoreActions {
  setMode: (mode: DesignerMode) => void
  setPaper: (paper: PaperConfig) => void
  updatePaper: (partial: Partial<PaperConfig>) => void
  setZoom: (zoom: number) => void
  zoomIn: () => void
  zoomOut: () => void
  setPan: (panX: number, panY: number) => void
  setGridMode: (gridMode: GridMode) => void
  setSnapToGrid: (snap: boolean) => void
  addElement: (element: DesignerElement) => void
  updateElement: (id: string, update: ElementUpdate) => void
  removeElement: (id: string) => void
  removeElements: (ids: string[]) => void
  duplicateElements: (ids: string[]) => string[]
  setElementOrder: (order: string[]) => void
  reorderElement: (id: string, newZIndex: number) => void
  toggleElementVisibility: (id: string) => void
  toggleElementLock: (id: string) => void
  getDocument: () => DesignerDocument
  loadDocument: (document: DesignerDocument) => void
  restoreSnapshot: (snapshot: HistorySnapshot) => void
  reset: () => void
}

export type DesignerStore = DesignerStoreState & DesignerStoreActions

export interface SelectionStoreState {
  selectedIds: string[]
  hoveredId: string | null
}

export interface SelectionStoreActions {
  select: (id: string, additive?: boolean) => void
  selectMultiple: (ids: string[]) => void
  deselect: (id: string) => void
  deselectAll: () => void
  selectAll: (elementIds: string[]) => void
  toggleSelect: (id: string) => void
  setHovered: (id: string | null) => void
  isSelected: (id: string) => boolean
}

export type SelectionStore = SelectionStoreState & SelectionStoreActions

export interface LayerStoreState {
  expandedGroups: string[]
  dragLayerId: string | null
}

export interface LayerStoreActions {
  setDragLayerId: (id: string | null) => void
  toggleGroupExpanded: (groupId: string) => void
  reorderLayer: (fromIndex: number, toIndex: number) => void
  moveLayerUp: (id: string) => void
  moveLayerDown: (id: string) => void
  bringToFront: (id: string) => void
  sendToBack: (id: string) => void
}

export type LayerStore = LayerStoreState & LayerStoreActions

export interface HistoryStoreState {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
  maxSize: number
}

export interface HistoryStoreActions {
  pushSnapshot: (snapshot: HistorySnapshot) => void
  undo: () => HistorySnapshot | null
  redo: () => HistorySnapshot | null
  clear: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

export type HistoryStore = HistoryStoreState & HistoryStoreActions

export interface TemplateStoreState {
  templateId: string | null
  name: string
  description: string | null
  categoryId: string | null
  currentVersion: number
  status: TemplateStatus
  isDirty: boolean
}

export interface TemplateStoreActions {
  loadMetadata: (metadata: {
    templateId: string
    name: string
    description: string | null
    categoryId: string | null
    currentVersion: number
    status: TemplateStatus
  }) => void
  setName: (name: string) => void
  setDescription: (description: string | null) => void
  setCategoryId: (categoryId: string | null) => void
  setVersion: (version: number) => void
  markDirty: () => void
  resetDirty: () => void
  reset: () => void
}

export type TemplateStore = TemplateStoreState & TemplateStoreActions

export interface SettingsStoreState {
  defaultDpi: number
  defaultGridMode: GridMode
  defaultSnapToGrid: boolean
  showRulers: boolean
  keyboardShortcutsEnabled: boolean
  recentTemplateIds: string[]
}

export interface SettingsStoreActions {
  setDefaultDpi: (dpi: number) => void
  setDefaultGridMode: (mode: GridMode) => void
  setDefaultSnapToGrid: (snap: boolean) => void
  setShowRulers: (show: boolean) => void
  setKeyboardShortcutsEnabled: (enabled: boolean) => void
  addRecentTemplate: (templateId: string) => void
  reset: () => void
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions

export interface ClipboardStoreState {
  payload: ClipboardPayload | null
}

export interface ClipboardStoreActions {
  copy: (payload: ClipboardPayload) => void
  clear: () => void
  hasContent: () => boolean
}

export type ClipboardStore = ClipboardStoreState & ClipboardStoreActions
