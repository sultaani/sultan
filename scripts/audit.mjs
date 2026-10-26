// End-to-end audit against a running server:  BASE=http://localhost:3000 SHOTS=./shots node scripts/audit.mjs
// Checks console errors, behaviours (roles, hover-pause, filters, nav, Calm mode, keyboard), runs axe-core, and saves screenshots.
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:3000'
const SHOTS = process.env.SHOTS || './shots'
mkdirSync(SHOTS, { recursive: true })
const results = []
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`) }
const browser = await chromium.launch()
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', (e) => errors.push(String(e)))
  return { ctx, page, errors }
}

// ---------- Desktop
{
  const { ctx, page, errors } = await newPage()
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(2200)
  await page.screenshot({ path: `${SHOTS}/01-hero-desktop.png` })
  ok('hero shows only name + role', (await page.locator('.hero__inner').innerText()).split('\n').filter(Boolean).length <= 2 + 4)
  ok('hero name', (await page.locator('h1').textContent()).includes('Sultan Ipinmisho'))
  ok('no eyebrow elements', await page.locator('.eyebrow').count() === 0)
  ok('single font family (Roboto)', await page.evaluate(() => { const f = new Set(); document.querySelectorAll('body *').forEach((e) => f.add(getComputedStyle(e).fontFamily.split(',')[0].replace(/["']/g, '').trim())); return f.size === 1 && [...f][0].startsWith('Roboto') }), await page.evaluate(() => { const f = new Set(); document.querySelectorAll('body *').forEach((e) => f.add(getComputedStyle(e).fontFamily.split(',')[0])); return [...f].join(' | ') }))
  const act = () => page.locator('.roles__item[data-state="active"]').textContent()
  const r1 = await act(); await page.waitForTimeout(2300); const r2 = await act()
  ok('roles rotate', r1 !== r2, `${r1} -> ${r2}`)
  ok('no pause button', await page.locator('.roles__pause').count() === 0)
  await page.hover('.roles'); const h1 = await act(); await page.waitForTimeout(2600)
  ok('roles pause on hover', h1 === await act())
  await page.mouse.move(10, 10); await page.waitForTimeout(2300)
  ok('roles resume after hover', h1 !== await act())
  ok('city skyline rendered', await page.locator('.city__block').count() >= 20)
  await page.mouse.move(700, 800); await page.waitForTimeout(600)
  ok('city reacts to pointer', await page.evaluate(() => [...document.querySelectorAll('.city__block')].some((b) => parseFloat(b.style.getPropertyValue('--lift')) > 0.3)))
  await page.screenshot({ path: `${SHOTS}/02-hero-hover.png` })
  // ---- night / day, lamp, cursor, wipe
  const world = () => page.evaluate(() => document.documentElement.dataset.world)
  ok('hero starts at night', (await world()) === 'night')
  ok('lamp + workstation drawn', await page.locator('.scene__art').count() === 1 && await page.locator('.scene__desk').count() === 1)
  ok('header letters light over night hero', await page.evaluate(() => getComputedStyle(document.querySelector('.brand')).color === 'rgb(246, 239, 230)'))
  await page.screenshot({ path: `${SHOTS}/02b-night-lamp.png` })
  ok('custom cursor active', await page.evaluate(() => document.documentElement.classList.contains('cc')))
  await page.hover('.scene__hit'); await page.waitForTimeout(500)
  ok('cursor labels the lamp', (await page.locator('.cursor__label').textContent()) === 'Day')
  await page.screenshot({ path: `${SHOTS}/02c-lamp-hover.png` })
  await page.click('.scene__hit'); await page.waitForTimeout(1900)
  ok('lamp switches to day', (await world()) === 'day')
  ok('header letters dark in day', await page.evaluate(() => getComputedStyle(document.querySelector('.brand')).color !== 'rgb(246, 239, 230)'))
  await page.mouse.move(10, 10); await page.waitForTimeout(300)
  await page.screenshot({ path: `${SHOTS}/02d-day.png` })
  await page.click('button[aria-label="Switch to night"]'); await page.waitForTimeout(1500)
  ok('header switch returns to night', (await world()) === 'night')
  await page.focus('.scene__hit'); await page.keyboard.press('Enter'); await page.waitForTimeout(300)
  ok('lamp works with keyboard', (await world()) === 'day')
  await page.click('button[aria-label="Switch to night"]'); await page.waitForTimeout(1300)
  await page.evaluate(() => { document.documentElement.dataset.cursor = 'off' }); await page.waitForTimeout(200)
  ok('cursor can be switched off', await page.evaluate(() => !document.documentElement.classList.contains('cc')))
  await page.evaluate(() => { document.documentElement.dataset.cursor = 'on' }); await page.waitForTimeout(200)
  await page.mouse.move(400, 300); await page.waitForTimeout(100)

  const navBg = await page.evaluate(() => { const a = document.querySelector('.nav a'); const s = getComputedStyle(a); return `${s.backgroundColor}|${s.borderTopWidth}` })
  ok('nav links plain text (no background/border)', navBg === 'rgba(0, 0, 0, 0)|0px', navBg)
  ok('header shows full name text', (await page.locator('.brand').textContent()).trim() === 'Sultan Ipinmisho')

  for (const [id, shot] of [['about', '03-about'], ['services', '04-services'], ['work', '05-work'], ['technologies', '06-tech'], ['interests', '07-interests'], ['journey', '08-journey'], ['contact', '09-contact']]) {
    await page.evaluate((i) => document.getElementById(i).scrollIntoView({ block: 'start' }), id); await page.waitForTimeout(1300)
    const t = await page.locator(`#${id} .section-title`).evaluate((e) => getComputedStyle(e).textAlign)
    ok(`${id}: centred title`, t === 'center')
    await page.screenshot({ path: `${SHOTS}/${shot}.png` })
  }
  ok('six service cards', await page.locator('.service').count() === 6)
  ok('about covers all three themes', await page.evaluate(() => { const t = document.getElementById('about').innerText.toLowerCase(); return ['small business', 'healthtech', 'edtech', 'waste', 'young entrepreneurs', 'community'].every((w) => t.includes(w)) }))
  ok('about tagline', (await page.locator('.about__tagline').textContent()).includes('write code'))
  const before = await page.locator('#work .card').count()
  await page.evaluate(() => document.getElementById('work').scrollIntoView())
  await page.locator('.filters button', { hasText: 'User experience design' }).click(); await page.waitForTimeout(500)
  const after = await page.locator('#work .card').count()
  ok('work filter narrows list', after > 0 && after < before, `${before} -> ${after}`)
  ok('crafting tag text', (await page.locator('.tag--craft').first().textContent()).includes('SI. Is still crafting'))
  const tn = await page.locator('.tech__name').allTextContents()
  ok('retired technologies are gone', ['Docker', 'Tailwind CSS', 'TypeScript', 'PostgreSQL', 'MySQL'].every((x) => !tn.includes(x)))
  ok('technologies include required', ['Python', 'Flask', 'Laravel', 'PHP', 'React', 'Next.js', 'Flutter', 'Dart', 'Android', 'Java', 'Figma', 'Claude', 'Canva'].every((x) => tn.includes(x)), `${tn.length} tiles`)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); await page.waitForTimeout(900)
  const soc = await page.locator('.socials a').evaluateAll((a) => a.map((x) => x.getAttribute('aria-label')))
  ok('footer social icons', soc.length === 5, soc.join(' | '))
  await page.screenshot({ path: `${SHOTS}/10-footer.png` })

  await page.goto(BASE + '/work', { waitUntil: 'load' }); await page.waitForTimeout(900)
  await page.screenshot({ path: `${SHOTS}/11-work-index.png` })
  await page.locator('.card__link').first().click(); await page.waitForURL(/\/work\/.+/); await page.waitForTimeout(1200)
  await page.screenshot({ path: `${SHOTS}/12-case-crafting.png` })
  await page.goto(BASE + '/work/insideoutbrand', { waitUntil: 'load' }); await page.waitForTimeout(900)
  await page.screenshot({ path: `${SHOTS}/13-case-live.png`, fullPage: true })
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800)
  await page.keyboard.press('Tab')
  ok('skip link first tab stop', await page.evaluate(() => document.activeElement?.classList.contains('skip-link')))
  await page.keyboard.press('Control+k'); await page.waitForTimeout(300)
  ok('command palette opens', await page.locator('.palette').count() === 1)
  await page.keyboard.press('Escape')
  await page.click('[aria-label="Accessibility settings"]'); await page.waitForTimeout(300)
  await page.screenshot({ path: `${SHOTS}/14-a11y-panel.png` })
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800)
  await page.evaluate(() => document.getElementById('work').scrollIntoView({ block: 'start' })); await page.waitForTimeout(1200)
  await page.click('text=All projects'); await page.waitForTimeout(250)
  ok('block wipe covers during page change', await page.evaluate(() => document.querySelector('.wipe').dataset.phase === 'cover'))
  await page.waitForURL('**/work', { timeout: 8000 }); await page.waitForTimeout(1800)
  ok('wipe releases after page change', await page.evaluate(() => document.querySelector('.wipe').dataset.phase === 'idle'))
  await page.screenshot({ path: `${SHOTS}/11b-after-wipe.png` })
  ok('no console errors (desktop)', errors.length === 0, errors.slice(0, 3).join(' || '))
  await ctx.close()
}

