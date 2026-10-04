import { useEffect, useState } from 'react'
import PageWipe from './PageWipe'
import CursorTrail from './CursorTrail'
import MobileDock from './MobileDock'
import { motion, useMotionValue, useSpring, useScroll, useReducedMotion, AnimatePresence } from 'framer-motion'

const HOVERABLE = 'a, button, [data-cursor]'

/** Ice-ring cursor: a dot that tracks exactly and a lagging ring that grows over links and shows a label. */
function Cursor() {
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })
  const [hover, setHover] = useState(false)
  const [label, setLabel] = useState('')
  const [down, setDown] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('has-cursor')
    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX); y.set(e.clientY)
      setShown(true)
    }
    const over = (e) => {
      const t = e.target.closest?.(HOVERABLE)
      setHover(Boolean(t))
      setLabel(t?.dataset.cursor || '')
    }
    const press = () => setDown(true)
    const release = () => setDown(false)
    const out = (e) => { if (!e.relatedTarget) setShown(false) }
    window.addEventListener('pointermove', move)
    document.addEventListener('pointerover', over)
    window.addEventListener('pointerdown', press)
    window.addEventListener('pointerup', release)
    document.addEventListener('pointerout', out)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      window.removeEventListener('pointerdown', press)
      window.removeEventListener('pointerup', release)
      document.removeEventListener('pointerout', out)
    }
  }, [x, y])

  const size = label ? 96 : hover ? 56 : 34
  return (
    <div className={`cursor ${shown ? 'is-shown' : ''}`} aria-hidden>
      <motion.div className="cursor__dot" style={{ x, y }} animate={{ scale: hover ? 0 : down ? 0.6 : 1 }} />
      <motion.div
        className={`cursor__ring ${label ? 'has-label' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              className="cursor__label"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/** Shatter of ice shards from the click point on anything marked data-burst. */
function useClickBurst(enabled) {
  useEffect(() => {
    if (!enabled) return
    const onClick = (e) => {
      const host = e.target.closest('[data-burst]')
      if (!host) return
      const n = 14
      for (let i = 0; i < n; i++) {
        const s = document.createElement('span')
        s.className = 'shard'
        s.style.left = `${e.clientX}px`
        s.style.top = `${e.clientY}px`
        document.body.appendChild(s)
        const a = (i / n) * Math.PI * 2 + Math.random() * 0.4
        const d = 40 + Math.random() * 70
        s.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0) rotate(${Math.random() * 360}deg)`, opacity: 0 },
          ],
          { duration: 650 + Math.random() * 300, easing: 'cubic-bezier(.22,1,.36,1)' },
        ).onfinish = () => s.remove()
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [enabled])
}

/** Frost ring that spreads from every tap on touch screens. */
function useTapRipple(enabled) {
  useEffect(() => {
    if (!enabled) return
    const onDown = (e) => {
      if (e.pointerType === 'mouse') return
      const r = document.createElement('span')
      r.className = 'tap-ring'
      r.style.left = `${e.clientX}px`
      r.style.top = `${e.clientY}px`
      document.body.appendChild(r)
      r.animate(
        [
          { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0.9 },
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 },
        ],
        { duration: 620, easing: 'cubic-bezier(.22,1,.36,1)' },
      ).onfinish = () => r.remove()
    }
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => window.removeEventListener('pointerdown', onDown)
  }, [enabled])
}

/** Page-wide layer: scroll progress bar, film grain, custom cursor, click shards. */
export default function Effects() {
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })
  const [fine] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  useClickBurst(!reduce)
  useTapRipple(!fine && !reduce)

  return (
    <>
      <motion.div className="scrollbar" style={{ scaleX: progress }} aria-hidden />
      <div className="grain" aria-hidden />
      {!reduce && <PageWipe />}
      <MobileDock />
      {fine && !reduce && <CursorTrail />}
      {fine && !reduce && <Cursor />}
    </>
  )
}
