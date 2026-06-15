import { create } from 'zustand'
import type { SelectionStore } from './types'

export const useSelectionStore = create<SelectionStore>()((set, get) => ({
  selectedIds: [],
  hoveredId: null,

  select: (id, additive = false) =>
    set((state) => ({
      selectedIds: additive
        ? state.selectedIds.includes(id)
          ? state.selectedIds
          : [...state.selectedIds, id]
        : [id],
    })),

  selectMultiple: (ids) => set({ selectedIds: ids }),

  deselect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })),

  deselectAll: () => set({ selectedIds: [] }),

  selectAll: (elementIds) => set({ selectedIds: [...elementIds] }),

  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((sid) => sid !== id)
        : [...state.selectedIds, id],
    })),

  setHovered: (hoveredId) => set({ hoveredId }),

  isSelected: (id) => get().selectedIds.includes(id),
}))
