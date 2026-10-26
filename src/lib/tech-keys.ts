/** Plain data (no React) so both the CMS config and the UI can share it. */
export const TECH_OPTIONS = [
  { value: 'python', label: 'Python' },
  { value: 'flask', label: 'Flask' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'php', label: 'PHP' },
  { value: 'react', label: 'React' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'flutter', label: 'Flutter' },
  { value: 'dart', label: 'Dart' },
  { value: 'android', label: 'Android' },
  { value: 'java', label: 'Java' },
  { value: 'figma', label: 'Figma' },
  { value: 'claude', label: 'Claude' },
  { value: 'canva', label: 'Canva' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'tailwind', label: 'Tailwind CSS' },
  { value: 'docker', label: 'Docker' },
] as const

export const SERVICE_ICON_OPTIONS = [
  { value: 'web', label: 'Web (browser window)' },
  { value: 'mobile', label: 'Mobile (phone)' },
  { value: 'commerce', label: 'E-commerce (cart)' },
  { value: 'marketing', label: 'Marketing (megaphone)' },
  { value: 'design', label: 'Design (pen tool)' },
  { value: 'erp', label: 'ERP (connected blocks)' },
  { value: 'data', label: 'Data (chart)' },
  { value: 'ai', label: 'AI (spark)' },
] as const

export const INTEREST_ICON_OPTIONS = [
  { value: 'climate', label: 'Climate (leaf)' },
  { value: 'energy', label: 'Energy (sun)' },
  { value: 'community', label: 'Community (people)' },
  { value: 'ai', label: 'AI (spark)' },
  { value: 'health', label: 'Health (pulse)' },
  { value: 'education', label: 'Education (book)' },
] as const
