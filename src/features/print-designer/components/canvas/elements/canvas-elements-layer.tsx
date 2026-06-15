import { memo, useMemo } from 'react'
import { Group } from 'react-konva'
import { useDesignerStore } from '../../../store'
import { useSelectionStore } from '../../../store/selection-store'
import { useElementSelection } from '../../../hooks/use-element-selection'
import { CanvasElementNode } from './canvas-element-node'

export const CanvasElementsLayer = memo(function CanvasElementsLayer() {
  const elementOrder = useDesignerStore((s) => s.elementOrder)
  const elements = useDesignerStore((s) => s.elements)
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const hoveredId = useSelectionStore((s) => s.hoveredId)

  const {
    handleElementClick,
    handleElementMouseEnter,
    handleElementMouseLeave,
  } = useElementSelection()

  const sortedIds = useMemo(
    () => [...elementOrder].reverse(),
    [elementOrder]
  )

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
            onSelect={handleElementClick}
            onMouseEnter={handleElementMouseEnter}
            onMouseLeave={handleElementMouseLeave}
          />
        )
      })}
    </Group>
  )
})
