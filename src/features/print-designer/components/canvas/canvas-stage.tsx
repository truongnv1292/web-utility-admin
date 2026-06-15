import { memo } from 'react'
import { Group, Layer, Stage } from 'react-konva'
import { useDesignerStore } from '../../store'
import { getPaperDimensions } from '../../utils'
import { CanvasGrid } from './canvas-grid'
import { CanvasPaper } from './canvas-paper'

interface CanvasStageProps {
  width: number
  height: number
  zoom: number
  panX: number
  panY: number
  isDark?: boolean
}

export const CanvasStage = memo(function CanvasStage({
  width,
  height,
  zoom,
  panX,
  panY,
  isDark = false,
}: CanvasStageProps) {
  const paper = useDesignerStore((s) => s.paper)
  const gridMode = useDesignerStore((s) => s.gridMode)
  const gridSize = useDesignerStore((s) => s.gridSize)

  const { widthPx, heightPx } = getPaperDimensions(paper)

  if (width <= 0 || height <= 0) return null

  return (
    <Stage width={width} height={height} listening={false}>
      <Layer>
        <Group x={panX} y={panY} scaleX={zoom} scaleY={zoom}>
          <Group>
            <CanvasPaper
              widthPx={widthPx}
              heightPx={heightPx}
              backgroundColor={paper.backgroundColor}
            />
            <CanvasGrid
              widthPx={widthPx}
              heightPx={heightPx}
              gridMode={gridMode}
              gridSizeMm={gridSize}
              dpi={paper.dpi}
              isDark={isDark}
            />
          </Group>
        </Group>
      </Layer>
    </Stage>
  )
})
