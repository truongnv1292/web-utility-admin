import { z } from 'zod'
import {
  GridMode,
  Orientation,
  PaperType,
  PaperUnit,
} from '../enums'
import { designerElementSchema } from './element.schema'

export const paperMarginSchema = z.object({
  top: z.number().min(0).max(500),
  right: z.number().min(0).max(500),
  bottom: z.number().min(0).max(500),
  left: z.number().min(0).max(500),
})

export const paperConfigSchema = z.object({
  type: z.enum(PaperType),
  orientation: z.enum(Orientation),
  width: z.number().positive().max(2000),
  height: z.number().positive().max(2000),
  unit: z.enum(PaperUnit),
  dpi: z.number().int().min(72).max(600),
  margin: paperMarginSchema,
  backgroundColor: z.string().max(20),
})

export const templateDocumentSchema = z.object({
  paper: paperConfigSchema,
  elements: z.array(designerElementSchema).max(1000),
})

export const canvasViewportSchema = z.object({
  zoom: z.number().min(0.1).max(5),
  panX: z.number(),
  panY: z.number(),
  gridMode: z.enum(GridMode),
  snapToGrid: z.boolean(),
  gridSize: z.number().positive().max(100),
})

export type PaperConfigInput = z.infer<typeof paperConfigSchema>
export type TemplateDocumentInput = z.infer<typeof templateDocumentSchema>
