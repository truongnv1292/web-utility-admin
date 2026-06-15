import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { BLEND_MODES, FONT_FAMILIES } from '../../constants/inspector'
import { ElementType, FontWeight, TextAlign } from '../../enums'
import { useUpdateElement } from '../../hooks/use-update-element'
import { useDesignerStore } from '../../store'
import { useSelectionStore } from '../../store/selection-store'
import type {
  DesignerElement,
  DynamicFieldElement,
  MultilineTextElement,
  TextElement,
} from '../../types/elements'

function isTextElement(
  element: DesignerElement
): element is TextElement | MultilineTextElement {
  return (
    element.type === ElementType.TEXT ||
    element.type === ElementType.MULTILINE_TEXT
  )
}

function isDynamicField(element: DesignerElement): element is DynamicFieldElement {
  return element.type === ElementType.DYNAMIC_FIELD
}

function hasTextStyle(
  element: DesignerElement
): element is TextElement | MultilineTextElement | DynamicFieldElement {
  return isTextElement(element) || isDynamicField(element)
}

function getElementLabel(element: DesignerElement): string {
  if (isDynamicField(element)) {
    return `\${${element.variableKey}}`
  }
  if (isTextElement(element)) {
    return element.content || element.id
  }
  return element.id
}

function getElementOpacity(element: DesignerElement): number {
  if (
    element.type === ElementType.RECTANGLE ||
    element.type === ElementType.CIRCLE
  ) {
    return element.style.opacity
  }
  if (element.type === ElementType.IMAGE) {
    return element.style.opacity
  }
  return 1
}

interface NumberFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
}: NumberFieldProps) {
  return (
    <div className='space-y-1'>
      <Label className='text-xs text-muted-foreground'>{label}</Label>
      <Input
        type='number'
        className='h-8'
        value={Math.round(value * 100) / 100}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const next = Number(e.target.value)
          if (!Number.isNaN(next)) onChange(next)
        }}
      />
    </div>
  )
}

