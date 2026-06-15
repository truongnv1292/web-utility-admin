import { useCallback } from 'react'
import type Konva from 'konva'
import { CanvasTool } from '../enums'
import { useDesignerStore } from '../store/designer-store'
import { useSelectionStore } from '../store/selection-store'

export function useElementSelection() {
  const activeTool = useDesignerStore((s) => s.activeTool)
  const select = useSelectionStore((s) => s.select)
  const deselectAll = useSelectionStore((s) => s.deselectAll)
  const setHovered = useSelectionStore((s) => s.setHovered)

  const handleElementClick = useCallback(
    (elementId: string, event: Konva.KonvaEventObject<Event>) => {
      if (activeTool !== CanvasTool.SELECT) return

      event.cancelBubble = true
      const mouseEvent = event.evt as MouseEvent | TouchEvent
      const isMulti =
        'shiftKey' in mouseEvent ? mouseEvent.shiftKey : false
      select(elementId, isMulti)
    },
    [activeTool, select]
  )

  const handleElementMouseEnter = useCallback(
    (elementId: string) => {
      if (activeTool === CanvasTool.SELECT) {
        setHovered(elementId)
      }
    },
    [activeTool, setHovered]
  )

  const handleElementMouseLeave = useCallback(() => {
    setHovered(null)
  }, [setHovered])

  const handlePaperBackgroundClick = useCallback(() => {
    if (activeTool === CanvasTool.SELECT) {
      deselectAll()
    }
  }, [activeTool, deselectAll])

  return {
    handleElementClick,
    handleElementMouseEnter,
    handleElementMouseLeave,
    handlePaperBackgroundClick,
  }
}
