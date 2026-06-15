import type { ElementType } from '../enums'

export interface BaseElement {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  visible: boolean
  locked: boolean
}

export interface ElementStyle {
  opacity: number
  backgroundColor: string
  borderWidth: number
  borderColor: string
  borderRadius: number
  padding: number
}

export interface TextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: string
  color: string
  textAlign: string
  verticalAlign: string
  lineHeight: number
  letterSpacing: number
}
