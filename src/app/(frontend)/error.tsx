'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="container lost">
      <p className="lost__code" aria-hidden="true">500</p>
      <h1>Something went wrong.</h1>
      <p className="lost__cta"><button type="button" className="btn btn--primary" onClick={reset}>Try again</button></p>
    </div>
  )
}
