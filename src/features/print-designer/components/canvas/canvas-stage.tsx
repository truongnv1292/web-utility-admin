import { memo } from 'react'
import { Group, Layer, Rect, Stage } from 'react-konva'
import { useDesignerStore } from '../../store'
import { useElementSelection } from '../../hooks/use-element-selection'
import { getPaperDimensions } from '../../utils'
import { CanvasElementsLayer } from './elements'
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
  const { handlePaperBackgroundClick } = useElementSelection()

  const { widthPx, heightPx } = getPaperDimensions(paper)

  if (width <= 0 || height <= 0) return null

  return (
    <Stage width={width} height={height}>
      <Layer listening={false}>
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

      <Layer>
        <Group x={panX} y={panY} scaleX={zoom} scaleY={zoom}>
          <Rect
            name='paper-background'
            width={widthPx}
            height={heightPx}
            fill='transparent'
            onClick={handlePaperBackgroundClick}
            onTap={handlePaperBackgroundClick}
          />
          <CanvasElementsLayer />
        </Group>
      </Layer>
    </Stage>
  )
})
