import type { AuditAction, ElementType, TemplateStatus } from '../enums'
import type { TemplateDocument } from '../types'

/**
 * TypeScript representations of database entities.
 * Aligns with docs/DATABASE_SCHEMA.md
 */

export interface TemplateEntity {
  id: string
  tenantId: string | null
  categoryId: string | null
  name: string
  description: string | null
  status: TemplateStatus
  currentVersionId: string | null
  thumbnailUrl: string | null
  tags: string[]
  createdBy: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
  archivedAt: Date | null
  deletedAt: Date | null
}

export interface TemplateVersionEntity {
  id: string
  templateId: string
  versionNumber: number
  document: TemplateDocument
  documentHash: string
  changeSummary: string | null
  createdBy: string
  createdAt: Date
}

export interface TemplateElementEntity {
  id: string
  templateId: string
  versionId: string
  elementId: string
  elementType: ElementType
  zIndex: number
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, unknown>
  createdAt: Date
}

export interface TemplateCategoryEntity {
  id: string
  tenantId: string | null
  name: string
  slug: string
  description: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface TemplateAuditLogEntity {
  id: string
  templateId: string
  versionId: string | null
  action: AuditAction
  actorId: string
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export interface TemplateWithVersionEntity extends TemplateEntity {
  currentVersion: TemplateVersionEntity | null
}
