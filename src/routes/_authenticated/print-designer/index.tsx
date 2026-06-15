import { createFileRoute } from '@tanstack/react-router'
import { PrintDesigner } from '@/features/print-designer'

export const Route = createFileRoute('/_authenticated/print-designer/')({
  component: PrintDesigner,
})
