import type { DesignerMode } from '../enums'
import type { DesignerElement } from './elements'
import type { CanvasViewport, PaperConfig } from './paper'

export interface DesignerDocument {
  paper: PaperConfig
  elements: Record<string, DesignerElement>
  elementOrder: string[]
}

export interface DesignerState extends DesignerDocument, CanvasViewport {
  mode: DesignerMode
}

export interface Point2D {
  x: number
  y: number
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SnapResult {
  x: number
  y: number
  snappedX: boolean
  snappedY: boolean
}

export interface ClipboardPayload {
  elements: DesignerElement[]
  offset: Point2D
}
