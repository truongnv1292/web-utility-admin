import { create } from 'zustand'
import { TemplateStatus } from '../enums'
import type { TemplateStore } from './types'

const initialTemplateState = {
  templateId: null as string | null,
  name: 'Untitled Template',
  description: null as string | null,
  categoryId: null as string | null,
  currentVersion: 0,
  status: TemplateStatus.DRAFT,
  isDirty: false,
}

export const useTemplateStore = create<TemplateStore>()((set) => ({
  ...initialTemplateState,

  loadMetadata: (metadata) =>
    set({
      templateId: metadata.templateId,
      name: metadata.name,
      description: metadata.description,
      categoryId: metadata.categoryId,
      currentVersion: metadata.currentVersion,
      status: metadata.status,
      isDirty: false,
    }),

  setName: (name) => set({ name, isDirty: true }),

  setDescription: (description) => set({ description, isDirty: true }),

  setCategoryId: (categoryId) => set({ categoryId, isDirty: true }),

  setVersion: (currentVersion) => set({ currentVersion }),

  markDirty: () => set({ isDirty: true }),

  resetDirty: () => set({ isDirty: false }),

  reset: () => set(initialTemplateState),
}))
