import type { TemplateStatus } from '../enums'
import type { DesignerElement } from './elements'
import type { PaperConfig } from './paper'

export interface TemplateDocument {
  paper: PaperConfig
  elements: DesignerElement[]
}

export interface TemplateMetadata {
  id: string
  name: string
  description: string | null
  categoryId: string | null
  status: TemplateStatus
  currentVersion: number
  thumbnailUrl: string | null
  tags: string[]
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  archivedAt: string | null
}

export interface TemplateVersionInfo {
  id: string
  templateId: string
  versionNumber: number
  changeSummary: string | null
  createdBy: string
  createdAt: string
}

export interface TemplateWithDocument extends TemplateMetadata {
  document: TemplateDocument
}

export interface TemplateCategory {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

export interface RuntimeData {
  trackingNo?: string
  senderName?: string
  senderPhone?: string
  senderAddress?: string
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  cod?: string
  fee?: string
  weight?: string
  content?: string
  createdDate?: string
  branchCode?: string
  routeCode?: string
  warehouseCode?: string
}

export interface ResolvedDocument {
  paper: PaperConfig
  elements: DesignerElement[]
}
