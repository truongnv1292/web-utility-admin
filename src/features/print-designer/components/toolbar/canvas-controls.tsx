import {
  Eye,
  Grid3x3,
  Hand,
  Lock,
  Magnet,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
  Printer,
  Unlock,
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
import { PrintPreviewDialog } from '../preview'
import { CanvasTool, GridMode } from '../../enums'
import { useCanvasViewport } from '../../hooks'
import { usePaperPrint } from '../../hooks/use-paper-print'
import { useDesignerStore } from '../../store'
import { useSettingsStore } from '../../store/settings-store'
import type { PaperConfig } from '../../types'
import { formatPaperSizeLabel, getPaperDimensions } from '../../utils'

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
  const zoomLocked = useSettingsStore((s) => s.zoomLocked)
  const setZoomLocked = useSettingsStore((s) => s.setZoomLocked)

  const { zoomIn, zoomOut, fitToScreen, applyViewAt100 } = useCanvasViewport({
    stageWidth,
    stageHeight,
    paper,
  })

  const {
    previewOpen,
    previewImageUrl,
    openPreview,
    closePreview,
    print,
    printFromPreview,
  } = usePaperPrint()

  const { widthMm } = getPaperDimensions(paper)

  return (
    <>
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
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={zoomOut}
            title='Zoom out'
          >
            <Minus className='size-4' />
            <span className='sr-only'>Zoom out</span>
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='min-w-14 px-2 tabular-nums'
            onClick={applyViewAt100}
            title='Reset to 100%'
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='size-8'
            onClick={zoomIn}
            title='Zoom in'
          >
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
          <Button
            variant={zoomLocked ? 'secondary' : 'outline'}
            size='icon'
            className='size-8'
            onClick={() => setZoomLocked(!zoomLocked)}
            title={
              zoomLocked
                ? 'Bật zoom chuột (scroll)'
                : 'Chặn zoom bằng chuột (scroll)'
            }
          >
            {zoomLocked ? (
              <Lock className='size-4' />
            ) : (
              <Unlock className='size-4' />
            )}
            <span className='sr-only'>
              {zoomLocked ? 'Enable wheel zoom' : 'Block wheel zoom'}
            </span>
          </Button>
        </div>

        <Separator orientation='vertical' className='hidden h-6 sm:block' />

        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='sm'
            className='h-8 gap-1.5'
            onClick={openPreview}
            title='Preview with sample data'
          >
            <Eye className='size-4' />
            Preview
          </Button>
          <Button
            variant='default'
            size='sm'
            className='h-8 gap-1.5'
            onClick={print}
            title='Print template'
          >
            <Printer className='size-4' />
            In
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
          {formatPaperSizeLabel(paper)}
          {zoomLocked
            ? ' · Scroll zoom tắt · Shift+scroll = pan ngang'
            : ' · Shift+scroll = pan ngang'}
        </div>
      </div>

      <PrintPreviewDialog
        open={previewOpen}
        onOpenChange={(open) => {
          if (!open) closePreview()
        }}
        imageUrl={previewImageUrl}
        paperLabel={formatPaperSizeLabel(paper)}
        widthMm={widthMm}
        onPrint={printFromPreview}
      />
    </>
  )
}
