import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'research', label: 'Research' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

/**
 * Phone navigation: a glass dock pinned to the bottom of the screen. The pill
 * slides to the section being read, and the dock's top edge fills with scroll progress.
 */
export default function MobileDock() {
  const [active, setActive] = useState(null)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 })

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = innerHeight * 0.45
      // the section whose top most recently crossed the reading line
      let current = null
      let best = -Infinity
      for (const it of ITEMS) {
        const top = document.getElementById(it.id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line && top > best) { best = top; current = it.id }
      }
      setActive(current)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <motion.nav
      className="dock"
      aria-label="Sections"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 26 }}
    >
      <motion.span className="dock__progress" style={{ scaleX: progress }} aria-hidden />
      {ITEMS.map((it, i) => (
        <a
          key={it.id}
          href={`#${it.id}`}
          className={`dock__item ${active === it.id ? 'is-active' : ''}`}
          aria-current={active === it.id ? 'location' : undefined}
          onClick={() => navigator.vibrate?.(8)}
        >
          {active === it.id && (
            <motion.span layoutId="dock-pill" className="dock__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
          )}
          <span className="dock__n">{String(i + 1).padStart(2, '0')}</span>
          <span className="dock__label">{it.label}</span>
        </a>
      ))}
    </motion.nav>
  )
}
