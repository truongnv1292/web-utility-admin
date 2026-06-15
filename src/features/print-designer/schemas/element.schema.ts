import { z } from 'zod'
import {
  BarcodeType,
  ElementType,
  FontWeight,
  ImageFitMode,
  TemplateVariableKey,
  TextAlign,
  VerticalAlign,
} from '../enums'

export const baseElementSchema = z.object({
  id: z.uuid(),
  type: z.enum(ElementType),
  x: z.number(),
  y: z.number(),
  width: z.number().positive(),
  height: z.number().positive(),
  rotation: z.number().min(-360).max(360),
  zIndex: z.number().int().min(0),
  visible: z.boolean(),
  locked: z.boolean(),
})

export const textStyleSchema = z.object({
  fontFamily: z.string().min(1).max(100),
  fontSize: z.number().positive().max(500),
  fontWeight: z.enum(FontWeight),
  color: z.string().max(20),
  textAlign: z.enum(TextAlign),
  verticalAlign: z.enum(VerticalAlign),
  lineHeight: z.number().positive().max(10),
  letterSpacing: z.number().min(-50).max(100),
  italic: z.boolean(),
  underline: z.boolean(),
})

export const elementStyleSchema = z.object({
  opacity: z.number().min(0).max(1),
  backgroundColor: z.string().max(20),
  borderWidth: z.number().min(0).max(100),
  borderColor: z.string().max(20),
  borderRadius: z.number().min(0).max(500),
  padding: z.number().min(0).max(500),
})

export const textElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.TEXT),
  content: z.string().max(10000),
  style: textStyleSchema,
})

export const multilineTextElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.MULTILINE_TEXT),
  content: z.string().max(50000),
  style: textStyleSchema,
})

export const barcodeElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.BARCODE),
  barcodeType: z.enum(BarcodeType),
  value: z.string().max(500),
  displayValue: z.boolean(),
  barColor: z.string().max(20),
  backgroundColor: z.string().max(20),
})

export const qrCodeElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.QRCODE),
  value: z.string().max(4000),
  errorCorrectionLevel: z.enum(['L', 'M', 'Q', 'H']),
  foregroundColor: z.string().max(20),
  backgroundColor: z.string().max(20),
})

export const imageElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.IMAGE),
  src: z.string().max(5000000),
  alt: z.string().max(500),
  fitMode: z.enum(ImageFitMode),
  style: z.object({
    opacity: z.number().min(0).max(1),
    borderWidth: z.number().min(0).max(100),
    borderColor: z.string().max(20),
    borderRadius: z.number().min(0).max(500),
  }),
})

export const rectangleElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.RECTANGLE),
  style: elementStyleSchema,
})

export const circleElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.CIRCLE),
  style: elementStyleSchema,
})

export const lineElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.LINE),
  strokeColor: z.string().max(20),
  strokeWidth: z.number().positive().max(100),
  dash: z.array(z.number().nonnegative()).max(20),
  points: z.tuple([z.number(), z.number(), z.number(), z.number()]),
})

export const tableCellSchema = z.object({
  id: z.uuid(),
  content: z.string().max(5000),
  colSpan: z.number().int().positive().max(20),
  rowSpan: z.number().int().positive().max(20),
  style: textStyleSchema.partial().merge(elementStyleSchema.partial()),
})

export const tableRowSchema = z.object({
  id: z.uuid(),
  cells: z.array(tableCellSchema).min(1).max(50),
  height: z.number().positive(),
})

export const tableElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.TABLE),
  rows: z.array(tableRowSchema).min(1).max(100),
  columnWidths: z.array(z.number().positive()).min(1).max(50),
  borderColor: z.string().max(20),
  borderWidth: z.number().min(0).max(20),
})

export const dynamicFieldElementSchema = baseElementSchema.extend({
  type: z.literal(ElementType.DYNAMIC_FIELD),
  variableKey: z.enum(TemplateVariableKey),
  fallbackValue: z.string().max(500),
  style: textStyleSchema,
  prefix: z.string().max(100),
  suffix: z.string().max(100),
})

export const designerElementSchema = z.discriminatedUnion('type', [
  textElementSchema,
  multilineTextElementSchema,
  barcodeElementSchema,
  qrCodeElementSchema,
  imageElementSchema,
  rectangleElementSchema,
  circleElementSchema,
  lineElementSchema,
  tableElementSchema,
  dynamicFieldElementSchema,
])

export type DesignerElementInput = z.infer<typeof designerElementSchema>
