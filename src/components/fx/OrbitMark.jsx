/** Small orbit glyph — a planet, a tilted ring and a moon riding it. Inherits currentColor. */
export default function OrbitMark({ className = 'orbitmark' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <ellipse cx="12" cy="12" rx="10.5" ry="4.2" transform="rotate(-24 12 12)" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="3.6" fill="currentColor" />
      <circle className="orbitmark__moon" cx="21.4" cy="7.9" r="1.6" fill="currentColor" />
    </svg>
  )
}
