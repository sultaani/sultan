import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Public pages are cached (ISR). Whenever content changes in the CMS we purge the whole
 * frontend layout so edits appear immediately instead of waiting for the revalidate window.
 * Wrapped in try/catch because the hooks also run from the seed script, outside a Next request.
 */
const purge = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    /* not inside a Next.js request (e.g. seed script) */
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  purge()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  purge()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  purge()
  return doc
}
