/** A template re-mounts on every navigation, which replays the page entrance animation. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page">{children}</div>
}
