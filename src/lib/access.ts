import type { Access } from 'payload'

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Public visitors only ever see published documents; editors see everything (incl. drafts). */
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}
