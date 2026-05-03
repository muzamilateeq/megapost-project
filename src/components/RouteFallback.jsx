export function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <div className="route-fallback__spinner" aria-hidden />
      <span className="route-fallback__text">Loading…</span>
    </div>
  )
}
