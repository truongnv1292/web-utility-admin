import { memo, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { RULER_SIZE } from '../../constants/canvas'
import { mmToPx } from '../../utils'

interface RulerAxisProps {
  orientation: 'horizontal' | 'vertical'
  lengthMm: number
  zoom: number
  pan: number
  dpi: number
  className?: string
}

interface Tick {
  position: number
  label?: string
  major: boolean
}

function buildTicks(lengthMm: number, zoom: number, pan: number, dpi: number): Tick[] {
  const ticks: Tick[] = []
  const step = zoom < 0.5 ? 10 : zoom < 1 ? 5 : 1

  for (let mm = 0; mm <= lengthMm; mm += step) {
    const position = pan + mmToPx(mm, dpi) * zoom
    ticks.push({
      position,
      label: mm % 10 === 0 ? String(mm) : undefined,
      major: mm % 10 === 0,
    })
  }

  return ticks
}

export const RulerAxis = memo(function RulerAxis({
  orientation,
  lengthMm,
  zoom,
  pan,
  dpi,
  className,
}: RulerAxisProps) {
  const ticks = useMemo(
    () => buildTicks(lengthMm, zoom, pan, dpi),
    [dpi, lengthMm, pan, zoom]
  )

  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'relative overflow-hidden border-border bg-muted/80 select-none',
        isHorizontal ? 'h-full w-full border-b' : 'h-full w-full border-r',
        className
      )}
    >
      {ticks.map((tick, index) => (
        <div
          key={`${orientation}-${index}`}
          className='absolute text-muted-foreground'
          style={
            isHorizontal
              ? {
                  left: tick.position,
                  top: 0,
                  height: RULER_SIZE,
                  borderLeft: `1px solid ${tick.major ? 'var(--border)' : 'var(--border)'}`,
                }
              : {
                  top: tick.position,
                  left: 0,
                  width: RULER_SIZE,
                  borderTop: `1px solid ${tick.major ? 'var(--border)' : 'var(--border)'}`,
                }
          }
        >
          {tick.label && (
            <span
              className={cn(
                'absolute text-[9px] leading-none',
                isHorizontal ? 'start-0.5 top-0.5' : 'start-1 top-0.5'
              )}
            >
              {tick.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
})

interface DesignerRulerProps {
  widthMm: number
  heightMm: number
  zoom: number
  panX: number
  panY: number
  dpi: number
  showRulers: boolean
}

export function DesignerRuler({
  widthMm,
  heightMm,
  zoom,
  panX,
  panY,
  dpi,
  showRulers,
}: DesignerRulerProps) {
  if (!showRulers) return null

  return (
    <>
      <div
        className='border-border bg-muted/80 border-b border-r'
        style={{ width: RULER_SIZE, height: RULER_SIZE }}
      />
      <div style={{ height: RULER_SIZE }} className='min-w-0 flex-1'>
        <RulerAxis
          orientation='horizontal'
          lengthMm={widthMm}
          zoom={zoom}
          pan={panX}
          dpi={dpi}
        />
      </div>
      <div style={{ width: RULER_SIZE }} className='shrink-0'>
        <RulerAxis
          orientation='vertical'
          lengthMm={heightMm}
          zoom={zoom}
          pan={panY}
          dpi={dpi}
        />
      </div>
    </>
  )
}

export { RULER_SIZE }
