import { memo } from 'react'
import { Rect } from 'react-konva'
import {
  PAPER_BORDER_COLOR,
  PAPER_SHADOW_BLUR,
  PAPER_SHADOW_OFFSET,
} from '../../constants/canvas'

interface CanvasPaperProps {
  widthPx: number
  heightPx: number
  backgroundColor: string
}

export const CanvasPaper = memo(function CanvasPaper({
  widthPx,
  heightPx,
  backgroundColor,
}: CanvasPaperProps) {
  return (
    <>
      <Rect
        x={PAPER_SHADOW_OFFSET}
        y={PAPER_SHADOW_OFFSET}
        width={widthPx}
        height={heightPx}
        fill='rgba(0,0,0,0.12)'
        cornerRadius={2}
        listening={false}
        shadowBlur={PAPER_SHADOW_BLUR}
        shadowOpacity={0.2}
      />
      <Rect
        x={0}
        y={0}
        width={widthPx}
        height={heightPx}
        fill={backgroundColor}
        stroke={PAPER_BORDER_COLOR}
        strokeWidth={1}
        listening={false}
      />
    </>
  )
})
