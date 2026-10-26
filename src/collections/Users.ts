import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email', group: 'System' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  fields: [{ name: 'name', type: 'text' }],
}
