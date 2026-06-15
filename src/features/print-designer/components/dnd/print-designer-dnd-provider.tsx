import type { ReactNode } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface PrintDesignerDndProviderProps {
  children: ReactNode
}

export function PrintDesignerDndProvider({
  children,
}: PrintDesignerDndProviderProps) {
  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}
