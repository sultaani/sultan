import { createHash } from 'crypto'
import { NextResponse } from 'next/server'
import { getClient } from '@/lib/payload'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX = { name: 120, email: 200, subject: 200, message: 5000 }
const HOURLY_LIMIT = 5

type Body = Partial<Record<'name' | 'email' | 'subject' | 'message' | 'website', unknown>> & { elapsed?: unknown }

function clean(v: unknown, max: number) {
  return typeof v === 'string' ? v.replace(/\u0000/g, '').trim().slice(0, max) : ''
}

function validate(b: { name: string; email: string; subject: string; message: string }) {
  const errors: Record<string, string> = {}
  if (!b.name) errors.name = 'Please tell me your name.'
  if (!b.email) errors.email = 'Please enter your email so I can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.email = 'That email address doesn’t look right.'
  if (!b.subject) errors.subject = 'Add a short subject.'
  if (b.message.length < 10) errors.message = 'Tell me a little more (at least 10 characters).'
  return errors
}

/** Optional email notification through Resend. Failure never loses the message: it is already saved in the CMS. */
async function notify(m: { name: string; email: string; subject: string; message: string }) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!key || !to) return
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: m.email,
        subject: `[Portfolio] ${m.subject}`,
        text: `From: ${m.name} <${m.email}>\n\n${m.message}`,
      }),
    })
  } catch (err) {
    console.error('[contact] notification failed', err)
  }
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return NextResponse.json({ message: 'Invalid request.' }, { status: 400 })
  }

  // Spam trap: bots fill the hidden field, or submit faster than a person can type.
  const tooFast = typeof body.elapsed === 'number' && body.elapsed < 1500
  if (clean(body.website, 200) || tooFast) {
    return NextResponse.json({ ok: true }) // pretend success so bots learn nothing
  }

  const data = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    subject: clean(body.subject, MAX.subject),
    message: clean(body.message, MAX.message),
  }
  const errors = validate(data)
  if (Object.keys(errors).length) return NextResponse.json({ message: 'Please check the highlighted fields.', errors }, { status: 422 })

  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown'
  const ipHash = createHash('sha256').update(`${ip}:${process.env.PAYLOAD_SECRET || ''}`).digest('hex').slice(0, 32)

  try {
    const payload = await getClient()
    // Throttle in the database (works on serverless, unlike an in-memory counter).
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const recent = await payload.count({ collection: 'messages', where: { and: [{ ipHash: { equals: ipHash } }, { createdAt: { greater_than: since } }] } })
    if (recent.totalDocs >= HOURLY_LIMIT) {
      return NextResponse.json({ message: 'You’ve sent a few messages already. Please try again in a little while.' }, { status: 429 })
    }
    await payload.create({ collection: 'messages', data: { ...data, ipHash }, overrideAccess: true })
    await notify(data)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] failed to save message', err)
    return NextResponse.json({ message: 'Something went wrong on my side. Please try again shortly.' }, { status: 500 })
  }
}
