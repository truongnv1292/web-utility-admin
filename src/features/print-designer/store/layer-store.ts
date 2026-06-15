import { create } from 'zustand'
import { useDesignerStore } from './designer-store'
import type { LayerStore } from './types'

export const useLayerStore = create<LayerStore>()((set, get) => ({
  expandedGroups: [],
  dragLayerId: null,

  setDragLayerId: (dragLayerId) => set({ dragLayerId }),

  toggleGroupExpanded: (groupId) =>
    set((state) => ({
      expandedGroups: state.expandedGroups.includes(groupId)
        ? state.expandedGroups.filter((id) => id !== groupId)
        : [...state.expandedGroups, groupId],
    })),

  reorderLayer: (fromIndex, toIndex) => {
    const designer = useDesignerStore.getState()
    const order = [...designer.elementOrder]
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= order.length ||
      toIndex >= order.length
    ) {
      return
    }
    const [moved] = order.splice(fromIndex, 1)
    order.splice(toIndex, 0, moved)

    const maxZ = order.length - 1
    const elements = { ...designer.elements }
    order.forEach((id, index) => {
      const element = elements[id]
      if (element) {
        elements[id] = { ...element, zIndex: maxZ - index }
      }
    })

    useDesignerStore.setState({ elements, elementOrder: order })
  },

  moveLayerUp: (id) => {
    const { elementOrder } = useDesignerStore.getState()
    const index = elementOrder.indexOf(id)
    if (index <= 0) return
    get().reorderLayer(index, index - 1)
  },

  moveLayerDown: (id) => {
    const { elementOrder } = useDesignerStore.getState()
    const index = elementOrder.indexOf(id)
    if (index < 0 || index >= elementOrder.length - 1) return
    get().reorderLayer(index, index + 1)
  },

  bringToFront: (id) => {
    const { elementOrder } = useDesignerStore.getState()
    const index = elementOrder.indexOf(id)
    if (index <= 0) return
    get().reorderLayer(index, 0)
  },

  sendToBack: (id) => {
    const { elementOrder } = useDesignerStore.getState()
    const index = elementOrder.indexOf(id)
    if (index < 0 || index >= elementOrder.length - 1) return
    get().reorderLayer(index, elementOrder.length - 1)
  },
}))
