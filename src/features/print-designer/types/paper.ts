import type { GridMode, Orientation, PaperType, PaperUnit } from '../enums'

export interface PaperMargin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface PaperConfig {
  type: PaperType
  orientation: Orientation
  width: number
  height: number
  unit: PaperUnit
  dpi: number
  margin: PaperMargin
  backgroundColor: string
}

export interface PaperPreset {
  type: PaperType
  label: string
  width: number
  height: number
  unit: PaperUnit
  defaultDpi: number
}

export interface CanvasViewport {
  zoom: number
  panX: number
  panY: number
  gridMode: GridMode
  snapToGrid: boolean
  gridSize: number
}

export interface PaperDimensions {
  widthPx: number
  heightPx: number
  widthMm: number
  heightMm: number
}
