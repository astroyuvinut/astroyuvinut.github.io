import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 }

/** Pulls its child toward the pointer while hovered, then springs back. */
export default function Magnetic({ children, strength = 0.35, className = 'magnetic' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), SPRING)
  const y = useSpring(useMotionValue(0), SPRING)

  const move = (e) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => { x.set(0); y.set(0) }

  return (
    <motion.span ref={ref} className={className} style={{ x, y }} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </motion.span>
  )
}
