import { memo, useMemo } from 'react'
import { Line } from 'react-konva'
import { GridMode } from '../../enums'
import {
  GRID_LINE_COLOR,
  GRID_LINE_COLOR_DARK,
} from '../../constants/canvas'
import { mmToPx } from '../../utils'

interface CanvasGridProps {
  widthPx: number
  heightPx: number
  gridMode: GridMode
  gridSizeMm: number
  dpi: number
  isDark?: boolean
}

export const CanvasGrid = memo(function CanvasGrid({
  widthPx,
  heightPx,
  gridMode,
  gridSizeMm,
  dpi,
  isDark = false,
}: CanvasGridProps) {
  const lines = useMemo(() => {
    if (gridMode === GridMode.NONE || gridSizeMm <= 0) return []

    const spacing = mmToPx(gridSizeMm, dpi)
    const stroke = isDark ? GRID_LINE_COLOR_DARK : GRID_LINE_COLOR
    const result: Array<{
      key: string
      points: number[]
      stroke: string
      strokeWidth: number
    }> = []

    for (let x = 0; x <= widthPx; x += spacing) {
      const isMajor = Math.round(x / spacing) % 5 === 0
      result.push({
        key: `v-${x}`,
        points: [x, 0, x, heightPx],
        stroke,
        strokeWidth: isMajor ? 0.75 : 0.5,
      })
    }

    for (let y = 0; y <= heightPx; y += spacing) {
      const isMajor = Math.round(y / spacing) % 5 === 0
      result.push({
        key: `h-${y}`,
        points: [0, y, widthPx, y],
        stroke,
        strokeWidth: isMajor ? 0.75 : 0.5,
      })
    }

    return result
  }, [dpi, gridMode, gridSizeMm, heightPx, isDark, widthPx])

  if (lines.length === 0) return null

  return (
    <>
      {lines.map((line) => (
        <Line
          key={line.key}
          points={line.points}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          listening={false}
          perfectDrawEnabled={false}
        />
      ))}
    </>
  )
})
