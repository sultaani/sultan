import type { CollectionConfig } from 'payload'
import { isLoggedIn } from '../lib/access'

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: { singular: 'Contact message', plural: 'Contact messages' },
  admin: {
    group: 'Inbox',
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'name', 'email', 'handled', 'createdAt'],
    description: 'Submissions from the contact form. Tick "handled" when you have replied.',
  },
  // Visitors never touch this collection directly: the /api/contact route validates and writes with server privileges.
  access: { read: isLoggedIn, create: () => false, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    { name: 'handled', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'ipHash', type: 'text', admin: { readOnly: true, position: 'sidebar', description: 'Salted hash, used only to throttle spam.' } },
  ],
}
