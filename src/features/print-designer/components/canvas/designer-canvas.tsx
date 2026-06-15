import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import {
  CANVAS_BG_COLOR,
  CANVAS_BG_COLOR_DARK,
  SCROLLBAR_SIZE,
} from '../../constants/canvas'
import { useCanvasDrop } from '../../hooks/use-canvas-drop'
import { useCanvasSize, useCanvasViewport } from '../../hooks'
import { useDesignerStore } from '../../store'
import {
  CanvasHorizontalScrollbar,
  CanvasScrollbarCorner,
  CanvasVerticalScrollbar,
} from './canvas-scrollbars'
import { CanvasStage } from './canvas-stage'

interface DesignerCanvasProps {
  isDark?: boolean
  className?: string
}

export function DesignerCanvas({ isDark = false, className }: DesignerCanvasProps) {
  const paper = useDesignerStore((s) => s.paper)
  const { containerRef, size } = useCanvasSize()
  const wheelHandlerRef = useRef<(event: WheelEvent) => void>(() => {})

  const viewport = useCanvasViewport({
    stageWidth: size.width,
    stageHeight: size.height,
    paper,
  })

  const { drop, isOver, canDrop } = useCanvasDrop({
    panX: viewport.panX,
    panY: viewport.panY,
    zoom: viewport.zoom,
    containerRef,
  })

  const scrollbarProps = {
    stageWidth: size.width,
    stageHeight: size.height,
    panX: viewport.panX,
    panY: viewport.panY,
    panBounds: viewport.panBounds,
    onPanChange: viewport.setPanClamped,
  }

  const mergedContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      drop(node)
    },
    [containerRef, drop]
  )

  wheelHandlerRef.current = viewport.handleWheel

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const onWheel = (event: WheelEvent) => {
      wheelHandlerRef.current(event)
    }

    element.addEventListener('wheel', onWheel, { passive: false })
    return () => element.removeEventListener('wheel', onWheel)
  }, [containerRef, size.width, size.height])

  return (
    <div
      className={cn('relative flex min-h-0 min-w-0 flex-1 flex-col', className)}
    >
      <div className='flex min-h-0 min-w-0 flex-1'>
        <div
          ref={mergedContainerRef}
          className={cn(
            'relative min-h-0 min-w-0 flex-1 overflow-hidden',
            isDark ? 'bg-slate-900' : 'bg-slate-100',
            isOver && canDrop && 'ring-2 ring-inset ring-primary/40'
          )}
          style={{
            backgroundColor: isDark ? CANVAS_BG_COLOR_DARK : CANVAS_BG_COLOR,
            cursor: viewport.cursor,
          }}
          onPointerDown={viewport.handlePointerDown}
          onPointerMove={viewport.handlePointerMove}
          onPointerUp={viewport.handlePointerUp}
          onPointerLeave={viewport.handlePointerLeave}
        >
          <CanvasStage
            width={size.width}
            height={size.height}
            zoom={viewport.zoom}
            panX={viewport.panX}
            panY={viewport.panY}
            isDark={isDark}
          />
        </div>

        {size.height > 0 && <CanvasVerticalScrollbar {...scrollbarProps} />}
      </div>

      <div className='flex shrink-0' style={{ height: SCROLLBAR_SIZE }}>
        <div className='min-w-0 flex-1'>
          {size.width > 0 && <CanvasHorizontalScrollbar {...scrollbarProps} />}
        </div>
        <CanvasScrollbarCorner />
      </div>
    </div>
  )
}
