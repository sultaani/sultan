import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Site' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Sultan Ipinmisho' },
    { name: 'siteDescription', type: 'textarea', required: true, defaultValue: 'Software developer, AI enthusiast, product manager and UI/UX designer building web, mobile and ERP systems for businesses and communities.' },
    { name: 'email', type: 'email', admin: { description: 'Public contact email: used by the footer email icon and the contact page.' } },
    { name: 'location', type: 'text', defaultValue: 'Nigeria' },
    { name: 'timezone', type: 'text', defaultValue: 'Africa/Lagos', admin: { description: 'IANA timezone for the live clock in the HUD.' } },
    {
      type: 'row',
      fields: [
        { name: 'availability', type: 'select', defaultValue: 'open', options: [{ label: 'Open to projects', value: 'open' }, { label: 'Limited availability', value: 'limited' }, { label: 'Not available', value: 'closed' }] },
        { name: 'availabilityNote', type: 'text', defaultValue: 'Taking on select projects' },
      ],
    },
    {
      name: 'social',
      type: 'group',
      label: 'Social links (footer icons)',
      admin: { description: 'The footer always shows these five icons. An icon only becomes a working link once you fill it in here.' },
      fields: [
        { name: 'github', type: 'text', label: 'GitHub URL', admin: { placeholder: 'https://github.com/your-username' } },
        { name: 'linkedin', type: 'text', label: 'LinkedIn URL', admin: { placeholder: 'https://www.linkedin.com/in/your-name' } },
        { name: 'x', type: 'text', label: 'X URL', admin: { placeholder: 'https://x.com/your-handle' } },
        { name: 'whatsapp', type: 'text', label: 'WhatsApp number', admin: { description: 'International format, digits only. Example: 2348012345678', placeholder: '2348012345678' } },
      ],
    },
    { name: 'resume', type: 'upload', relationTo: 'media', label: 'CV / résumé (PDF)', filterOptions: { mimeType: { equals: 'application/pdf' } } },
    { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'Default social share image', admin: { description: 'Optional. A 1200x630 image. If empty a generated one is used.' } },
  ],
}
