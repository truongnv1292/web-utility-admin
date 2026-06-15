import { useDrag } from 'react-dnd'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ElementPaletteItemConfig } from '../../constants/elements'
import { DND_ELEMENT_TYPE } from '../dnd'

interface ElementPaletteItemProps {
  item: ElementPaletteItemConfig
  onClickAdd: () => void
}

export function ElementPaletteItem({ item, onClickAdd }: ElementPaletteItemProps) {
  const Icon = item.icon

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: DND_ELEMENT_TYPE,
      item: { type: item.type },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item.type]
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          ref={(node) => {
            drag(node)
          }}
          type='button'
          className={cn(
            'flex size-10 items-center justify-center rounded-md border border-transparent text-muted-foreground transition-colors',
            'hover:border-border hover:bg-accent hover:text-accent-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
            isDragging && 'opacity-40'
          )}
          onClick={onClickAdd}
          aria-label={item.label}
        >
          <Icon className='size-4' />
        </button>
      </TooltipTrigger>
      <TooltipContent side='right'>
        <p className='font-medium'>{item.label}</p>
        <p className='text-xs text-muted-foreground'>{item.description}</p>
      </TooltipContent>
    </Tooltip>
  )
}
