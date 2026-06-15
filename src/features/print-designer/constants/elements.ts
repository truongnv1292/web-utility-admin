import type { LucideIcon } from 'lucide-react'
import {
  Barcode,
  Braces,
  Circle,
  Image,
  Minus,
  QrCode,
  Square,
  Table,
  TextCursorInput,
  Type,
} from 'lucide-react'
import { ElementType } from '../enums'

export interface ElementPaletteItemConfig {
  type: ElementType
  label: string
  description: string
  icon: LucideIcon
}

export const ELEMENT_PALETTE_ITEMS: readonly ElementPaletteItemConfig[] = [
  {
    type: ElementType.TEXT,
    label: 'Text',
    description: 'Single line text',
    icon: Type,
  },
  {
    type: ElementType.MULTILINE_TEXT,
    label: 'Multiline',
    description: 'Paragraph text',
    icon: TextCursorInput,
  },
  {
    type: ElementType.BARCODE,
    label: 'Barcode',
    description: 'CODE128, EAN13, PDF417',
    icon: Barcode,
  },
  {
    type: ElementType.QRCODE,
    label: 'QR Code',
    description: 'Dynamic QR code',
    icon: QrCode,
  },
  {
    type: ElementType.IMAGE,
    label: 'Image',
    description: 'Logo or background',
    icon: Image,
  },
  {
    type: ElementType.RECTANGLE,
    label: 'Rectangle',
    description: 'Box shape',
    icon: Square,
  },
  {
    type: ElementType.CIRCLE,
    label: 'Circle',
    description: 'Ellipse shape',
    icon: Circle,
  },
  {
    type: ElementType.LINE,
    label: 'Line',
    description: 'Straight line',
    icon: Minus,
  },
  {
    type: ElementType.TABLE,
    label: 'Table',
    description: 'Rows and columns',
    icon: Table,
  },
  {
    type: ElementType.DYNAMIC_FIELD,
    label: 'Variable',
    description: 'Dynamic field placeholder',
    icon: Braces,
  },
] as const

export const ELEMENT_PALETTE_MAP = Object.fromEntries(
  ELEMENT_PALETTE_ITEMS.map((item) => [item.type, item])
) as Record<ElementType, ElementPaletteItemConfig>
