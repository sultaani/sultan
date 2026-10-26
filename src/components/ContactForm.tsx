'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { Alert, ArrowRight, Check } from './Icons'

type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p className="err" id={id}><Alert width={16} height={16} />{message}</p> : null
}

export function ContactForm({ projectOptions }: { projectOptions?: string[] }) {
  const uid = useId()
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')
  const [failMsg, setFailMsg] = useState('')
  const startedAt = useRef(0)
  useEffect(() => { startedAt.current = Date.now() }, [])
  const summary = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  const validate = (d: FormData): Errors => {
    const e: Errors = {}
    if (!String(d.get('name') || '').trim()) e.name = 'Please tell me your name.'
    const email = String(d.get('email') || '').trim()
    if (!email) e.email = 'Please enter your email so I can reply.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'That email address doesn’t look right.'
    if (!String(d.get('subject') || '').trim()) e.subject = 'Add a short subject.'
    if (String(d.get('message') || '').trim().length < 10) e.message = 'Tell me a little more (at least 10 characters).'
    return e
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const data = new FormData(form)
    const e = validate(data)
    setErrors(e)
    if (Object.keys(e).length) {
      setState('idle')
      requestAnimationFrame(() => summary.current?.focus())
      return
    }
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...Object.fromEntries(data), elapsed: Date.now() - startedAt.current }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (json?.errors) { setErrors(json.errors); requestAnimationFrame(() => summary.current?.focus()) }
        setFailMsg(json?.message || 'Something went wrong. Please try again in a moment.')
        setState('fail')
        requestAnimationFrame(() => statusRef.current?.focus())
        return
      }
      form.reset()
      setState('ok')
      requestAnimationFrame(() => statusRef.current?.focus())
    } catch {
      setFailMsg('I couldn’t reach the server. Check your connection and try again.')
      setState('fail')
      requestAnimationFrame(() => statusRef.current?.focus())
    }
  }

  const errList = Object.entries(errors)
  const field = (name: keyof Errors) => ({
    id: `${uid}-${name}`,
    name,
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${uid}-${name}-err` : undefined,
  })

  if (state === 'ok') {
    return (
      <div className="form" ref={statusRef} tabIndex={-1} role="status">
        <div className="alert alert--ok"><Check width={22} height={22} /><div><strong>Message sent.</strong><p>Thank you. I read every message and will reply as soon as I can.</p></div></div>
        <button type="button" className="btn btn--ghost" onClick={() => { setState('idle'); startedAt.current = Date.now() }} style={{ justifySelf: 'start' }}>Send another</button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form">
      {errList.length > 0 && (
        <div className="alert alert--bad" role="alert" tabIndex={-1} ref={summary}>
          <Alert width={22} height={22} />
          <div>
            <strong>Please fix {errList.length === 1 ? 'one thing' : `${errList.length} things`}:</strong>
            <ul>{errList.map(([k, v]) => <li key={k}><a href={`#${uid}-${k}`} style={{ textDecoration: 'underline' }}>{v}</a></li>)}</ul>
          </div>
        </div>
      )}
      {state === 'fail' && (
        <div className="alert alert--bad" role="alert" tabIndex={-1} ref={statusRef}><Alert width={22} height={22} /><p>{failMsg}</p></div>
      )}
      <div className="form-row">
        <div className="field">
          <label htmlFor={`${uid}-name`}>Your name<span className="req" aria-hidden="true">*</span></label>
          <input className="input" type="text" autoComplete="name" required {...field('name')} />
          <FieldError id={`${uid}-name-err`} message={errors.name} />
        </div>
        <div className="field">
          <label htmlFor={`${uid}-email`}>Email<span className="req" aria-hidden="true">*</span></label>
          <input className="input" type="email" autoComplete="email" inputMode="email" required {...field('email')} />
          <FieldError id={`${uid}-email-err`} message={errors.email} />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`${uid}-subject`}>What is this about?<span className="req" aria-hidden="true">*</span></label>
        <input className="input" type="text" list={projectOptions?.length ? `${uid}-opts` : undefined} required {...field('subject')} />
        {projectOptions?.length ? <datalist id={`${uid}-opts`}>{['A new project', 'A collaboration', 'A role', ...projectOptions.map((p) => `A question about ${p}`)].map((o) => <option key={o} value={o} />)}</datalist> : null}
        <FieldError id={`${uid}-subject-err`} message={errors.subject} />
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>Message<span className="req" aria-hidden="true">*</span></label>
        <textarea className="input" rows={6} required {...field('message')} />
        <FieldError id={`${uid}-message-err`} message={errors.message} />
      </div>
      {/* Honeypot: invisible to people, tempting to bots */}
      <div className="hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <button type="submit" className="btn btn--primary" disabled={state === 'sending'} style={{ justifySelf: 'start' }}>
        {state === 'sending' ? 'Sending…' : 'Send message'}<ArrowRight />
      </button>
    </form>
  )
}
