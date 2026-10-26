import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    useAsTitle: 'alt',
    description:
      'Images, screenshots and your CV. Every image needs alt text so the site stays accessible.',
  },
  access: { read: () => true },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
    focalPoint: true,
    imageSizes: [
      { name: 'thumb', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 960, height: undefined, position: 'centre' },
      { name: 'wide', width: 1920, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt text',
      admin: {
        description:
          'Describe what the image shows for people using screen readers. For decorative images write a short neutral label.',
      },
    },
    { name: 'caption', type: 'text' },
  ],
}
