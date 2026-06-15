import { DEFAULT_DPI, PAPER_PRESETS } from '../constants'
import { Orientation, PaperType, PaperUnit } from '../enums'
import type { PaperConfig } from '../types'
import { getPaperDimensions } from './units'

export function createPaperFromPreset(
  type: PaperType,
  orientation: Orientation,
  dpi: number = DEFAULT_DPI,
  customWidth?: number,
  customHeight?: number
): PaperConfig {
  if (type === PaperType.CUSTOM) {
    return {
      type: PaperType.CUSTOM,
      orientation,
      width: customWidth ?? 100,
      height: customHeight ?? 148,
      unit: PaperUnit.MM,
      dpi,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      backgroundColor: '#ffffff',
    }
  }

  const preset =
    PAPER_PRESETS.find((item) => item.type === type) ?? PAPER_PRESETS[0]
  const isLandscape = orientation === Orientation.LANDSCAPE

  return {
    type,
    orientation,
    width: isLandscape ? preset.height : preset.width,
    height: isLandscape ? preset.width : preset.height,
    unit: preset.unit,
    dpi,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    backgroundColor: '#ffffff',
  }
}

export function computeFitToScreen(
  stageWidth: number,
  stageHeight: number,
  paper: PaperConfig,
  padding = 48
): { zoom: number; panX: number; panY: number } {
  const { widthPx, heightPx } = getPaperDimensions(paper)
  const availableWidth = Math.max(stageWidth - padding * 2, 1)
  const availableHeight = Math.max(stageHeight - padding * 2, 1)
  const zoom = Math.min(availableWidth / widthPx, availableHeight / heightPx, 1)

  return {
    zoom,
    panX: (stageWidth - widthPx * zoom) / 2,
    panY: (stageHeight - heightPx * zoom) / 2,
  }
}

export function computeCenterView(
  stageWidth: number,
  stageHeight: number,
  paper: PaperConfig,
  zoom: number
): { panX: number; panY: number } {
  const { widthPx, heightPx } = getPaperDimensions(paper)
  return {
    panX: (stageWidth - widthPx * zoom) / 2,
    panY: (stageHeight - heightPx * zoom) / 2,
  }
}

export function formatPaperSizeLabel(paper: PaperConfig): string {
  return `${paper.width} × ${paper.height} ${paper.unit} @ ${paper.dpi} DPI`
}
