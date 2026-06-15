import { create } from 'zustand'
import {
  DEFAULT_PAPER_PRESET,
  DEFAULT_ZOOM,
  GRID_SIZE_MAP,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_STEP,
} from '../constants'
import {
  DesignerMode,
  GridMode,
  Orientation,
  PaperType,
  PaperUnit,
} from '../enums'
import type {
  DesignerDocument,
  DesignerElement,
  PaperConfig,
} from '../types'
import type { DesignerStore } from './types'

function createDefaultPaper(): PaperConfig {
  const preset = DEFAULT_PAPER_PRESET
  return {
    type: preset.type,
    orientation: Orientation.PORTRAIT,
    width: preset.width,
    height: preset.height,
    unit: preset.unit,
    dpi: preset.defaultDpi,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor: '#ffffff',
  }
}

function sortElementOrder(
  elements: Record<string, DesignerElement>,
  order: string[]
): string[] {
  return [...order].sort(
    (a, b) => (elements[b]?.zIndex ?? 0) - (elements[a]?.zIndex ?? 0)
  )
}

function clampZoom(zoom: number): number {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom))
}

const initialPaper = createDefaultPaper()

const initialState = {
  paper: initialPaper,
  elements: {} as Record<string, DesignerElement>,
  elementOrder: [] as string[],
  mode: DesignerMode.DESIGN,
  zoom: DEFAULT_ZOOM,
  panX: 0,
  panY: 0,
  gridMode: GridMode.MEDIUM,
  snapToGrid: true,
  gridSize: GRID_SIZE_MAP[GridMode.MEDIUM],
}

export const useDesignerStore = create<DesignerStore>()((set, get) => ({
  ...initialState,

  setMode: (mode) => set({ mode }),

  setPaper: (paper) => set({ paper }),

  updatePaper: (partial) =>
    set((state) => ({ paper: { ...state.paper, ...partial } })),

  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),

  zoomIn: () =>
    set((state) => ({ zoom: clampZoom(state.zoom + ZOOM_STEP) })),

  zoomOut: () =>
    set((state) => ({ zoom: clampZoom(state.zoom - ZOOM_STEP) })),

  setPan: (panX, panY) => set({ panX, panY }),

  setGridMode: (gridMode) =>
    set({ gridMode, gridSize: GRID_SIZE_MAP[gridMode] }),

  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),

  addElement: (element) =>
    set((state) => {
      const elements = { ...state.elements, [element.id]: element }
      const elementOrder = sortElementOrder(elements, [
        ...state.elementOrder,
        element.id,
      ])
      return { elements, elementOrder }
    }),

  updateElement: (id, update) =>
    set((state) => {
      const existing = state.elements[id]
      if (!existing) return state
      const updated = { ...existing, ...update } as DesignerElement
      const elements = { ...state.elements, [id]: updated }
      const elementOrder = sortElementOrder(elements, state.elementOrder)
      return { elements, elementOrder }
    }),

  removeElement: (id) =>
    set((state) => {
      const { [id]: _, ...elements } = state.elements
      const elementOrder = state.elementOrder.filter((eid) => eid !== id)
      return { elements, elementOrder }
    }),

  removeElements: (ids) =>
    set((state) => {
      const elements = { ...state.elements }
      for (const id of ids) {
        delete elements[id]
      }
      const idSet = new Set(ids)
      const elementOrder = state.elementOrder.filter((eid) => !idSet.has(eid))
      return { elements, elementOrder }
    }),

  duplicateElements: (ids) => {
    const newIds: string[] = []
    const state = get()
    for (const id of ids) {
      const source = state.elements[id]
      if (!source) continue
      const newId = crypto.randomUUID()
      const duplicate: DesignerElement = {
        ...structuredClone(source),
        id: newId,
        x: source.x + 10,
        y: source.y + 10,
        zIndex: state.elementOrder.length + newIds.length,
      }
      get().addElement(duplicate)
      newIds.push(newId)
    }
    return newIds
  },

  setElementOrder: (elementOrder) => set({ elementOrder }),

  reorderElement: (id, newZIndex) =>
    set((state) => {
      const element = state.elements[id]
      if (!element) return state
      const elements = {
        ...state.elements,
        [id]: { ...element, zIndex: newZIndex },
      }
      const elementOrder = sortElementOrder(elements, state.elementOrder)
      return { elements, elementOrder }
    }),

  toggleElementVisibility: (id) =>
    set((state) => {
      const element = state.elements[id]
      if (!element) return state
      return {
        elements: {
          ...state.elements,
          [id]: { ...element, visible: !element.visible },
        },
      }
    }),

  toggleElementLock: (id) =>
    set((state) => {
      const element = state.elements[id]
      if (!element) return state
      return {
        elements: {
          ...state.elements,
          [id]: { ...element, locked: !element.locked },
        },
      }
    }),

  getDocument: (): DesignerDocument => {
    const { paper, elements, elementOrder } = get()
    return { paper, elements, elementOrder }
  },

  loadDocument: (document) =>
    set({
      paper: document.paper,
      elements: document.elements,
      elementOrder: sortElementOrder(document.elements, document.elementOrder),
    }),

  restoreSnapshot: (snapshot) =>
    set({
      paper: snapshot.paper,
      elements: snapshot.elements,
      elementOrder: snapshot.elementOrder,
    }),

  reset: () => set({ ...initialState, paper: createDefaultPaper() }),
}))

export function createPaperFromPreset(
  type: PaperType,
  orientation: Orientation,
  dpi: number
): PaperConfig {
  const preset = DEFAULT_PAPER_PRESET
  const isLandscape = orientation === Orientation.LANDSCAPE
  const width = isLandscape ? preset.height : preset.width
  const height = isLandscape ? preset.width : preset.height

  return {
    type,
    orientation,
    width,
    height,
    unit: PaperUnit.MM,
    dpi,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor: '#ffffff',
  }
}
