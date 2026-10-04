import { useEffect, useRef, useState } from 'react'
import Scramble from './Scramble'
import { setWipe } from '../../lib/wipeHandle'

const COLS = 5
const EASE = 'cubic-bezier(.76,0,.24,1)'
const IN = 520
const OUT = 620
const STAGGER = 55

/** Staggered ice columns that cover the screen during in-page jumps (driven via lib/wipeHandle). */
export default function PageWipe() {
  const root = useRef(null)
  const busy = useRef(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    setWipe(async (text, jump) => {
      if (busy.current) return
      busy.current = true
      const el = root.current
      const cols = [...el.querySelectorAll('.wipe__col')]
      const tag = el.querySelector('.wipe__label')
      setLabel(text)
      el.classList.add('is-active')

      await Promise.all(cols.map((c, i) => c.animate(
        [{ transform: 'scaleY(0)', transformOrigin: '50% 100%' }, { transform: 'scaleY(1)', transformOrigin: '50% 100%' }],
        { duration: IN, delay: i * STAGGER, easing: EASE, fill: 'forwards' },
      ).finished))
      tag.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 260, fill: 'forwards' })

      jump()
      await new Promise((r) => setTimeout(r, 320))

      tag.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-20px)' }], { duration: 220, fill: 'forwards' })
      await Promise.all(cols.map((c, i) => c.animate(
        [{ transform: 'scaleY(1)', transformOrigin: '50% 0%' }, { transform: 'scaleY(0)', transformOrigin: '50% 0%' }],
        { duration: OUT, delay: 120 + i * STAGGER, easing: EASE, fill: 'forwards' },
      ).finished))

      // drop the filled animations so they don't stack up wipe after wipe
      ;[...cols, tag].forEach((n) => n.getAnimations().forEach((a) => a.cancel()))
      el.classList.remove('is-active')
      busy.current = false
    })
    return () => setWipe(null)
  }, [])

  return (
    <div className="wipe" ref={root} aria-hidden>
      {Array.from({ length: COLS }, (_, i) => <span key={i} className="wipe__col" />)}
      <div className="wipe__label">
        <span className="wipe__kicker">// NAVIGATING TO</span>
        {label && <Scramble key={label} text={label} duration={500} className="wipe__title" />}
      </div>
    </div>
  )
}
