import {
  GridMode,
  PaperType,
  PaperUnit,
  TemplateVariableKey,
} from '../enums'
import type { PaperPreset } from '../types'

export const DEFAULT_DPI = 203
export const DESIGN_DPI = 96
export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 5
export const DEFAULT_ZOOM = 1
export const ZOOM_STEP = 0.1
export const HISTORY_MAX_SIZE = 50
export const NUDGE_STEP = 1
export const NUDGE_STEP_LARGE = 10

export const GRID_SIZE_MAP: Record<GridMode, number> = {
  [GridMode.NONE]: 0,
  [GridMode.SMALL]: 5,
  [GridMode.MEDIUM]: 10,
  [GridMode.LARGE]: 20,
}

export const PAPER_PRESETS: readonly PaperPreset[] = [
  {
    type: PaperType.A4,
    label: 'A4',
    width: 210,
    height: 297,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
  {
    type: PaperType.A5,
    label: 'A5',
    width: 148,
    height: 210,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
  {
    type: PaperType.A6,
    label: 'A6',
    width: 105,
    height: 148,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
  {
    type: PaperType.A7,
    label: 'A7',
    width: 74,
    height: 105,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
  {
    type: PaperType.LABEL_100x148,
    label: '100 × 148 mm',
    width: 100,
    height: 148,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
  {
    type: PaperType.LABEL_100x100,
    label: '100 × 100 mm',
    width: 100,
    height: 100,
    unit: PaperUnit.MM,
    defaultDpi: DEFAULT_DPI,
  },
] as const

export const DEFAULT_PAPER_PRESET = PAPER_PRESETS[4]

export interface TemplateVariableDefinition {
  key: TemplateVariableKey
  placeholder: string
  label: string
  sampleValue: string
}

export const TEMPLATE_VARIABLES: readonly TemplateVariableDefinition[] = [
  {
    key: TemplateVariableKey.TRACKING_NO,
    placeholder: '${trackingNo}',
    label: 'Tracking Number',
    sampleValue: '29061982',
  },
  {
    key: TemplateVariableKey.SENDER_NAME,
    placeholder: '${senderName}',
    label: 'Sender Name',
    sampleValue: 'Tổng Công Ty',
  },
  {
    key: TemplateVariableKey.SENDER_PHONE,
    placeholder: '${senderPhone}',
    label: 'Sender Phone',
    sampleValue: '0901234567',
  },
  {
    key: TemplateVariableKey.SENDER_ADDRESS,
    placeholder: '${senderAddress}',
    label: 'Sender Address',
    sampleValue: '123 Nguyễn Huệ, Q1, TP.HCM',
  },
  {
    key: TemplateVariableKey.RECEIVER_NAME,
    placeholder: '${receiverName}',
    label: 'Receiver Name',
    sampleValue: 'Người nhận',
  },
  {
    key: TemplateVariableKey.RECEIVER_PHONE,
    placeholder: '${receiverPhone}',
    label: 'Receiver Phone',
    sampleValue: '0987654321',
  },
  {
    key: TemplateVariableKey.RECEIVER_ADDRESS,
    placeholder: '${receiverAddress}',
    label: 'Receiver Address',
    sampleValue: '456 Lê Lợi, Q3, TP.HCM',
  },
  {
    key: TemplateVariableKey.COD,
    placeholder: '${cod}',
    label: 'COD Amount',
    sampleValue: '500,000',
  },
  {
    key: TemplateVariableKey.FEE,
    placeholder: '${fee}',
    label: 'Shipping Fee',
    sampleValue: '35,000',
  },
  {
    key: TemplateVariableKey.WEIGHT,
    placeholder: '${weight}',
    label: 'Weight',
    sampleValue: '1.5 kg',
  },
  {
    key: TemplateVariableKey.CONTENT,
    placeholder: '${content}',
    label: 'Content',
    sampleValue: 'iPhone 15 Pro Max',
  },
  {
    key: TemplateVariableKey.CREATED_DATE,
    placeholder: '${createdDate}',
    label: 'Created Date',
    sampleValue: '16/06/2026',
  },
  {
    key: TemplateVariableKey.BRANCH_CODE,
    placeholder: '${branchCode}',
    label: 'Branch Code',
    sampleValue: 'HN01',
  },
  {
    key: TemplateVariableKey.ROUTE_CODE,
    placeholder: '${routeCode}',
    label: 'Route Code',
    sampleValue: 'R-102',
  },
  {
    key: TemplateVariableKey.WAREHOUSE_CODE,
    placeholder: '${warehouseCode}',
    label: 'Warehouse Code',
    sampleValue: 'WH-HCM-01',
  },
] as const

export const SAMPLE_RUNTIME_DATA: Record<TemplateVariableKey, string> =
  Object.fromEntries(
    TEMPLATE_VARIABLES.map((v) => [v.key, v.sampleValue])
  ) as Record<TemplateVariableKey, string>
