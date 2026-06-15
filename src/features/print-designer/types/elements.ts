import type { BarcodeType, ElementType, ImageFitMode, TemplateVariableKey } from '../enums'
import type { BaseElement, ElementStyle, TextStyle } from './base-element'

export interface TextElement extends BaseElement {
  type: ElementType.TEXT
  content: string
  style: TextStyle
}

export interface MultilineTextElement extends BaseElement {
  type: ElementType.MULTILINE_TEXT
  content: string
  style: TextStyle
}

export interface BarcodeElement extends BaseElement {
  type: ElementType.BARCODE
  barcodeType: BarcodeType
  value: string
  displayValue: boolean
  barColor: string
  backgroundColor: string
}

export interface QRCodeElement extends BaseElement {
  type: ElementType.QRCODE
  value: string
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  foregroundColor: string
  backgroundColor: string
}

export interface ImageElement extends BaseElement {
  type: ElementType.IMAGE
  src: string
  alt: string
  fitMode: ImageFitMode
  style: Pick<ElementStyle, 'opacity' | 'borderWidth' | 'borderColor' | 'borderRadius'>
}

export interface RectangleElement extends BaseElement {
  type: ElementType.RECTANGLE
  style: ElementStyle
}

export interface CircleElement extends BaseElement {
  type: ElementType.CIRCLE
  style: ElementStyle
}

export interface LineElement extends BaseElement {
  type: ElementType.LINE
  strokeColor: string
  strokeWidth: number
  dash: number[]
  points: [number, number, number, number]
}

export interface TableCell {
  id: string
  content: string
  colSpan: number
  rowSpan: number
  style: Partial<TextStyle & ElementStyle>
}

export interface TableRow {
  id: string
  cells: TableCell[]
  height: number
}

export interface TableElement extends BaseElement {
  type: ElementType.TABLE
  rows: TableRow[]
  columnWidths: number[]
  borderColor: string
  borderWidth: number
}

export interface DynamicFieldElement extends BaseElement {
  type: ElementType.DYNAMIC_FIELD
  variableKey: TemplateVariableKey
  fallbackValue: string
  style: TextStyle
  prefix: string
  suffix: string
}

export type DesignerElement =
  | TextElement
  | MultilineTextElement
  | BarcodeElement
  | QRCodeElement
  | ImageElement
  | RectangleElement
  | CircleElement
  | LineElement
  | TableElement
  | DynamicFieldElement

export type ElementUpdate<T extends DesignerElement = DesignerElement> = Partial<
  Omit<T, 'id' | 'type'>
>
