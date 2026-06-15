import { create } from 'zustand'
import { HISTORY_MAX_SIZE } from '../constants'
import { HistoryActionType } from '../enums'
import type { DesignerDocument, HistorySnapshot } from '../types'
import type { HistoryStore } from './types'

function createSnapshot(
  document: DesignerDocument,
  actionType: HistoryActionType,
  label?: string
): HistorySnapshot {
  return {
    snapshotId: crypto.randomUUID(),
    timestamp: Date.now(),
    actionType,
    label,
    paper: structuredClone(document.paper),
    elements: structuredClone(document.elements),
    elementOrder: [...document.elementOrder],
  }
}

export const useHistoryStore = create<HistoryStore>()((set, get) => ({
  past: [],
  future: [],
  maxSize: HISTORY_MAX_SIZE,

  pushSnapshot: (snapshot) =>
    set((state) => {
      const past = [...state.past, snapshot]
      if (past.length > state.maxSize) {
        past.shift()
      }
      return { past, future: [] }
    }),

  undo: () => {
    const state = get()
    if (state.past.length === 0) return null
    const snapshot = state.past[state.past.length - 1]
    set({
      past: state.past.slice(0, -1),
      future: [snapshot, ...state.future],
    })
    return snapshot
  },

  redo: () => {
    const state = get()
    if (state.future.length === 0) return null
    const [snapshot, ...rest] = state.future
    set({
      past: [...state.past, snapshot],
      future: rest,
    })
    return snapshot
  },

  clear: () => set({ past: [], future: [] }),

  canUndo: () => get().past.length > 0,

  canRedo: () => get().future.length > 0,
}))

export { createSnapshot }
