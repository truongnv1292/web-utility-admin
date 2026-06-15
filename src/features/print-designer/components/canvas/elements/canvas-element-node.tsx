import { memo } from 'react'
import type Konva from 'konva'
import {
  Circle as KonvaCircle,
  Group,
  Line,
  Rect,
  Text,
} from 'react-konva'
import { ElementType, FontWeight } from '../../../enums'
import { TEMPLATE_VARIABLES } from '../../../constants'
import type { DesignerElement, TableCell, TableRow } from '../../../types/elements'

const FONT_WEIGHT_MAP: Record<FontWeight, string> = {
  [FontWeight.NORMAL]: 'normal',
  [FontWeight.MEDIUM]: '500',
  [FontWeight.SEMIBOLD]: '600',
  [FontWeight.BOLD]: 'bold',
}

interface CanvasElementNodeProps {
  element: DesignerElement
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string, event: Konva.KonvaEventObject<Event>) => void
  onMouseEnter: (id: string) => void
  onMouseLeave: () => void
}

export const CanvasElementNode = memo(function CanvasElementNode({
  element,
  isSelected,
  isHovered,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: CanvasElementNodeProps) {
  if (!element.visible) return null

  const commonProps = {
    x: element.x,
    y: element.y,
    rotation: element.rotation,
    listening: !element.locked,
    onClick: (event: Konva.KonvaEventObject<MouseEvent>) =>
      onSelect(element.id, event),
    onTap: (event: Konva.KonvaEventObject<TouchEvent>) =>
      onSelect(element.id, event),
    onMouseEnter: () => onMouseEnter(element.id),
    onMouseLeave: onMouseLeave,
  }

  const selectionStroke = isSelected ? '#3b82f6' : isHovered ? '#93c5fd' : undefined
  const selectionStrokeWidth = isSelected ? 2 : isHovered ? 1 : 0

  const renderContent = () => {
    switch (element.type) {
      case ElementType.TEXT:
      case ElementType.MULTILINE_TEXT:
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              fill='transparent'
            />
            <Text
              width={element.width}
              height={element.height}
              text={element.content}
              fontFamily={element.style.fontFamily}
              fontSize={element.style.fontSize}
              fontStyle={
                FONT_WEIGHT_MAP[element.style.fontWeight as FontWeight] ??
                'normal'
              }
              fill={element.style.color}
              align={element.style.textAlign.toLowerCase()}
              verticalAlign={element.style.verticalAlign.toLowerCase()}
              lineHeight={element.style.lineHeight}
              letterSpacing={element.style.letterSpacing}
              wrap={element.type === ElementType.MULTILINE_TEXT ? 'word' : 'none'}
              listening={false}
            />
          </>
        )

      case ElementType.BARCODE:
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.backgroundColor}
              stroke={element.barColor}
              strokeWidth={1}
            />
            <Text
              width={element.width}
              height={element.height}
              text={element.displayValue ? element.value : element.barcodeType}
              fontSize={10}
              fill={element.barColor}
              align='center'
              verticalAlign='middle'
              listening={false}
            />
          </>
        )

      case ElementType.QRCODE:
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.backgroundColor}
              stroke={element.foregroundColor}
              strokeWidth={1}
            />
            <Text
              width={element.width}
              height={element.height}
              text='QR'
              fontSize={12}
              fill={element.foregroundColor}
              align='center'
              verticalAlign='middle'
              listening={false}
            />
          </>
        )

      case ElementType.IMAGE:
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              fill='#f1f5f9'
              stroke={element.style.borderColor}
              strokeWidth={element.style.borderWidth}
              cornerRadius={element.style.borderRadius}
              opacity={element.style.opacity}
            />
            <Text
              width={element.width}
              height={element.height}
              text={element.src ? element.alt : 'Image'}
              fontSize={11}
              fill='#64748b'
              align='center'
              verticalAlign='middle'
              listening={false}
            />
          </>
        )

      case ElementType.RECTANGLE:
        return (
          <Rect
            width={element.width}
            height={element.height}
            fill={element.style.backgroundColor}
            stroke={element.style.borderColor}
            strokeWidth={element.style.borderWidth}
            cornerRadius={element.style.borderRadius}
            opacity={element.style.opacity}
          />
        )

      case ElementType.CIRCLE:
        return (
          <KonvaCircle
            x={element.width / 2}
            y={element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            fill={element.style.backgroundColor}
            stroke={element.style.borderColor}
            strokeWidth={element.style.borderWidth}
            opacity={element.style.opacity}
          />
        )

      case ElementType.LINE:
        return (
          <Line
            points={element.points}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
            dash={element.dash}
            lineCap='round'
          />
        )

      case ElementType.TABLE: {
        const totalWidth = element.width
        let yOffset = 0
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              stroke={element.borderColor}
              strokeWidth={element.borderWidth}
              fill='#ffffff'
            />
            {element.rows.map((row: TableRow) => {
              let xOffset = 0
              const rowNodes = row.cells.map((cell: TableCell, cellIndex: number) => {
                const colWidth =
                  totalWidth * (element.columnWidths[cellIndex] ?? 0.5)
                const node = (
                  <Group key={cell.id} x={xOffset} y={yOffset}>
                    <Rect
                      width={colWidth}
                      height={row.height}
                      stroke={element.borderColor}
                      strokeWidth={element.borderWidth}
                      fill='#ffffff'
                    />
                    <Text
                      width={colWidth}
                      height={row.height}
                      text={cell.content}
                      fontSize={10}
                      fill='#0f172a'
                      align='center'
                      verticalAlign='middle'
                      listening={false}
                    />
                  </Group>
                )
                xOffset += colWidth
                return node
              })
              yOffset += row.height
              return rowNodes
            })}
          </>
        )
      }

      case ElementType.DYNAMIC_FIELD: {
        const variable = TEMPLATE_VARIABLES.find(
          (v: (typeof TEMPLATE_VARIABLES)[number]) => v.key === element.variableKey
        )
        const displayText = `${element.prefix}${variable?.placeholder ?? element.variableKey}${element.suffix}`
        return (
          <>
            <Rect
              width={element.width}
              height={element.height}
              fill='#eff6ff'
              stroke='#93c5fd'
              strokeWidth={1}
              dash={[4, 4]}
            />
            <Text
              width={element.width}
              height={element.height}
              text={displayText}
              fontFamily={element.style.fontFamily}
              fontSize={element.style.fontSize}
              fill={element.style.color}
              align='center'
              verticalAlign='middle'
              listening={false}
            />
          </>
        )
      }

      default:
        return null
    }
  }

  return (
    <Group {...commonProps}>
      {renderContent()}
      {(isSelected || isHovered) && (
        <Rect
          width={element.width}
          height={element.height}
          stroke={selectionStroke}
          strokeWidth={selectionStrokeWidth}
          dash={isSelected ? undefined : [4, 4]}
          listening={false}
        />
      )}
    </Group>
  )
})
