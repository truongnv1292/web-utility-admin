import Konva from 'konva'
import { ElementType } from '../enums'
import { SAMPLE_RUNTIME_DATA, TEMPLATE_VARIABLES } from '../constants'
import type { DesignerDocument } from '../types'
import type { DesignerElement, TableCell, TableRow } from '../types/elements'
import { buildKonvaFontStyle } from '../hooks/use-update-element'
import { getPaperDimensions } from './units'

export interface PaperExportOptions {
  pixelRatio?: number
  useSampleData?: boolean
}

function resolveDynamicFieldText(
  element: Extract<DesignerElement, { type: ElementType.DYNAMIC_FIELD }>,
  useSampleData: boolean
): string {
  const sample = SAMPLE_RUNTIME_DATA[element.variableKey] ?? element.fallbackValue
  const variable = TEMPLATE_VARIABLES.find((v) => v.key === element.variableKey)
  const value = useSampleData
    ? sample || variable?.sampleValue || element.variableKey
    : variable?.placeholder ?? element.variableKey
  return `${element.prefix}${value}${element.suffix}`
}

function addTextStyle(
  node: Konva.Text,
  style: {
    fontFamily: string
    fontSize: number
    fontWeight: string
    italic: boolean
    underline: boolean
    color: string
    textAlign: string
    verticalAlign: string
    lineHeight: number
    letterSpacing: number
  }
) {
  node.fontFamily(style.fontFamily)
  node.fontSize(style.fontSize)
  node.fontStyle(
    buildKonvaFontStyle({ fontWeight: style.fontWeight, italic: style.italic })
  )
  if (style.underline) node.textDecoration('underline')
  node.fill(style.color)
  node.align(style.textAlign.toLowerCase() as 'left' | 'center' | 'right')
  node.verticalAlign(
    style.verticalAlign.toLowerCase() as 'top' | 'middle' | 'bottom'
  )
  node.lineHeight(style.lineHeight)
  node.letterSpacing(style.letterSpacing)
}

function renderElementToGroup(
  element: DesignerElement,
  useSampleData: boolean
): Konva.Group | null {
  if (!element.visible) return null

  const group = new Konva.Group({
    x: element.x,
    y: element.y,
    rotation: element.rotation,
  })

  switch (element.type) {
    case ElementType.TEXT:
    case ElementType.MULTILINE_TEXT: {
      const text = new Konva.Text({
        width: element.width,
        height: element.height,
        text: element.content,
        wrap: element.type === ElementType.MULTILINE_TEXT ? 'word' : 'none',
      })
      addTextStyle(text, element.style)
      group.add(text)
      break
    }

    case ElementType.BARCODE: {
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          fill: element.backgroundColor,
          stroke: element.barColor,
          strokeWidth: 1,
        })
      )
      const text = new Konva.Text({
        width: element.width,
        height: element.height,
        text: element.displayValue ? element.value : element.barcodeType,
        fontSize: 10,
        fill: element.barColor,
        align: 'center',
        verticalAlign: 'middle',
      })
      group.add(text)
      break
    }

    case ElementType.QRCODE: {
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          fill: element.backgroundColor,
          stroke: element.foregroundColor,
          strokeWidth: 1,
        })
      )
      group.add(
        new Konva.Text({
          width: element.width,
          height: element.height,
          text: 'QR',
          fontSize: 12,
          fill: element.foregroundColor,
          align: 'center',
          verticalAlign: 'middle',
        })
      )
      break
    }

    case ElementType.IMAGE: {
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          fill: '#f1f5f9',
          stroke: element.style.borderColor,
          strokeWidth: element.style.borderWidth,
          cornerRadius: element.style.borderRadius,
          opacity: element.style.opacity,
        })
      )
      group.add(
        new Konva.Text({
          width: element.width,
          height: element.height,
          text: element.src ? element.alt : 'Image',
          fontSize: 11,
          fill: '#64748b',
          align: 'center',
          verticalAlign: 'middle',
        })
      )
      break
    }

    case ElementType.RECTANGLE: {
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          fill: element.style.backgroundColor,
          stroke: element.style.borderColor,
          strokeWidth: element.style.borderWidth,
          cornerRadius: element.style.borderRadius,
          opacity: element.style.opacity,
        })
      )
      break
    }

    case ElementType.CIRCLE: {
      group.add(
        new Konva.Circle({
          x: element.width / 2,
          y: element.height / 2,
          radius: Math.min(element.width, element.height) / 2,
          fill: element.style.backgroundColor,
          stroke: element.style.borderColor,
          strokeWidth: element.style.borderWidth,
          opacity: element.style.opacity,
        })
      )
      break
    }

    case ElementType.LINE: {
      group.add(
        new Konva.Line({
          points: element.points,
          stroke: element.strokeColor,
          strokeWidth: element.strokeWidth,
          dash: element.dash,
          lineCap: 'round',
        })
      )
      break
    }

    case ElementType.TABLE: {
      const totalWidth = element.width
      let yOffset = 0
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          stroke: element.borderColor,
          strokeWidth: element.borderWidth,
          fill: '#ffffff',
        })
      )
      for (const row of element.rows as TableRow[]) {
        let xOffset = 0
        for (const [cellIndex, cell] of row.cells.entries()) {
          const colWidth = totalWidth * (element.columnWidths[cellIndex] ?? 0.5)
          const cellGroup = new Konva.Group({ x: xOffset, y: yOffset })
          cellGroup.add(
            new Konva.Rect({
              width: colWidth,
              height: row.height,
              stroke: element.borderColor,
              strokeWidth: element.borderWidth,
              fill: '#ffffff',
            })
          )
          cellGroup.add(
            new Konva.Text({
              width: colWidth,
              height: row.height,
              text: (cell as TableCell).content,
              fontSize: 10,
              fill: '#0f172a',
              align: 'center',
              verticalAlign: 'middle',
            })
          )
          group.add(cellGroup)
          xOffset += colWidth
        }
        yOffset += row.height
      }
      break
    }

    case ElementType.DYNAMIC_FIELD: {
      group.add(
        new Konva.Rect({
          width: element.width,
          height: element.height,
          fill: useSampleData ? '#ffffff' : '#eff6ff',
          stroke: useSampleData ? 'transparent' : '#93c5fd',
          strokeWidth: useSampleData ? 0 : 1,
          dash: useSampleData ? undefined : [4, 4],
        })
      )
      const text = new Konva.Text({
        width: element.width,
        height: element.height,
        text: resolveDynamicFieldText(element, useSampleData),
        align: 'center',
        verticalAlign: 'middle',
      })
      addTextStyle(text, element.style)
      group.add(text)
      break
    }

    default:
      return null
  }

  return group
}

