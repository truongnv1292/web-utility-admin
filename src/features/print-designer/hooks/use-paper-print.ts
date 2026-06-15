import { useCallback, useState } from 'react'
import { useDesignerStore } from '../store'
import { exportPaperToDataUrl, printPaperDocument } from '../utils/paper-export'
import { formatPaperSizeLabel, getPaperDimensions } from '../utils'

export function usePaperPrint() {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

  const openPreview = useCallback(() => {
    const document = useDesignerStore.getState().getDocument()
    const dataUrl = exportPaperToDataUrl(document, { useSampleData: true })
    setPreviewImageUrl(dataUrl)
    setPreviewOpen(true)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewOpen(false)
  }, [])

  const print = useCallback(() => {
    const document = useDesignerStore.getState().getDocument()
    printPaperDocument(document)
  }, [])

  const printFromPreview = useCallback(() => {
    closePreview()
    print()
  }, [closePreview, print])

  const paperLabel = useCallback(() => {
    const paper = useDesignerStore.getState().paper
    return formatPaperSizeLabel(paper)
  }, [])

  const paperSizeMm = useCallback(() => {
    const paper = useDesignerStore.getState().paper
    const { widthMm, heightMm } = getPaperDimensions(paper)
    return { widthMm, heightMm }
  }, [])

  return {
    previewOpen,
    previewImageUrl,
    openPreview,
    closePreview,
    print,
    printFromPreview,
    paperLabel,
    paperSizeMm,
  }
}
