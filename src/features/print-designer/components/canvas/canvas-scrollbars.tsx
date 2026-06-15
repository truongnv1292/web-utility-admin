import { useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { SCROLLBAR_SIZE } from '../../constants/canvas'
import {
  computeThumbMetrics,
  panToScrollRatio,
  scrollRatioToPan,
} from '../../utils'

interface ScrollbarAxisProps {
  orientation: 'horizontal' | 'vertical'
  trackSize: number
  pan: number
  min: number
  max: number
  onPanChange: (pan: number) => void
  className?: string
}

function ScrollbarAxis({
  orientation,
  trackSize,
  pan,
  min,
  max,
  onPanChange,
  className,
}: ScrollbarAxisProps) {
  const isHorizontal = orientation === 'horizontal'
  const span = max - min
  const dragStateRef = useRef<{ startPointer: number; startPan: number } | null>(
    null
  )

  const { thumbSize, thumbMaxOffset } = computeThumbMetrics(
    trackSize,
    trackSize,
    span + trackSize
  )

  const ratio = panToScrollRatio(pan, min, max)
  const thumbOffset = ratio * thumbMaxOffset

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      event.currentTarget.setPointerCapture(event.pointerId)
      dragStateRef.current = {
        startPointer: isHorizontal ? event.clientX : event.clientY,
        startPan: pan,
      }
    },
    [isHorizontal, pan]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!dragStateRef.current) return

      const pointer = isHorizontal ? event.clientX : event.clientY
      const delta = pointer - dragStateRef.current.startPointer
      const panDelta = (delta / Math.max(thumbMaxOffset, 1)) * span
      onPanChange(dragStateRef.current.startPan + panDelta)
    },
    [isHorizontal, onPanChange, span, thumbMaxOffset]
  )

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragStateRef.current = null
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  const handleTrackClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      const clickPos = isHorizontal
        ? event.clientX - rect.left
        : event.clientY - rect.top
      const clickRatio = clickPos / trackSize
      onPanChange(scrollRatioToPan(clickRatio, min, max))
    },
    [isHorizontal, max, min, onPanChange, trackSize]
  )

  if (span <= 0 || trackSize <= 0) {
    return (
      <div
        className={cn('shrink-0 bg-muted/40', className)}
        style={
          isHorizontal
            ? { height: SCROLLBAR_SIZE }
            : { width: SCROLLBAR_SIZE }
        }
      />
    )
  }

  return (
    <div
      className={cn('relative shrink-0 bg-muted/60', className)}
      style={
        isHorizontal
          ? { height: SCROLLBAR_SIZE }
          : { width: SCROLLBAR_SIZE }
      }
      onClick={handleTrackClick}
      role='scrollbar'
      aria-orientation={orientation}
      aria-valuenow={Math.round(ratio * 100)}
    >
      <div
        className={cn(
          'absolute rounded-full bg-border hover:bg-muted-foreground/50 active:bg-muted-foreground/70',
          isHorizontal
            ? 'top-0.5 h-2 cursor-ew-resize'
            : 'start-0.5 w-2 cursor-ns-resize'
        )}
        style={
          isHorizontal
            ? { width: thumbSize, transform: `translateX(${thumbOffset}px)` }
            : { height: thumbSize, transform: `translateY(${thumbOffset}px)` }
        }
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  )
}

interface CanvasScrollbarProps {
  stageWidth: number
  stageHeight: number
  panX: number
  panY: number
  panBounds: {
    minPanX: number
    maxPanX: number
    minPanY: number
    maxPanY: number
  }
  onPanChange: (panX: number, panY: number) => void
}

export function CanvasVerticalScrollbar({
  stageHeight,
  panY,
  panBounds,
  panX,
  onPanChange,
}: CanvasScrollbarProps) {
  return (
    <ScrollbarAxis
      orientation='vertical'
      trackSize={stageHeight}
      pan={panY}
      min={panBounds.minPanY}
      max={panBounds.maxPanY}
      onPanChange={(nextPanY) => onPanChange(panX, nextPanY)}
      className='border-border h-full border-s'
    />
  )
}

export function CanvasHorizontalScrollbar({
  stageWidth,
  panX,
  panBounds,
  panY,
  onPanChange,
}: CanvasScrollbarProps) {
  return (
    <ScrollbarAxis
      orientation='horizontal'
      trackSize={stageWidth}
      pan={panX}
      min={panBounds.minPanX}
      max={panBounds.maxPanX}
      onPanChange={(nextPanX) => onPanChange(nextPanX, panY)}
      className='border-border w-full border-t'
    />
  )
}

export function CanvasScrollbarCorner() {
  return (
    <div
      className='shrink-0 border-border bg-muted/60 border-s border-t'
      style={{ width: SCROLLBAR_SIZE, height: SCROLLBAR_SIZE }}
    />
  )
}

export { SCROLLBAR_SIZE }
