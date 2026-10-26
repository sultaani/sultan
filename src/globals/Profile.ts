import type { GlobalConfig } from 'payload'
import { INTEREST_ICON_OPTIONS } from '../lib/tech-keys'
import { revalidateGlobal } from '../hooks/revalidate'

export const Profile: GlobalConfig = {
  slug: 'profile',
  label: 'Home and About content',
  admin: { group: 'Site', description: 'The hero roles, the About section and your interests.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            { name: 'roles', type: 'array', admin: { description: 'The hero shows your name with these roles rolling underneath, one every two seconds (paused while hovered).' }, fields: [{ name: 'text', type: 'text', required: true }] },
          ],
        },
        {
          label: 'About',
          fields: [
            { name: 'aboutTagline', type: 'text', defaultValue: 'I don’t just write code.' },
            { name: 'aboutLead', type: 'textarea', admin: { description: 'One short opening sentence under the tagline.' } },
            { name: 'aboutBody', type: 'array', labels: { singular: 'Card', plural: 'Cards' }, admin: { description: 'Short cards, for example: What I do, What I have built, Where I am headed.' }, fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea', required: true }] },
            { name: 'portrait', type: 'upload', relationTo: 'media', admin: { description: 'Optional round portrait shown above the tagline.' } },
          ],
        },
        {
          label: 'Interests',
          fields: [
            {
              name: 'interests',
              type: 'array',
              labels: { singular: 'Interest', plural: 'Interests' },
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
                { name: 'icon', type: 'select', defaultValue: 'community', options: [...INTEREST_ICON_OPTIONS] },
              ],
            },
          ],
        },
      ],
    },
  ],
}
