import { ScrollArea } from '@/components/ui/scroll-area'
import { ELEMENT_PALETTE_ITEMS } from '../../constants/elements'
import { useAddElement } from '../../hooks/use-add-element'
import { ElementPaletteItem } from './element-palette-item'

export function ElementPalette() {
  const { addElementAtCenter } = useAddElement()

  return (
    <aside className='flex w-14 shrink-0 flex-col border-r bg-background'>
      <div className='border-b px-2 py-3'>
        <p className='text-center text-[10px] font-semibold tracking-wide text-muted-foreground uppercase'>
          Tools
        </p>
      </div>
      <ScrollArea className='flex-1'>
        <div className='flex flex-col items-center gap-1 p-2'>
          {ELEMENT_PALETTE_ITEMS.map((item) => (
            <ElementPaletteItem
              key={item.type}
              item={item}
              onClickAdd={() => addElementAtCenter(item.type)}
            />
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}
