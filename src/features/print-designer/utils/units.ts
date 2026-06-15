import { PaperUnit } from '../enums'
import { DESIGN_DPI } from '../constants'
import type { PaperConfig, PaperDimensions } from '../types'

const MM_PER_INCH = 25.4

export function mmToPx(mm: number, dpi: number = DESIGN_DPI): number {
  return (mm / MM_PER_INCH) * dpi
}

export function pxToMm(px: number, dpi: number = DESIGN_DPI): number {
  return (px / dpi) * MM_PER_INCH
}

export function convertToMm(value: number, unit: PaperUnit): number {
  switch (unit) {
    case PaperUnit.MM:
      return value
    case PaperUnit.CM:
      return value * 10
    case PaperUnit.INCH:
      return value * MM_PER_INCH
    case PaperUnit.PX:
      return pxToMm(value)
    default: {
      const _exhaustive: never = unit
      return _exhaustive
    }
  }
}

export function convertFromMm(
  mm: number,
  unit: PaperUnit,
  dpi: number = DESIGN_DPI
): number {
  switch (unit) {
    case PaperUnit.MM:
      return mm
    case PaperUnit.CM:
      return mm / 10
    case PaperUnit.INCH:
      return mm / MM_PER_INCH
    case PaperUnit.PX:
      return mmToPx(mm, dpi)
    default: {
      const _exhaustive: never = unit
      return _exhaustive
    }
  }
}

export function getPaperDimensions(paper: PaperConfig): PaperDimensions {
  const widthMm = convertToMm(paper.width, paper.unit)
  const heightMm = convertToMm(paper.height, paper.unit)
  return {
    widthMm,
    heightMm,
    widthPx: mmToPx(widthMm, paper.dpi),
    heightPx: mmToPx(heightMm, paper.dpi),
  }
}

export function snapToGrid(value: number, gridSize: number): number {
  if (gridSize <= 0) return value
  return Math.round(value / gridSize) * gridSize
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function generateElementId(): string {
  return crypto.randomUUID()
}
