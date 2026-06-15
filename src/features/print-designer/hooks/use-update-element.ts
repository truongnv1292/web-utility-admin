import { useCallback } from 'react'
import { HistoryActionType } from '../enums'
import { createSnapshot, useHistoryStore } from '../store/history-store'
import { useDesignerStore } from '../store/designer-store'
import { useTemplateStore } from '../store/template-store'
import type { DesignerElement, ElementUpdate } from '../types'

export function useUpdateElement() {
  const updateElement = useDesignerStore((s) => s.updateElement)
  const pushSnapshot = useHistoryStore((s) => s.pushSnapshot)
  const markDirty = useTemplateStore((s) => s.markDirty)

  const updateElementWithHistory = useCallback(
    (
      id: string,
      update: ElementUpdate,
      options?: { history?: boolean; label?: string }
    ) => {
      if (options?.history !== false) {
        const state = useDesignerStore.getState()
        pushSnapshot(
          createSnapshot(
            state.getDocument(),
            HistoryActionType.UPDATE_ELEMENT,
            options?.label
          )
        )
      }
      updateElement(id, update)
      markDirty()
    },
    [markDirty, pushSnapshot, updateElement]
  )

  return { updateElementWithHistory }
}

export function useElementDrag() {
  const { updateElementWithHistory } = useUpdateElement()
  const snapToGrid = useDesignerStore((s) => s.snapToGrid)
  const gridSize = useDesignerStore((s) => s.gridSize)

  const snapPosition = useCallback(
    (x: number, y: number) => {
      if (!snapToGrid || gridSize <= 0) return { x, y }
      return {
        x: Math.round(x / gridSize) * gridSize,
        y: Math.round(y / gridSize) * gridSize,
      }
    },
    [gridSize, snapToGrid]
  )

  const handleDragEnd = useCallback(
    (
      element: DesignerElement,
      paperWidthPx: number,
      paperHeightPx: number,
      nodeX: number,
      nodeY: number
    ) => {
      const snapped = snapPosition(nodeX, nodeY)
      const x = Math.max(0, Math.min(snapped.x, paperWidthPx - element.width))
      const y = Math.max(0, Math.min(snapped.y, paperHeightPx - element.height))

      if (x === element.x && y === element.y) return

      updateElementWithHistory(
        element.id,
        { x, y },
        { label: `Move ${element.type}` }
      )
    },
    [snapPosition, updateElementWithHistory]
  )

  return { handleDragEnd, snapPosition }
}

export function buildKonvaFontStyle(style: {
  fontWeight: string
  italic: boolean
}): string {
  const isBold = style.fontWeight === 'BOLD' || style.fontWeight === 'SEMIBOLD'
  if (isBold && style.italic) return 'bold italic'
  if (isBold) return 'bold'
  if (style.italic) return 'italic'
  return 'normal'
}
