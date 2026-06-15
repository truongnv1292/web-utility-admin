import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_DPI } from '../constants'
import { GridMode } from '../enums'
import type { SettingsStore } from './types'

const MAX_RECENT_TEMPLATES = 10

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      defaultDpi: DEFAULT_DPI,
      defaultGridMode: GridMode.MEDIUM,
      defaultSnapToGrid: true,
      showRulers: true,
      keyboardShortcutsEnabled: true,
      recentTemplateIds: [],

      setDefaultDpi: (defaultDpi) => set({ defaultDpi }),

      setDefaultGridMode: (defaultGridMode) => set({ defaultGridMode }),

      setDefaultSnapToGrid: (defaultSnapToGrid) => set({ defaultSnapToGrid }),

      setShowRulers: (showRulers) => set({ showRulers }),

      setKeyboardShortcutsEnabled: (keyboardShortcutsEnabled) =>
        set({ keyboardShortcutsEnabled }),

      addRecentTemplate: (templateId) =>
        set((state) => {
          const filtered = state.recentTemplateIds.filter(
            (id) => id !== templateId
          )
          return {
            recentTemplateIds: [templateId, ...filtered].slice(
              0,
              MAX_RECENT_TEMPLATES
            ),
          }
        }),

      reset: () =>
        set({
          defaultDpi: DEFAULT_DPI,
          defaultGridMode: GridMode.MEDIUM,
          defaultSnapToGrid: true,
          showRulers: true,
          keyboardShortcutsEnabled: true,
          recentTemplateIds: get().recentTemplateIds,
        }),
    }),
    {
      name: 'print-designer-settings',
      partialize: (state) => ({
        defaultDpi: state.defaultDpi,
        defaultGridMode: state.defaultGridMode,
        defaultSnapToGrid: state.defaultSnapToGrid,
        showRulers: state.showRulers,
        keyboardShortcutsEnabled: state.keyboardShortcutsEnabled,
        recentTemplateIds: state.recentTemplateIds,
      }),
    }
  )
)
