import { useTheme } from '@/context/theme-provider'
import { RULER_SIZE } from '../constants/canvas'
import { useCanvasSize } from '../hooks'
import { useDesignerStore } from '../store'
import { useSettingsStore } from '../store/settings-store'
import { getPaperDimensions } from '../utils'
import { DesignerCanvas } from './canvas'
import { RulerAxis } from './ruler/designer-ruler'
import { CanvasControls } from './toolbar'

export function DesignerWorkspace() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const paper = useDesignerStore((s) => s.paper)
  const zoom = useDesignerStore((s) => s.zoom)
  const panX = useDesignerStore((s) => s.panX)
  const panY = useDesignerStore((s) => s.panY)
  const showRulers = useSettingsStore((s) => s.showRulers)

  const { containerRef, size } = useCanvasSize()
  const { widthMm, heightMm } = getPaperDimensions(paper)

  const canvasArea = (
    <DesignerCanvas isDark={isDark} className='size-full' />
  )

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <CanvasControls
        stageWidth={size.width}
        stageHeight={size.height}
        paper={paper}
      />

      {showRulers ? (
        <div
          className='grid min-h-0 flex-1'
          style={{
            gridTemplateColumns: `${RULER_SIZE}px 1fr`,
            gridTemplateRows: `${RULER_SIZE}px 1fr`,
          }}
        >
          <div className='border-border bg-muted/80 border-b border-r' />
          <RulerAxis
            orientation='horizontal'
            lengthMm={widthMm}
            zoom={zoom}
            pan={panX}
            dpi={paper.dpi}
          />
          <RulerAxis
            orientation='vertical'
            lengthMm={heightMm}
            zoom={zoom}
            pan={panY}
            dpi={paper.dpi}
          />
          <div ref={containerRef} className='relative min-h-0 min-w-0'>
            {canvasArea}
          </div>
        </div>
      ) : (
        <div ref={containerRef} className='relative flex min-h-0 flex-1 flex-col'>
          {canvasArea}
        </div>
      )}
    </div>
  )
}
