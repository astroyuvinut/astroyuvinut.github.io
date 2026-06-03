import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Targeting-reticle cursor: a precise center dot + a lagging crosshair ring
 * that slowly rotates and locks on (expands) over interactive elements.
 * Hidden on touch devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 280, damping: 26, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 280, damping: 26, mass: 0.5 })

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      setHovering(Boolean(e.target.closest('a, button, [data-cursor]')))
    }
    const dn = () => setDown(true)
    const up = () => setDown(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', dn)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', dn)
      window.removeEventListener('mouseup', up)
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden
        className="cursor-dot"
        style={{ translateX: x, translateY: y }}
        animate={{ scale: down ? 0.6 : hovering ? 0.4 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
      <motion.div
        aria-hidden
        className="cursor-reticle"
        style={{ translateX: ringX, translateY: ringY }}
        animate={{ scale: hovering ? 1.6 : 1, opacity: hovering ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.svg
          viewBox="0 0 48 48"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: 'linear', duration: hovering ? 4 : 9 }}
        >
          <circle cx="24" cy="24" r="15" className="reticle-ring" />
          <line x1="24" y1="2" x2="24" y2="10" className="reticle-tick" />
          <line x1="24" y1="38" x2="24" y2="46" className="reticle-tick" />
          <line x1="2" y1="24" x2="10" y2="24" className="reticle-tick" />
          <line x1="38" y1="24" x2="46" y2="24" className="reticle-tick" />
        </motion.svg>
      </motion.div>
    </>
  )
}
