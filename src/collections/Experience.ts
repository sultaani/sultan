import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Experience: CollectionConfig = {
  slug: 'experience',
  labels: { singular: 'Journey entry', plural: 'Journey entries' },
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'organisation', 'type', 'startYear', 'order'] },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Role / title' },
    { name: 'organisation', type: 'text' },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'work',
      options: [
        { label: 'Work', value: 'work' },
        { label: 'Education', value: 'education' },
        { label: 'Venture / project', value: 'venture' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'startYear', type: 'number' },
        { name: 'endYear', type: 'number', admin: { condition: (_, s) => !s?.current } },
        { name: 'current', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'highlights', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
    { name: 'order', type: 'number', defaultValue: 100, admin: { description: 'Lower numbers appear first (use this for custom ordering).' } },
  ],
}