// ---------- axe
for (const path of ['/', '/work', '/work/zentry', '/work/insideoutbrand']) {
  const { ctx, page } = await newPage()
  await page.goto(BASE + path, { waitUntil: 'load' }); await page.waitForTimeout(1200)
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'))); await page.waitForTimeout(1600)
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  ok(`axe ${path}`, res.violations.length === 0, res.violations.map((v) => `${v.id}(${v.nodes.length}): ${v.nodes[0].target}`).join(' ; '))
  await ctx.close()
}

// ---------- Calm + modes
{
  const { ctx, page, errors } = await newPage({ reducedMotion: 'reduce' })
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(1000)
  ok('calm on with reduced motion', await page.evaluate(() => document.documentElement.dataset.calm === 'true'))
  ok('roles listed statically in calm', (await page.locator('.roles--list').textContent()).includes('AI Enthusiast'))
  await page.screenshot({ path: `${SHOTS}/15-calm.png` })
  await page.evaluate(() => { const d = document.documentElement; d.dataset.contrast = 'high'; d.dataset.spacing = 'comfortable'; d.dataset.text = 'xl' }); await page.waitForTimeout(400)
  await page.screenshot({ path: `${SHOTS}/16-highcontrast.png` })
  ok('no console errors (calm)', errors.length === 0, errors.slice(0, 3).join(' || '))
  await ctx.close()
}

