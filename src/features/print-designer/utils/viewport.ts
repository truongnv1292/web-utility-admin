import { WORKSPACE_MARGIN_MULTIPLIER } from '../constants/canvas'
import { clamp } from './units'

export interface PanBounds {
  minPanX: number
  maxPanX: number
  minPanY: number
  maxPanY: number
}

export function computePanBounds(
  stageWidth: number,
  stageHeight: number,
  contentWidthPx: number,
  contentHeightPx: number
): PanBounds {
  const margin =
    Math.max(stageWidth, stageHeight) * WORKSPACE_MARGIN_MULTIPLIER

  return {
    minPanX: -(contentWidthPx + margin),
    maxPanX: stageWidth + margin,
    minPanY: -(contentHeightPx + margin),
    maxPanY: stageHeight + margin,
  }
}

export function clampPan(
  panX: number,
  panY: number,
  bounds: PanBounds
): { panX: number; panY: number } {
  return {
    panX: clamp(panX, bounds.minPanX, bounds.maxPanX),
    panY: clamp(panY, bounds.minPanY, bounds.maxPanY),
  }
}

export function panToScrollRatio(
  pan: number,
  min: number,
  max: number
): number {
  const span = max - min
  if (span <= 0) return 0
  return (pan - min) / span
}

export function scrollRatioToPan(
  ratio: number,
  min: number,
  max: number
): number {
  return min + clamp(ratio, 0, 1) * (max - min)
}

export function computeThumbMetrics(
  trackSize: number,
  viewportSize: number,
  contentSpan: number
): { thumbSize: number; thumbMaxOffset: number } {
  const thumbSize = Math.max(
    (viewportSize / contentSpan) * trackSize,
    24
  )
  const thumbMaxOffset = Math.max(trackSize - thumbSize, 0)
  return { thumbSize, thumbMaxOffset }
}
