'use client'
import { useSyncExternalStore } from 'react'

/** Reads the site-wide Calm motion flag (`<html data-calm>`), kept up to date by the pre-paint script and the accessibility panel. */
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-calm'] })
  return () => mo.disconnect()
}
export function useCalm(): boolean {
  return useSyncExternalStore(subscribe, () => document.documentElement.dataset.calm === 'true', () => false)
}
