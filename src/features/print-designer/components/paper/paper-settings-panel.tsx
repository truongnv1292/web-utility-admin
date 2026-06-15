import { useCallback } from 'react'
import { RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { PAPER_PRESETS } from '../../constants'
import { Orientation, PaperType, PaperUnit } from '../../enums'
import { useDesignerStore } from '../../store'
import { createPaperFromPreset, formatPaperSizeLabel } from '../../utils'

const ORIENTATION_LABELS: Record<Orientation, string> = {
  [Orientation.PORTRAIT]: 'Portrait',
  [Orientation.LANDSCAPE]: 'Landscape',
}

const UNIT_LABELS: Record<PaperUnit, string> = {
  [PaperUnit.MM]: 'mm',
  [PaperUnit.CM]: 'cm',
  [PaperUnit.PX]: 'px',
  [PaperUnit.INCH]: 'inch',
}

export function PaperSettingsPanel() {
  const paper = useDesignerStore((s) => s.paper)
  const setPaper = useDesignerStore((s) => s.setPaper)
  const updatePaper = useDesignerStore((s) => s.updatePaper)

  const applyPreset = useCallback(
    (type: PaperType) => {
      if (type === PaperType.CUSTOM) {
        setPaper(
          createPaperFromPreset(
            PaperType.CUSTOM,
            paper.orientation,
            paper.dpi,
            paper.width,
            paper.height
          )
        )
        return
      }
      setPaper(createPaperFromPreset(type, paper.orientation, paper.dpi))
    },
    [paper.dpi, paper.height, paper.orientation, paper.width, setPaper]
  )

  const toggleOrientation = useCallback(() => {
    const nextOrientation =
      paper.orientation === Orientation.PORTRAIT
        ? Orientation.LANDSCAPE
        : Orientation.PORTRAIT

    if (paper.type === PaperType.CUSTOM) {
      updatePaper({
        orientation: nextOrientation,
        width: paper.height,
        height: paper.width,
      })
      return
    }

    setPaper(createPaperFromPreset(paper.type, nextOrientation, paper.dpi))
  }, [paper, setPaper, updatePaper])

  return (
    <aside className='flex w-64 shrink-0 flex-col border-r bg-background'>
      <div className='border-b px-4 py-3'>
        <h2 className='text-sm font-semibold'>Paper</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          {formatPaperSizeLabel(paper)}
        </p>
      </div>

      <div className='flex flex-col gap-4 overflow-y-auto p-4'>
        <div className='space-y-2'>
          <Label htmlFor='paper-preset'>Preset</Label>
          <Select value={paper.type} onValueChange={(v) => applyPreset(v as PaperType)}>
            <SelectTrigger id='paper-preset'>
              <SelectValue placeholder='Select preset' />
            </SelectTrigger>
            <SelectContent>
              {PAPER_PRESETS.map((preset) => (
                <SelectItem key={preset.type} value={preset.type}>
                  {preset.label}
                </SelectItem>
              ))}
              <SelectItem value={PaperType.CUSTOM}>Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='paper-orientation'>Orientation</Label>
          <div className='flex gap-2'>
            <Select
              value={paper.orientation}
              onValueChange={(value) => {
                const orientation = value as Orientation
                if (paper.type === PaperType.CUSTOM) {
                  updatePaper({
                    orientation,
                    width: paper.height,
                    height: paper.width,
                  })
                } else {
                  setPaper(
                    createPaperFromPreset(paper.type, orientation, paper.dpi)
                  )
                }
              }}
            >
              <SelectTrigger id='paper-orientation'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Orientation).map((orientation) => (
                  <SelectItem key={orientation} value={orientation}>
                    {ORIENTATION_LABELS[orientation]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type='button'
              variant='outline'
              size='icon'
              onClick={toggleOrientation}
              title='Rotate orientation'
            >
              <RotateCw className='size-4' />
            </Button>
          </div>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-3'>
          <div className='space-y-2'>
            <Label htmlFor='paper-width'>Width</Label>
            <Input
              id='paper-width'
              type='number'
              min={1}
              value={paper.width}
              disabled={paper.type !== PaperType.CUSTOM}
              onChange={(e) =>
                updatePaper({ width: Number(e.target.value), type: PaperType.CUSTOM })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='paper-height'>Height</Label>
            <Input
              id='paper-height'
              type='number'
              min={1}
              value={paper.height}
              disabled={paper.type !== PaperType.CUSTOM}
              onChange={(e) =>
                updatePaper({ height: Number(e.target.value), type: PaperType.CUSTOM })
              }
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='paper-unit'>Unit</Label>
          <Select
            value={paper.unit}
            onValueChange={(value) =>
              updatePaper({ unit: value as PaperUnit, type: PaperType.CUSTOM })
            }
            disabled={paper.type !== PaperType.CUSTOM}
          >
            <SelectTrigger id='paper-unit'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PaperUnit).map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {UNIT_LABELS[unit]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='paper-dpi'>DPI</Label>
          <Input
            id='paper-dpi'
            type='number'
            min={72}
            max={600}
            value={paper.dpi}
            onChange={(e) => updatePaper({ dpi: Number(e.target.value) })}
          />
          <p className='text-xs text-muted-foreground'>
            Common: 203 (thermal), 300 (label)
          </p>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='paper-bg'>Background</Label>
          <Input
            id='paper-bg'
            type='color'
            value={paper.backgroundColor}
            onChange={(e) => updatePaper({ backgroundColor: e.target.value })}
            className='h-10 p-1'
          />
        </div>
      </div>
    </aside>
  )
}
