import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * Full-screen intro: counts 0 → 100 while the name reveals, then the panel
 * lifts away (App scales the site up underneath for a "dive-in" feel).
 */
export default function Preloader({ onDone }) {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const DURATION = 1200
    let raf
    let start = null
    let done = false
    const tick = (t) => {
      if (start === null) start = t
      const p = Math.min(1, (t - start) / DURATION)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setPct(Math.round(eased * 100))
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else if (!done) {
        done = true
        setTimeout(onDone, 250)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [onDone])

  const word = {
    hidden: { y: '115%' },
    show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="preloader__top">
        <motion.span
          className="preloader__label"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="preloader__dot" /> INITIALIZING SYSTEMS
        </motion.span>
      </div>

      <div className="preloader__center">
        <motion.h2 className="preloader__name" initial="hidden" animate="show">
          <span className="mask"><motion.span variants={word}>YUVARAJU</motion.span></span>
          <span className="mask"><motion.span variants={{ ...word, show: { ...word.show, transition: { ...word.show.transition, delay: 0.08 } } }} className="accent">BONDADA</motion.span></span>
        </motion.h2>
      </div>

      <div className="preloader__bottom">
        <span className="preloader__pct">
          {String(pct).padStart(3, '0')}<small>%</small>
        </span>
        <div className="preloader__bar">
          <motion.div className="preloader__fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="preloader__caption">AI · SPACE · AUTONOMY</span>
      </div>
    </motion.div>
  )
}