export function exportPaperToDataUrl(
  doc: DesignerDocument,
  options: PaperExportOptions = {}
): string {
  const { pixelRatio = 2, useSampleData = true } = options
  const { widthPx, heightPx } = getPaperDimensions(doc.paper)

  const container = window.document.createElement('div')
  const stage = new Konva.Stage({
    container,
    width: widthPx,
    height: heightPx,
  })

  const layer = new Konva.Layer()
  stage.add(layer)

  layer.add(
    new Konva.Rect({
      width: widthPx,
      height: heightPx,
      fill: doc.paper.backgroundColor,
    })
  )

  const sortedIds = [...doc.elementOrder].sort(
    (a, b) => (doc.elements[a]?.zIndex ?? 0) - (doc.elements[b]?.zIndex ?? 0)
  )

  for (const id of sortedIds) {
    const element = doc.elements[id]
    if (!element) continue
    const node = renderElementToGroup(element, useSampleData)
    if (node) layer.add(node)
  }

  layer.draw()
  const dataUrl = stage.toDataURL({ pixelRatio })
  stage.destroy()
  return dataUrl
}

export function printPaperDocument(doc: DesignerDocument): void {
  const { widthPx, heightPx, widthMm, heightMm } = getPaperDimensions(doc.paper)
  const dataUrl = exportPaperToDataUrl(doc, {
    pixelRatio: Math.max(2, doc.paper.dpi / 96),
    useSampleData: true,
  })

  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) return

  printWindow.document.write(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Print</title>
    <style>
      @page {
        size: ${widthMm}mm ${heightMm}mm;
        margin: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        width: ${widthMm}mm;
        height: ${heightMm}mm;
      }
      img {
        display: block;
        width: ${widthMm}mm;
        height: ${heightMm}mm;
        object-fit: fill;
      }
    </style>
  </head>
  <body>
    <img
      src="${dataUrl}"
      width="${widthPx}"
      height="${heightPx}"
      alt="Print template"
      onload="window.focus(); window.print();"
    />
  </body>
</html>`)
  printWindow.document.close()
}
