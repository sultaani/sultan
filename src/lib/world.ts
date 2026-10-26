'use client'
import { useSyncExternalStore } from 'react'

export type World = 'night' | 'day'
const KEY = 'si-world'

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-world'] })
  return () => mo.disconnect()
}

/** The hero starts at night. `<html data-world>` is the source of truth, set before paint by the layout script. */
export function useWorld(): World {
  return useSyncExternalStore(subscribe, () => (document.documentElement.dataset.world === 'day' ? 'day' : 'night'), () => 'night')
}

export function setWorld(w: World) {
  document.documentElement.dataset.world = w
  try { sessionStorage.setItem(KEY, w) } catch { /* private mode: the choice just lasts until reload */ }
}

export function toggleWorld() {
  setWorld(document.documentElement.dataset.world === 'day' ? 'night' : 'day')
}
