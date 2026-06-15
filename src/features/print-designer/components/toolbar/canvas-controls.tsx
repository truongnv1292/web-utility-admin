import {
  Grid3x3,
  Hand,
  Magnet,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { CanvasTool, GridMode } from '../../enums'
import { useCanvasViewport } from '../../hooks'
import { useDesignerStore } from '../../store'
import { useSettingsStore } from '../../store/settings-store'
import type { PaperConfig } from '../../types'
import { formatPaperSizeLabel } from '../../utils'

interface CanvasControlsProps {
  stageWidth: number
  stageHeight: number
  paper: PaperConfig
}

const GRID_MODE_LABELS: Record<GridMode, string> = {
  [GridMode.NONE]: 'None',
  [GridMode.SMALL]: 'Small (5mm)',
  [GridMode.MEDIUM]: 'Medium (10mm)',
  [GridMode.LARGE]: 'Large (20mm)',
}

export function CanvasControls({
  stageWidth,
  stageHeight,
  paper,
}: CanvasControlsProps) {
  const zoom = useDesignerStore((s) => s.zoom)
  const gridMode = useDesignerStore((s) => s.gridMode)
  const snapToGrid = useDesignerStore((s) => s.snapToGrid)
  const activeTool = useDesignerStore((s) => s.activeTool)
  const setGridMode = useDesignerStore((s) => s.setGridMode)
  const setSnapToGrid = useDesignerStore((s) => s.setSnapToGrid)
  const setActiveTool = useDesignerStore((s) => s.setActiveTool)
  const showRulers = useSettingsStore((s) => s.showRulers)
  const setShowRulers = useSettingsStore((s) => s.setShowRulers)

  const { zoomIn, zoomOut, fitToScreen } = useCanvasViewport({
    stageWidth,
    stageHeight,
    paper,
  })

  return (
    <div className='flex flex-wrap items-center gap-3 border-b bg-background px-4 py-2'>
      <div className='flex items-center rounded-md border p-0.5'>
        <Button
          variant={activeTool === CanvasTool.SELECT ? 'secondary' : 'ghost'}
          size='icon'
          className={cn('size-8', activeTool === CanvasTool.SELECT && 'shadow-sm')}
          onClick={() => setActiveTool(CanvasTool.SELECT)}
          title='Select (V)'
        >
          <MousePointer2 className='size-4' />
          <span className='sr-only'>Select tool</span>
        </Button>
        <Button
          variant={activeTool === CanvasTool.HAND ? 'secondary' : 'ghost'}
          size='icon'
          className={cn('size-8', activeTool === CanvasTool.HAND && 'shadow-sm')}
          onClick={() => setActiveTool(CanvasTool.HAND)}
          title='Hand (H) — drag to pan'
        >
          <Hand className='size-4' />
          <span className='sr-only'>Hand tool</span>
        </Button>
      </div>

      <Separator orientation='vertical' className='hidden h-6 sm:block' />

      <div className='flex items-center gap-1'>
        <Button variant='outline' size='icon' className='size-8' onClick={zoomOut}>
          <Minus className='size-4' />
          <span className='sr-only'>Zoom out</span>
        </Button>
        <span className='min-w-14 text-center text-sm font-medium tabular-nums'>
          {Math.round(zoom * 100)}%
        </span>
        <Button variant='outline' size='icon' className='size-8' onClick={zoomIn}>
          <Plus className='size-4' />
          <span className='sr-only'>Zoom in</span>
        </Button>
        <Button
          variant='outline'
          size='icon'
          className='size-8'
          onClick={fitToScreen}
          title='Fit to screen'
        >
          <Maximize2 className='size-4' />
          <span className='sr-only'>Fit to screen</span>
        </Button>
      </div>

      <Separator orientation='vertical' className='hidden h-6 sm:block' />

      <div className='flex items-center gap-2'>
        <Grid3x3 className='size-4 text-muted-foreground' />
        <Select
          value={gridMode}
          onValueChange={(value) => setGridMode(value as GridMode)}
        >
          <SelectTrigger className='h-8 w-36'>
            <SelectValue placeholder='Grid' />
          </SelectTrigger>
          <SelectContent>
            {Object.values(GridMode).map((mode) => (
              <SelectItem key={mode} value={mode}>
                {GRID_MODE_LABELS[mode]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='flex items-center gap-2'>
        <Switch
          id='snap-to-grid'
          checked={snapToGrid}
          onCheckedChange={setSnapToGrid}
        />
        <Label htmlFor='snap-to-grid' className='flex items-center gap-1 text-sm'>
          <Magnet className='size-3.5' />
          Snap
        </Label>
      </div>

      <div className='flex items-center gap-2'>
        <Switch
          id='show-rulers'
          checked={showRulers}
          onCheckedChange={setShowRulers}
        />
        <Label htmlFor='show-rulers' className='text-sm'>
          Rulers
        </Label>
      </div>

      <div className='ms-auto hidden text-xs text-muted-foreground md:block'>
        {formatPaperSizeLabel(paper)} · Shift+scroll = pan ngang
      </div>
    </div>
  )
}
