import {
  BarcodeType,
  ElementType,
  FontWeight,
  ImageFitMode,
  TemplateVariableKey,
  TextAlign,
  VerticalAlign,
} from '../enums'
import type { TextStyle } from '../types/base-element'
import type { DesignerElement } from '../types/elements'
import { generateElementId, mmToPx } from './units'

const DEFAULT_FONT_FAMILY = 'Inter, system-ui, sans-serif'

export const DEFAULT_TEXT_STYLE: TextStyle = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: 14,
  fontWeight: FontWeight.NORMAL,
  color: '#0f172a',
  textAlign: TextAlign.LEFT,
  verticalAlign: VerticalAlign.TOP,
  lineHeight: 1.4,
  letterSpacing: 0,
  italic: false,
  underline: false,
}

export interface ElementDefaultSize {
  width: number
  height: number
}

export const ELEMENT_DEFAULT_SIZES: Record<ElementType, ElementDefaultSize> = {
  [ElementType.TEXT]: { width: 120, height: 24 },
  [ElementType.MULTILINE_TEXT]: { width: 160, height: 64 },
  [ElementType.BARCODE]: { width: 140, height: 48 },
  [ElementType.QRCODE]: { width: 64, height: 64 },
  [ElementType.IMAGE]: { width: 80, height: 80 },
  [ElementType.RECTANGLE]: { width: 100, height: 60 },
  [ElementType.CIRCLE]: { width: 60, height: 60 },
  [ElementType.LINE]: { width: 100, height: 2 },
  [ElementType.TABLE]: { width: 160, height: 80 },
  [ElementType.DYNAMIC_FIELD]: { width: 120, height: 24 },
}

function baseElement(
  type: ElementType,
  x: number,
  y: number,
  zIndex: number
): Pick<
  DesignerElement,
  'id' | 'type' | 'x' | 'y' | 'width' | 'height' | 'rotation' | 'zIndex' | 'visible' | 'locked'
> {
  const size = ELEMENT_DEFAULT_SIZES[type]
  return {
    id: generateElementId(),
    type,
    x,
    y,
    width: size.width,
    height: size.height,
    rotation: 0,
    zIndex,
    visible: true,
    locked: false,
  }
}

function createDefaultTableRows() {
  const cellStyle = { content: 'Cell', colSpan: 1, rowSpan: 1, style: {} }
  return [
    {
      id: generateElementId(),
      height: mmToPx(8, 203),
      cells: [
        { ...cellStyle, id: generateElementId(), content: 'Header 1' },
        { ...cellStyle, id: generateElementId(), content: 'Header 2' },
      ],
    },
    {
      id: generateElementId(),
      height: mmToPx(8, 203),
      cells: [
        { ...cellStyle, id: generateElementId(), content: 'Cell 1' },
        { ...cellStyle, id: generateElementId(), content: 'Cell 2' },
      ],
    },
  ]
}

export function createDefaultElement(
  type: ElementType,
  x: number,
  y: number,
  zIndex: number
): DesignerElement {
  const base = baseElement(type, x, y, zIndex)

  switch (type) {
    case ElementType.TEXT:
      return {
        ...base,
        type: ElementType.TEXT,
        content: 'Text',
        style: { ...DEFAULT_TEXT_STYLE },
      }
    case ElementType.MULTILINE_TEXT:
      return {
        ...base,
        type: ElementType.MULTILINE_TEXT,
        content: 'Multiline text',
        style: { ...DEFAULT_TEXT_STYLE },
      }
    case ElementType.BARCODE:
      return {
        ...base,
        type: ElementType.BARCODE,
        barcodeType: BarcodeType.CODE128,
        value: '1234567890',
        displayValue: true,
        barColor: '#000000',
        backgroundColor: '#ffffff',
      }
    case ElementType.QRCODE:
      return {
        ...base,
        type: ElementType.QRCODE,
        value: 'https://example.com',
        errorCorrectionLevel: 'M',
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
      }
    case ElementType.IMAGE:
      return {
        ...base,
        type: ElementType.IMAGE,
        src: '',
        alt: 'Image',
        fitMode: ImageFitMode.CONTAIN,
        style: {
          opacity: 1,
          borderWidth: 0,
          borderColor: '#cbd5e1',
          borderRadius: 0,
        },
      }
    case ElementType.RECTANGLE:
      return {
        ...base,
        type: ElementType.RECTANGLE,
        style: {
          opacity: 1,
          backgroundColor: '#e2e8f0',
          borderWidth: 1,
          borderColor: '#64748b',
          borderRadius: 0,
          padding: 0,
        },
      }
    case ElementType.CIRCLE:
      return {
        ...base,
        type: ElementType.CIRCLE,
        style: {
          opacity: 1,
          backgroundColor: '#e2e8f0',
          borderWidth: 1,
          borderColor: '#64748b',
          borderRadius: 9999,
          padding: 0,
        },
      }
    case ElementType.LINE:
      return {
        ...base,
        type: ElementType.LINE,
        strokeColor: '#0f172a',
        strokeWidth: 2,
        dash: [],
        points: [0, 0, base.width, 0],
      }
    case ElementType.TABLE:
      return {
        ...base,
        type: ElementType.TABLE,
        rows: createDefaultTableRows(),
        columnWidths: [0.5, 0.5],
        borderColor: '#64748b',
        borderWidth: 1,
      }
    case ElementType.DYNAMIC_FIELD:
      return {
        ...base,
        type: ElementType.DYNAMIC_FIELD,
        variableKey: TemplateVariableKey.TRACKING_NO,
        fallbackValue: 'N/A',
        style: { ...DEFAULT_TEXT_STYLE, color: '#2563eb' },
        prefix: '',
        suffix: '',
      }
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}

export function getElementCenterPosition(
  paperWidthPx: number,
  paperHeightPx: number,
  type: ElementType
): { x: number; y: number } {
  const size = ELEMENT_DEFAULT_SIZES[type]
  return {
    x: Math.max(0, (paperWidthPx - size.width) / 2),
    y: Math.max(0, (paperHeightPx - size.height) / 2),
  }
}
