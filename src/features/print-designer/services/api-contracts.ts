import type { AuditAction, TemplateStatus } from '../enums'
import type { TemplateDocument } from '../types'
import type { PaperConfigInput, TemplateDocumentInput } from '../schemas'

// ─── Request DTOs ───────────────────────────────────────────────

export interface CreateTemplateRequest {
  name: string
  description?: string | null
  categoryId?: string | null
  document: TemplateDocumentInput
  tags?: string[]
}

export interface UpdateTemplateRequest {
  id: string
  name?: string
  description?: string | null
  categoryId?: string | null
  document?: TemplateDocumentInput
  changeSummary?: string | null
  tags?: string[]
}

export interface DeleteTemplateRequest {
  id: string
  hardDelete?: boolean
}

export interface CloneTemplateRequest {
  sourceId: string
  name: string
  categoryId?: string | null
}

export interface ArchiveTemplateRequest {
  id: string
}

export interface RestoreTemplateRequest {
  id: string
}

export interface RollbackVersionRequest {
  templateId: string
  versionNumber: number
}

export interface ListTemplatesRequest {
  page?: number
  pageSize?: number
  status?: TemplateStatus
  categoryId?: string | null
  search?: string
  sortBy?: 'name' | 'updatedAt' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface GetTemplateRequest {
  id: string
  versionNumber?: number
}

export interface ListVersionsRequest {
  templateId: string
  page?: number
  pageSize?: number
}

export interface CreateCategoryRequest {
  name: string
  slug: string
  description?: string | null
  sortOrder?: number
}

export interface UpdateCategoryRequest {
  id: string
  name?: string
  slug?: string
  description?: string | null
  sortOrder?: number
}

export interface ExportTemplateRequest {
  templateId: string
  versionNumber?: number
  format: 'json' | 'png' | 'pdf'
}

export interface ImportTemplateRequest {
  name: string
  categoryId?: string | null
  document: TemplateDocumentInput
}

export interface RenderTemplateRequest {
  templateId: string
  versionNumber?: number
  data: Record<string, string | number | undefined>
}

// ─── Response DTOs ──────────────────────────────────────────────

export interface TemplateResponse {
  id: string
  name: string
  description: string | null
  categoryId: string | null
  status: TemplateStatus
  currentVersion: number
  currentVersionId: string
  thumbnailUrl: string | null
  tags: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export interface TemplateVersionResponse {
  id: string
  templateId: string
  versionNumber: number
  document: TemplateDocument
  changeSummary: string | null
  createdBy: string
  createdAt: string
}

export interface TemplateDetailResponse extends TemplateResponse {
  document: TemplateDocument
}

export interface TemplateListResponse {
  items: TemplateResponse[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface TemplateVersionListResponse {
  items: TemplateVersionResponse[]
  total: number
  page: number
  pageSize: number
}

export interface TemplateCategoryResponse {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
  templateCount: number
}

export interface TemplateCategoryListResponse {
  items: TemplateCategoryResponse[]
}

export interface DeleteTemplateResponse {
  id: string
  deleted: boolean
}

export interface CloneTemplateResponse {
  template: TemplateResponse
  sourceId: string
}

export interface RollbackVersionResponse {
  template: TemplateResponse
  restoredVersion: TemplateVersionResponse
}

export interface RenderTemplateResponse {
  document: TemplateDocument
  resolvedAt: string
}

export interface TemplateAuditLogResponse {
  id: string
  templateId: string
  versionId: string | null
  action: AuditAction
  actorId: string
  metadata: Record<string, unknown> | null
  createdAt: string
}

// ─── API Error ──────────────────────────────────────────────────

export interface ApiErrorResponse {
  code: string
  message: string
  details?: Record<string, string[]>
}

// ─── API Endpoints (contract reference) ─────────────────────────

export const PRINT_DESIGNER_API = {
  templates: '/api/v1/print-templates',
  templateById: (id: string) => `/api/v1/print-templates/${id}`,
  cloneTemplate: (id: string) => `/api/v1/print-templates/${id}/clone`,
  archiveTemplate: (id: string) => `/api/v1/print-templates/${id}/archive`,
  restoreTemplate: (id: string) => `/api/v1/print-templates/${id}/restore`,
  versions: (id: string) => `/api/v1/print-templates/${id}/versions`,
  versionByNumber: (id: string, version: number) =>
    `/api/v1/print-templates/${id}/versions/${version}`,
  rollback: (id: string) => `/api/v1/print-templates/${id}/rollback`,
  render: (id: string) => `/api/v1/print-templates/${id}/render`,
  categories: '/api/v1/print-template-categories',
  categoryById: (id: string) => `/api/v1/print-template-categories/${id}`,
  auditLogs: (id: string) => `/api/v1/print-templates/${id}/audit-logs`,
} as const

export type PaperConfigDto = PaperConfigInput
