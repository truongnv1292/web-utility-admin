import { useCallback, useEffect, useRef, useState } from 'react'

export interface CanvasSize {
  width: number
  height: number
}

export function useCanvasSize() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<CanvasSize>({ width: 0, height: 0 })

  const updateSize = useCallback(() => {
    const element = containerRef.current
    if (!element) return
    setSize({
      width: element.clientWidth,
      height: element.clientHeight,
    })
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    updateSize()

    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [updateSize])

  return { containerRef, size, updateSize }
}
