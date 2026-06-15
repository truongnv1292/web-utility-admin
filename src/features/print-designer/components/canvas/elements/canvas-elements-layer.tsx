import { memo, useMemo } from 'react'
import { Group } from 'react-konva'
import { CanvasTool } from '../../../enums'
import { useElementDrag } from '../../../hooks/use-update-element'
import { useDesignerStore } from '../../../store'
import { useSelectionStore } from '../../../store/selection-store'
import { useElementSelection } from '../../../hooks/use-element-selection'
import { getPaperDimensions } from '../../../utils'
import { CanvasElementNode } from './canvas-element-node'

export const CanvasElementsLayer = memo(function CanvasElementsLayer() {
  const elementOrder = useDesignerStore((s) => s.elementOrder)
  const elements = useDesignerStore((s) => s.elements)
  const paper = useDesignerStore((s) => s.paper)
  const activeTool = useDesignerStore((s) => s.activeTool)
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const hoveredId = useSelectionStore((s) => s.hoveredId)

  const { widthPx, heightPx } = useMemo(
    () => getPaperDimensions(paper),
    [paper]
  )

  const { handleDragEnd } = useElementDrag()

  const {
    handleElementClick,
    handleElementMouseEnter,
    handleElementMouseLeave,
  } = useElementSelection()

  const sortedIds = useMemo(
    () => [...elementOrder].reverse(),
    [elementOrder]
  )

  const isDraggable = activeTool === CanvasTool.SELECT

  return (
    <Group>
      {sortedIds.map((id) => {
        const element = elements[id]
        if (!element) return null
        return (
          <CanvasElementNode
            key={element.id}
            element={element}
            isSelected={selectedIds.includes(element.id)}
            isHovered={hoveredId === element.id}
            isDraggable={isDraggable}
            paperWidthPx={widthPx}
            paperHeightPx={heightPx}
            onSelect={handleElementClick}
            onMouseEnter={handleElementMouseEnter}
            onMouseLeave={handleElementMouseLeave}
            onDragEnd={(el, x, y) => handleDragEnd(el, widthPx, heightPx, x, y)}
          />
        )
      })}
    </Group>
  )
})
