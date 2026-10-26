import { TLink } from '@/components/Transition'

export default function NotFound() {
  return (
    <div className="container lost">
      <p className="lost__code" aria-hidden="true">404</p>
      <h1>Wrong turn.</h1>
      <p className="lost__cta"><TLink className="btn btn--primary" href="/">Back home</TLink></p>
    </div>
  )
}