// ---------- Viewports
for (const [w, h, tag] of [[375, 812, 'mobile'], [768, 1024, 'tablet'], [1024, 768, 'laptop']]) {
  const { ctx, page, errors } = await newPage({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1, isMobile: w < 500, hasTouch: w < 800 })
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(2000)
  await page.screenshot({ path: `${SHOTS}/20-${tag}-hero.png` })
  ok(`${tag}: no horizontal scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1))
  if (w < 1000) { await page.tap('.menu-toggle'); await page.waitForTimeout(400); await page.screenshot({ path: `${SHOTS}/21-${tag}-menu.png` }); await page.tap('.menu-toggle') }
  for (const id of ['about', 'services', 'work', 'technologies', 'contact']) {
    await page.evaluate((i) => document.getElementById(i).scrollIntoView(), id); await page.waitForTimeout(1000)
    if (tag === 'mobile') await page.screenshot({ path: `${SHOTS}/22-m-${id}.png` })
  }
  ok(`${tag}: no console errors`, errors.length === 0, errors.slice(0, 3).join(' || '))
  await ctx.close()
}
{
  const r = await fetch(BASE + '/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: '', email: 'x', subject: '', message: '' }) })
  ok('contact API rejects invalid', r.status === 422, String(r.status))
}
await browser.close()
const failed = results.filter((r) => !r.pass)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
