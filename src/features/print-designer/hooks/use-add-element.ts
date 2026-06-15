import { useCallback } from 'react'
import { HistoryActionType } from '../enums'
import { createSnapshot, useHistoryStore } from '../store/history-store'
import { useDesignerStore } from '../store/designer-store'
import { useSelectionStore } from '../store/selection-store'
import { useTemplateStore } from '../store/template-store'
import type { ElementType } from '../enums'
import {
  createDefaultElement,
  getElementCenterPosition,
} from '../utils/element-factory'
import { getPaperDimensions, snapToGrid } from '../utils'

export function viewportToPaperCoords(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  panX: number,
  panY: number,
  zoom: number
): { x: number; y: number } {
  const viewportX = clientX - containerRect.left
  const viewportY = clientY - containerRect.top
  return {
    x: (viewportX - panX) / zoom,
    y: (viewportY - panY) / zoom,
  }
}

export function useAddElement() {
  const addElement = useDesignerStore((s) => s.addElement)
  const pushSnapshot = useHistoryStore((s) => s.pushSnapshot)
  const select = useSelectionStore((s) => s.select)
  const markDirty = useTemplateStore((s) => s.markDirty)

  const addElementAt = useCallback(
    (elementType: ElementType, paperX: number, paperY: number) => {
      const state = useDesignerStore.getState()
      const { widthPx, heightPx } = getPaperDimensions(state.paper)
      const zIndex = state.elementOrder.length

      let x = paperX
      let y = paperY

      if (state.snapToGrid && state.gridSize > 0) {
        x = snapToGrid(x, state.gridSize)
        y = snapToGrid(y, state.gridSize)
      }

      const size = createDefaultElement(elementType, 0, 0, 0)
      x = Math.max(0, Math.min(x, widthPx - size.width))
      y = Math.max(0, Math.min(y, heightPx - size.height))

      const element = createDefaultElement(elementType, x, y, zIndex)

      pushSnapshot(
        createSnapshot(
          state.getDocument(),
          HistoryActionType.ADD_ELEMENT,
          `Add ${elementType}`
        )
      )
      addElement(element)
      select(element.id)
      markDirty()
    },
    [addElement, markDirty, pushSnapshot, select]
  )

  const addElementAtCenter = useCallback(
    (elementType: ElementType) => {
      const state = useDesignerStore.getState()
      const { widthPx, heightPx } = getPaperDimensions(state.paper)
      const { x, y } = getElementCenterPosition(
        widthPx,
        heightPx,
        elementType
      )
      addElementAt(elementType, x, y)
    },
    [addElementAt]
  )

  return { addElementAt, addElementAtCenter }
}
