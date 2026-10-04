import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

/** Counts up from zero the first time it scrolls into view. */
export default function Counter({ to, className, pad = 2 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const fmt = (v) => String(Math.round(v)).padStart(pad, '0')

  useEffect(() => {
    if (!inView) return
    if (reduce) { ref.current.textContent = fmt(to); return }
    const c = animate(0, to, {
      duration: 1.6, ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = fmt(v) },
    })
    return () => c.stop()
    // fmt is stable for a given pad
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, to, reduce])

  return <span ref={ref} className={className}>{fmt(0)}</span>
}
