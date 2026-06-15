import { LayoutTemplate } from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TooltipProvider } from '@/components/ui/tooltip'
import { PrintDesignerDndProvider } from './components/dnd'
import { DesignerWorkspace } from './components/designer-workspace'
import { PaperSettingsPanel } from './components/paper'
import { ElementPalette } from './components/toolbar/element-palette'
import { useTemplateStore } from './store'

export function PrintDesigner() {
  const name = useTemplateStore((s) => s.name)
  const isDirty = useTemplateStore((s) => s.isDirty)

  return (
    <PrintDesignerDndProvider>
      <TooltipProvider delayDuration={300}>
        <Header fixed>
          <div className='me-auto flex items-center gap-2'>
            <LayoutTemplate className='size-5 text-muted-foreground' />
            <div>
              <h1 className='text-sm leading-none font-semibold'>
                {name}
                {isDirty ? ' *' : ''}
              </h1>
              <p className='text-xs text-muted-foreground'>
                Print Template Designer
              </p>
            </div>
          </div>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </Header>

        <Main fixed fluid className='flex min-h-0 flex-1 flex-row gap-0 p-0'>
          <PaperSettingsPanel />
          <ElementPalette />
          <DesignerWorkspace />
        </Main>
      </TooltipProvider>
    </PrintDesignerDndProvider>
  )
}
