import { z } from 'zod'
import { TemplateStatus } from '../enums'
import { templateDocumentSchema } from './paper.schema'

export const templateMetadataSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(2000).nullable(),
  categoryId: z.uuid().nullable(),
  status: z.enum(TemplateStatus),
  currentVersion: z.number().int().positive(),
  thumbnailUrl: z.string().url().max(500).nullable(),
  tags: z.array(z.string().max(50)).max(20),
  createdBy: z.uuid(),
  updatedBy: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  archivedAt: z.iso.datetime().nullable(),
})

export const templateVersionSchema = z.object({
  id: z.uuid(),
  templateId: z.uuid(),
  versionNumber: z.number().int().positive(),
  changeSummary: z.string().max(500).nullable(),
  createdBy: z.uuid(),
  createdAt: z.iso.datetime(),
})

export const templateWithDocumentSchema = templateMetadataSchema.extend({
  document: templateDocumentSchema,
})

export const templateCategorySchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).nullable(),
  sortOrder: z.number().int().min(0),
})

export const runtimeDataSchema = z.object({
  trackingNo: z.string().max(100).optional(),
  senderName: z.string().max(500).optional(),
  senderPhone: z.string().max(50).optional(),
  senderAddress: z.string().max(1000).optional(),
  receiverName: z.string().max(500).optional(),
  receiverPhone: z.string().max(50).optional(),
  receiverAddress: z.string().max(1000).optional(),
  cod: z.string().max(50).optional(),
  fee: z.string().max(50).optional(),
  weight: z.string().max(50).optional(),
  content: z.string().max(2000).optional(),
  createdDate: z.string().max(50).optional(),
  branchCode: z.string().max(50).optional(),
  routeCode: z.string().max(50).optional(),
  warehouseCode: z.string().max(50).optional(),
})

export type TemplateMetadataInput = z.infer<typeof templateMetadataSchema>
export type RuntimeDataInput = z.infer<typeof runtimeDataSchema>
