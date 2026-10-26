import type { CollectionConfig } from 'payload'
import { TECH_OPTIONS } from '../lib/tech-keys'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Skills: CollectionConfig = {
  slug: 'skills',
  labels: { singular: 'Technology', plural: 'Technologies' },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'icon', 'order'],
    description: 'Each technology floats as an icon in the Technologies section. Pick a built-in icon, or upload your own.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'icon', type: 'select', options: [...TECH_OPTIONS], admin: { description: 'Built-in brand icon. Leave empty to use an uploaded icon or a plain label.' } },
    { name: 'iconImage', type: 'upload', relationTo: 'media', admin: { description: 'Optional: your own SVG or PNG (for example an official logo). Overrides the built-in icon.' } },
    { name: 'order', type: 'number', defaultValue: 100, admin: { description: 'Lower numbers appear first.' } },
  ],
}
