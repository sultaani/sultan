import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { publishedOrLoggedIn } from '../lib/access'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

const slugify = (v: string) =>
  v
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'stage', 'featured', 'order', '_status'],
    description: 'Each project appears under its service and gets its own page. For projects still being built, a short intro is enough: leave the case-study tab empty.',
  },
  access: { read: publishedOrLoggedIn },
  versions: { drafts: { autosave: { interval: 1500 } }, maxPerDoc: 15 },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
    beforeValidate: [
      ({ data }) => {
        if (data && !data.slug && data.title) data.slug = slugify(data.title)
        else if (data?.slug) data.slug = slugify(data.slug)
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            { name: 'title', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              admin: { position: 'sidebar', description: 'Auto-generated from the title. Used in the page URL.' },
            },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              admin: { description: 'One punchy line shown on cards and the map.' },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              admin: { description: 'Two or three sentences. Used for the page intro and SEO description.' },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'services',
              required: true,
              admin: { position: 'sidebar', description: 'Which service this project belongs to. Drives the filters on the site.' },
            },
            {
              name: 'stage',
              type: 'select',
              required: true,
              defaultValue: 'live',
              options: [
                { label: 'Live', value: 'live' },
                { label: 'Under development (shows "SI. Is still crafting")', value: 'building' },
                { label: 'Concept / prototype', value: 'concept' },
                { label: 'Completed (archived)', value: 'archived' },
              ],
              admin: { position: 'sidebar' },
            },
            { name: 'year', type: 'number', admin: { position: 'sidebar' } },
            { name: 'role', type: 'text', admin: { position: 'sidebar', description: 'e.g. Product, design and engineering' } },
            { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar', description: 'Featured projects are listed first within their service.' } },
            { name: 'order', type: 'number', defaultValue: 100, admin: { position: 'sidebar', description: 'Lower numbers appear first.' } },
            {
              name: 'accent',
              type: 'select',
              defaultValue: 'green',
              options: [
                { label: 'Moss', value: 'green' },
                { label: 'Sky', value: 'cyan' },
                { label: 'Gold', value: 'amber' },
                { label: 'Lilac', value: 'violet' },
                { label: 'Ember', value: 'rose' },
              ],
              admin: { position: 'sidebar', description: 'Colour identity of this project across the site.' },
            },
            { name: 'cover', type: 'upload', relationTo: 'media', admin: { description: 'Screenshot or hero image. If empty, a generative cover is drawn automatically.' } },
            {
              name: 'tech',
              type: 'array',
              labels: { singular: 'Technology', plural: 'Technologies' },
              admin: { description: 'Shown as small tags on the card and page.' },
              fields: [{ name: 'name', type: 'text', required: true }],
            },
            {
              type: 'row',
              fields: [
                { name: 'liveUrl', type: 'text', label: 'Live URL' },
                { name: 'repoUrl', type: 'text', label: 'Repository URL' },
              ],
            },
            {
              name: 'metrics',
              type: 'array',
              maxRows: 4,
              admin: { description: 'Only add real, verifiable numbers.' },
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'label', type: 'text', required: true },
              ],
            },
            {
              name: 'related',
              type: 'relationship',
              relationTo: 'projects',
              hasMany: true,
              admin: { description: 'Optional: other projects to suggest at the bottom of this page.' },
            },
          ],
        },
        {
          label: 'Case study',
          fields: [
            { name: 'problem', type: 'textarea', admin: { description: 'The problem and who it affects.' } },
            { name: 'approach', type: 'textarea', admin: { description: 'How you approached it: research, PRD, key decisions.' } },
            {
              name: 'architecture',
              type: 'array',
              labels: { singular: 'Step', plural: 'Architecture steps' },
              admin: { description: 'Animated architecture walk-through, one step per layer or decision.' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
              ],
            },
            { name: 'outcome', type: 'textarea', admin: { description: 'What shipped and what happened.' } },
            {
              name: 'body',
              type: 'richText',
              editor: lexicalEditor(),
              admin: { description: 'Optional long-form details, lessons learned, anything else.' },
            },
            {
              name: 'gallery',
              type: 'array',
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', type: 'text' },
            { name: 'seoDescription', type: 'textarea', maxLength: 180 },
          ],
        },
      ],
    },
  ],
}
