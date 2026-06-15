import { ElementType } from '../../enums'

export const DND_ELEMENT_TYPE = 'PRINT_DESIGNER_ELEMENT' as const

export interface ElementDragItem {
  type: ElementType
}

export interface ElementDropResult {
  paperX: number
  paperY: number
}

export function isElementDragItem(item: unknown): item is ElementDragItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'type' in item &&
    Object.values(ElementType).includes((item as ElementDragItem).type)
  )
}
