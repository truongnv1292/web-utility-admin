import { useDrop } from 'react-dnd'
import type { RefObject } from 'react'
import { DND_ELEMENT_TYPE, isElementDragItem } from '../components/dnd'
import { useAddElement, viewportToPaperCoords } from './use-add-element'

interface UseCanvasDropOptions {
  panX: number
  panY: number
  zoom: number
  containerRef: RefObject<HTMLDivElement | null>
}

export function useCanvasDrop({
  panX,
  panY,
  zoom,
  containerRef,
}: UseCanvasDropOptions) {
  const { addElementAt } = useAddElement()

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: DND_ELEMENT_TYPE,
      drop: (item, monitor) => {
        if (!isElementDragItem(item)) return

        const clientOffset = monitor.getClientOffset()
        const dropElement = containerRef.current
        if (!clientOffset || !dropElement) return

        const rect = dropElement.getBoundingClientRect()
        const { x, y } = viewportToPaperCoords(
          clientOffset.x,
          clientOffset.y,
          rect,
          panX,
          panY,
          zoom
        )

        addElementAt(item.type, x, y)
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [addElementAt, containerRef, panX, panY, zoom]
  )

  return { drop, isOver, canDrop }
}
