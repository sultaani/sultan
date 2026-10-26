# Sultan Ipinmisho: portfolio

Personal portfolio for sultanipinmisho.tech with a built-in CMS.

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript. Terracotta palette, night-time city hero with a street lamp, Roboto only.
- **CMS:** Payload 3, embedded at `/admin` (same deployment, same login).
- **Database:** PostgreSQL (Neon in production). **Media:** Vercel Blob in production, local disk in development.
- **Accessibility:** skip link, landmarks, 3px focus rings, Calm motion, high contrast, comfortable spacing, text size, custom-cursor switch, keyboard everywhere, WCAG 2.2 AA colour contrast.

## What is on the site

| Route | What it is |
| --- | --- |
| `/` | Hero (name, rotating role, night skyline, street lamp and workstation) → About → Services → Work → Technologies → Interests → Journey → Contact letter → Footer |
| `/work` | Every project, grouped by service |
| `/work/[slug]` | Project page. Projects marked "SI. Is still crafting" show a short introduction only |
| `/admin` | The CMS |
| `/about`, `/journey`, `/contact` | Redirect to the matching section on the home page |

The hero starts at night. Tapping the street lamp (or the sun/moon button in the header) switches it to day and back; the choice lasts for the browser session. Page changes play a block wipe. A soft custom cursor and magnetic buttons run for mouse users and can be switched off under Accessibility → Custom cursor; Calm mode turns off the cursor, the wipe and all hero animation. Section titles are centred. The role roller rotates every 2 seconds and pauses only while hovered or focused. `Ctrl+K` opens the command menu.

## What you edit in the CMS (`/admin`)

| Where | What |
| --- | --- |
| **Content → Services** | The six services, their short summaries and icons |
| **Content → Projects** | Each project: pick its **Service** (category), set **Stage** to *Under development* for "SI. Is still crafting", add cover, tech, case study |
| **Content → Technologies** | The floating icons. Pick a built-in icon or upload your own logo |
| **Content → Journey entries** | Your résumé timeline |
| **Content → Media** | Images and your CV PDF |
| **Site → Home and About content** | Headline, the four rotating roles, About tagline and text, Interests, portrait photo |
| **Site → Site settings** | Social links (GitHub, LinkedIn, X, WhatsApp), public email, CV upload, availability |
| **Inbox → Messages** | Everything sent through the contact form |

Footer social icons appear as soon as you fill in their links in **Site settings → Social links**. Nothing is invented for you.

## Local setup (Windows PowerShell)

Requirements: Node 20+ and a PostgreSQL database (a free Neon project works for local development too).

```powershell
npm install
Copy-Item .env.example .env
# edit .env: set DATABASE_URL and PAYLOAD_SECRET
npm run dev
```

Open http://localhost:3000/admin and create your first admin account, then in a second terminal:

```powershell
npm run seed
```

The seed adds the six services, your projects (filed under services), the technology icons, a starter journey and the About copy. It is safe to re-run: it never overwrites what you have edited. It does remove Docker, Tailwind CSS, TypeScript, PostgreSQL and MySQL from Technologies (retired from the floating field); edit the `RETIRED` list in `src/seed/seed.ts` if you ever want them back.

## Deploy: Vercel + Neon

1. **Neon:** create a project. Copy the **pooled** connection string (host contains `-pooler`).
2. **GitHub:** push this folder to a repository.
3. **Vercel:** import the repository and set the Build Command to `npm run build:vercel` (applies database migrations, then builds).
4. **Vercel → Storage:** create a **Blob** store and connect it to the project (adds `BLOB_READ_WRITE_TOKEN`).
5. **Environment variables** (Production):
   - `DATABASE_URL`: the pooled Neon string
   - `PAYLOAD_SECRET`: a long random value, generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `NEXT_PUBLIC_SITE_URL`: `https://sultanipinmisho.tech`
   - optional `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` for email alerts (messages are always saved in the CMS regardless)
6. Deploy, then open `/admin` and create your admin account. Run the seed once against production from your machine:
   ```powershell
   $env:DATABASE_URL="<neon pooled url>"; $env:PAYLOAD_SECRET="<same secret>"; $env:PAYLOAD_PUSH="false"; npm run seed
   ```
7. **Domain:** Vercel → Settings → Domains → add `sultanipinmisho.tech` and follow the DNS instructions.

Content edits in the CMS appear on the live site within a minute (and immediately after saving, via revalidation).

### Changing the data model later

Production never auto-syncs the schema. After you change a collection or global in `src/`:

```powershell
npm run migrate:create <name>   # commit the new file in src/migrations
```

`build:vercel` applies pending migrations on the next deploy.

## Scripts

| Command | |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run build:vercel` | Migrate then build (use on Vercel) |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run seed` | Starter content (idempotent) |
| `npm run migrate:create` / `npm run migrate` | Database migrations |
| `npm run audit` | Browser audit (see below) |

### Browser audit

With the production server running (`npm run build && npm start`):

```powershell
$env:BASE="http://localhost:3000"; $env:SHOTS=".\shots"; npm run audit
```

Checks the hero, night/day lamp switch, cursor, block wipe, role roller, section layout, filters, command menu, accessibility panel (Calm, contrast, spacing, text size), mobile layout, axe-core (WCAG 2.2 AA) on key pages and the contact API; saves screenshots to `SHOTS`. Playwright needs a browser once: `npx playwright install chromium`.

## Project structure

```
src/
  app/(frontend)/   public site (pages, CSS: globals, sections, case)
  app/(payload)/    CMS admin + API
  collections/      Projects, Services, Skills (Technologies), Experience, Media, Messages, Users
  globals/          Profile (hero/about/interests), SiteSettings
  components/       hero/ (city grid, role roller), sections/, header, footer, accessibility panel
  lib/              content getters, icon registry, types
  migrations/       database migrations (committed)
  seed/seed.ts      starter content
scripts/            audit.mjs, gen-icons.mjs
```

Brand icons come from the `simple-icons` and `react-icons` libraries (extracted by `scripts/gen-icons.mjs`). Canva is not published in either library, so it appears as a plain wordmark tile; upload an official logo in **Technologies → Canva → Icon image** if you want it.