export function ElementInspector() {
  const selectedIds = useSelectionStore((s) => s.selectedIds)
  const elements = useDesignerStore((s) => s.elements)
  const { updateElementWithHistory } = useUpdateElement()

  const selectedId = selectedIds.length === 1 ? selectedIds[0] : null
  const element = selectedId ? elements[selectedId] : null

  if (!element) {
    return (
      <aside className='border-border bg-background flex w-72 shrink-0 flex-col border-l'>
        <div className='border-border border-b px-4 py-3'>
          <h2 className='text-sm font-semibold'>Properties</h2>
        </div>
        <div className='text-muted-foreground flex flex-1 items-center justify-center p-6 text-center text-sm'>
          {selectedIds.length > 1
            ? `${selectedIds.length} items selected`
            : 'Select an element to edit properties'}
        </div>
      </aside>
    )
  }

  const update = (patch: Partial<DesignerElement>, label?: string) => {
    updateElementWithHistory(element.id, patch, { label })
  }

  const updateGeometry = (patch: {
    x?: number
    y?: number
    width?: number
    height?: number
  }) => {
    update(patch, 'Update position/size')
  }

  const updateTextStyle = (
    stylePatch: Partial<TextElement['style']>,
    label?: string
  ) => {
    if (!hasTextStyle(element)) return
    update({ style: { ...element.style, ...stylePatch } }, label ?? 'Update text style')
  }

  const updateContent = (content: string) => {
    if (!isTextElement(element)) return
    update({ content }, 'Update text content')
  }

  const updateOpacity = (opacity: number) => {
    if (
      element.type === ElementType.RECTANGLE ||
      element.type === ElementType.CIRCLE
    ) {
      update(
        { style: { ...element.style, opacity } },
        'Update opacity'
      )
    } else if (element.type === ElementType.IMAGE) {
      update(
        { style: { ...element.style, opacity } },
        'Update opacity'
      )
    }
  }

  const textStyle = hasTextStyle(element) ? element.style : null
  const opacity = getElementOpacity(element)
  const showOpacity =
    element.type === ElementType.RECTANGLE ||
    element.type === ElementType.CIRCLE ||
    element.type === ElementType.IMAGE

  return (
    <aside className='border-border bg-background flex w-72 shrink-0 flex-col border-l'>
      <div className='border-border border-b px-4 py-3'>
        <h2 className='text-sm font-semibold'>Properties</h2>
        <p className='text-muted-foreground mt-0.5 truncate text-xs capitalize'>
          {element.type.replace(/_/g, ' ').toLowerCase()}
        </p>
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4'>
        <div className='space-y-1'>
          <Label className='text-xs text-muted-foreground'>Name</Label>
          <Input
            className='h-8 font-mono text-xs'
            value={getElementLabel(element)}
            readOnly
          />
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-2'>
          <NumberField
            label='Left'
            value={element.x}
            onChange={(x) => updateGeometry({ x })}
          />
          <NumberField
            label='Top'
            value={element.y}
            onChange={(y) => updateGeometry({ y })}
          />
          <NumberField
            label='Width'
            value={element.width}
            min={1}
            onChange={(width) => updateGeometry({ width: Math.max(1, width) })}
          />
          <NumberField
            label='Height'
            value={element.height}
            min={1}
            onChange={(height) => updateGeometry({ height: Math.max(1, height) })}
          />
        </div>

        {textStyle && (
          <>
            <Separator />

            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Alignment</Label>
              <div className='flex gap-1'>
                {(
                  [
                    [TextAlign.LEFT, AlignLeft],
                    [TextAlign.CENTER, AlignCenter],
                    [TextAlign.RIGHT, AlignRight],
                    [TextAlign.JUSTIFY, AlignJustify],
                  ] as const
                ).map(([align, Icon]) => (
                  <Button
                    key={align}
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn(
                      'size-8',
                      textStyle.textAlign === align && 'bg-accent'
                    )}
                    onClick={() => updateTextStyle({ textAlign: align }, 'Text align')}
                  >
                    <Icon className='size-4' />
                    <span className='sr-only'>{align}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Font</Label>
              <Select
                value={textStyle.fontFamily.split(',')[0]?.trim() ?? textStyle.fontFamily}
                onValueChange={(fontFamily) =>
                  updateTextStyle({ fontFamily }, 'Font family')
                }
              >
                <SelectTrigger className='h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  className='h-8 flex-1'
                  value={textStyle.fontSize}
                  min={1}
                  step={0.1}
                  onChange={(e) => {
                    const fontSize = Number(e.target.value)
                    if (!Number.isNaN(fontSize) && fontSize > 0) {
                      updateTextStyle({ fontSize }, 'Font size')
                    }
                  }}
                />
                <div className='flex gap-0.5'>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn(
                      'size-8',
                      (textStyle.fontWeight === FontWeight.BOLD ||
                        textStyle.fontWeight === FontWeight.SEMIBOLD) &&
                        'bg-accent'
                    )}
                    onClick={() =>
                      updateTextStyle(
                        {
                          fontWeight:
                            textStyle.fontWeight === FontWeight.BOLD
                              ? FontWeight.NORMAL
                              : FontWeight.BOLD,
                        },
                        'Toggle bold'
                      )
                    }
                  >
                    <Bold className='size-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn('size-8', textStyle.italic && 'bg-accent')}
                    onClick={() =>
                      updateTextStyle(
                        { italic: !textStyle.italic },
                        'Toggle italic'
                      )
                    }
                  >
                    <Italic className='size-4' />
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className={cn('size-8', textStyle.underline && 'bg-accent')}
                    onClick={() =>
                      updateTextStyle(
                        { underline: !textStyle.underline },
                        'Toggle underline'
                      )
                    }
                  >
                    <Underline className='size-4' />
                  </Button>
                </div>
              </div>
            </div>

            {isTextElement(element) && (
              <div className='space-y-1'>
                <Label className='text-xs text-muted-foreground'>Content</Label>
                <Textarea
                  className='min-h-20 resize-y text-sm'
                  value={element.content}
                  onChange={(e) => updateContent(e.target.value)}
                />
              </div>
            )}
          </>
        )}

        {element.type === ElementType.BARCODE && (
          <>
            <Separator />
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>Value</Label>
              <Input
                className='h-8'
                value={element.value}
                onChange={(e) => update({ value: e.target.value }, 'Barcode value')}
              />
            </div>
          </>
        )}

        {element.type === ElementType.QRCODE && (
          <>
            <Separator />
            <div className='space-y-1'>
              <Label className='text-xs text-muted-foreground'>Value</Label>
              <Input
                className='h-8'
                value={element.value}
                onChange={(e) => update({ value: e.target.value }, 'QR value')}
              />
            </div>
          </>
        )}

        {showOpacity && (
          <>
            <Separator />
            <div className='space-y-2'>
              <Label className='text-xs text-muted-foreground'>Blending</Label>
              <Select value='normal' disabled>
                <SelectTrigger className='h-8'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BLEND_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <NumberField
                label='Opacity'
                value={opacity}
                min={0}
                max={1}
                step={0.05}
                onChange={(next) => updateOpacity(Math.min(1, Math.max(0, next)))}
              />
            </div>
          </>
        )}

        {element.locked && (
          <p className='text-muted-foreground text-xs'>
            Element is locked — unlock to move on canvas.
          </p>
        )}
      </div>
    </aside>
  )
}
