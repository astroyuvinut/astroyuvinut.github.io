import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>'
const KEEP = /[\s[\]·.,—–\-↗↑↓@&']/

/**
 * Matrix-style decode: characters cycle through random glyphs and lock in
 * left to right. Plays once when scrolled into view, and again on hover
 * when `hover` is set. Screen readers get the real text via aria-label.
 */
export default function Scramble({ text, as: Tag = 'span', className, hover = false, duration = 900, ...rest }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  const run = useCallback(() => {
    if (reduce) return
    cancelAnimationFrame(raf.current)
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      const locked = Math.floor(p * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        s += i < locked || KEEP.test(c) ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [text, duration, reduce])

  useEffect(() => { if (inView) run() }, [inView, run])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={text}
      onPointerEnter={hover ? run : undefined}
      {...rest}
    >
      <span aria-hidden>{out}</span>
    </Tag>
  )
}
