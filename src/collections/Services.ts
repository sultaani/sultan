import type { CollectionConfig } from 'payload'
import { SERVICE_ICON_OPTIONS } from '../lib/tech-keys'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const slugify = (v: string) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'order', 'updatedAt'],
    description: 'The services you offer. Every project is filed under one service, which also powers the work filters.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeValidate: [({ data }) => { if (data && !data.slug && data.title) data.slug = slugify(data.title); return data }],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar', description: 'Auto-generated from the title.' } },
    { name: 'summary', type: 'textarea', required: true, admin: { description: 'One or two sentences shown inside the service drawer.' } },
    { name: 'icon', type: 'select', defaultValue: 'web', options: [...SERVICE_ICON_OPTIONS], admin: { position: 'sidebar' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
  ],
}
