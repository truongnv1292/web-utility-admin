import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MIN_ZOOM, MAX_ZOOM } from '../constants'
import { CanvasTool } from '../enums'
import { useDesignerStore } from '../store'
import type { PaperConfig } from '../types'
import {
  clamp,
  clampPan,
  computeFitToScreen,
  computePanBounds,
  getPaperDimensions,
} from '../utils'

interface UseCanvasViewportOptions {
  stageWidth: number
  stageHeight: number
  paper: PaperConfig
}

export function useCanvasViewport({
  stageWidth,
  stageHeight,
  paper,
}: UseCanvasViewportOptions) {
  const zoom = useDesignerStore((s) => s.zoom)
  const panX = useDesignerStore((s) => s.panX)
  const panY = useDesignerStore((s) => s.panY)
  const activeTool = useDesignerStore((s) => s.activeTool)
  const setZoom = useDesignerStore((s) => s.setZoom)
  const setPan = useDesignerStore((s) => s.setPan)
  const setActiveTool = useDesignerStore((s) => s.setActiveTool)
  const zoomIn = useDesignerStore((s) => s.zoomIn)
  const zoomOut = useDesignerStore((s) => s.zoomOut)

  const isPanningRef = useRef(false)
  const lastPointerRef = useRef({ x: 0, y: 0 })
  const [spacePressed, setSpacePressed] = useState(false)
  const [isPanning, setIsPanning] = useState(false)

  const { widthPx, heightPx } = useMemo(
    () => getPaperDimensions(paper),
    [paper]
  )

  const contentWidthPx = widthPx * zoom
  const contentHeightPx = heightPx * zoom

  const panBounds = useMemo(
    () =>
      computePanBounds(
        stageWidth,
        stageHeight,
        contentWidthPx,
        contentHeightPx
      ),
    [contentHeightPx, contentWidthPx, stageHeight, stageWidth]
  )

  const setPanClamped = useCallback(
    (nextPanX: number, nextPanY: number) => {
      const clamped = clampPan(nextPanX, nextPanY, panBounds)
      setPan(clamped.panX, clamped.panY)
    },
    [panBounds, setPan]
  )

  const fitToScreen = useCallback(() => {
    if (stageWidth <= 0 || stageHeight <= 0) return
    const view = computeFitToScreen(stageWidth, stageHeight, paper)
    setZoom(view.zoom)
    setPanClamped(view.panX, view.panY)
  }, [paper, setPanClamped, setZoom, stageHeight, stageWidth])

  const zoomAtPoint = useCallback(
    (pointerX: number, pointerY: number, newZoom: number) => {
      const clampedZoom = clamp(newZoom, MIN_ZOOM, MAX_ZOOM)
      const ratio = clampedZoom / zoom
      const nextPanX = pointerX - (pointerX - panX) * ratio
      const nextPanY = pointerY - (pointerY - panY) * ratio
      setZoom(clampedZoom)
      setPanClamped(nextPanX, nextPanY)
    },
    [panX, panY, setPanClamped, setZoom, zoom]
  )

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()
      const container = event.currentTarget as HTMLElement
      const rect = container.getBoundingClientRect()
      const pointerX = event.clientX - rect.left
      const pointerY = event.clientY - rect.top

      if (event.shiftKey) {
        setPanClamped(panX - event.deltaY, panY)
        return
      }

      const delta = event.deltaY > 0 ? -0.08 : 0.08
      zoomAtPoint(pointerX, pointerY, zoom + delta)
    },
    [panX, panY, setPanClamped, zoom, zoomAtPoint]
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const isMiddleButton = event.button === 1
      const isSpacePan = spacePressed && event.button === 0
      const isHandPan =
        activeTool === CanvasTool.HAND && event.button === 0

      if (!isMiddleButton && !isSpacePan && !isHandPan) return

      event.preventDefault()
      isPanningRef.current = true
      setIsPanning(true)
      lastPointerRef.current = { x: event.clientX, y: event.clientY }
      event.currentTarget.setPointerCapture(event.pointerId)
    },
    [activeTool, spacePressed]
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isPanningRef.current) return

      const deltaX = event.clientX - lastPointerRef.current.x
      const deltaY = event.clientY - lastPointerRef.current.y
      lastPointerRef.current = { x: event.clientX, y: event.clientY }

      const { panX: currentPanX, panY: currentPanY } =
        useDesignerStore.getState()
      setPanClamped(currentPanX + deltaX, currentPanY + deltaY)
    },
    [setPanClamped]
  )

  const stopPanning = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isPanningRef.current) return
      isPanningRef.current = false
      setIsPanning(false)
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    },
    []
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (event.code === 'Space' && !event.repeat) {
        event.preventDefault()
        setSpacePressed(true)
      }

      if (event.key.toLowerCase() === 'h' && !event.metaKey && !event.ctrlKey) {
        setActiveTool(CanvasTool.HAND)
      }

      if (event.key.toLowerCase() === 'v' && !event.metaKey && !event.ctrlKey) {
        setActiveTool(CanvasTool.SELECT)
      }
    }

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        setSpacePressed(false)
        isPanningRef.current = false
        setIsPanning(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [setActiveTool])

  useEffect(() => {
    if (stageWidth <= 0 || stageHeight <= 0) return
    fitToScreen()
  }, [paper.width, paper.height, paper.dpi, paper.orientation, stageWidth, stageHeight]) // eslint-disable-line react-hooks/exhaustive-deps -- refit when paper or stage changes

  useEffect(() => {
    setPanClamped(panX, panY)
  }, [panBounds]) // eslint-disable-line react-hooks/exhaustive-deps -- reclamp when bounds change

  const isHandMode = activeTool === CanvasTool.HAND || spacePressed

  const cursor = isPanning
    ? 'grabbing'
    : isHandMode
      ? 'grab'
      : 'default'

  return {
    zoom,
    panX,
    panY,
    panBounds,
    contentWidthPx,
    contentHeightPx,
    activeTool,
    zoomIn,
    zoomOut,
    setZoom,
    fitToScreen,
    setPanClamped,
    handleWheel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: stopPanning,
    handlePointerLeave: stopPanning,
    isSpacePressed: spacePressed,
    isHandMode,
    cursor,
  }
}
