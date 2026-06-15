import type { HistoryActionType } from '../enums'
import type { DesignerDocument } from './designer'

export interface HistorySnapshot extends DesignerDocument {
  snapshotId: string
  timestamp: number
  actionType: HistoryActionType
  label?: string
}

export interface HistoryState {
  past: HistorySnapshot[]
  future: HistorySnapshot[]
  maxSize: number
}
