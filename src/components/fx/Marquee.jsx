import { useRef } from 'react'
import {
  motion, useAnimationFrame, useMotionValue, useScroll, useSpring,
  useTransform, useVelocity, useReducedMotion,
} from 'framer-motion'
import OrbitMark from './OrbitMark'

const wrap = (min, max, v) => {
  const r = max - min
  return ((((v - min) % r) + r) % r) + min
}

/** Endless strip that speeds up, reverses and skews with scroll velocity. */
export default function Marquee({ items, speed = 2.2, className = 'marquee' }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-1500, 0, 1500], [-5, 0, 5], { clamp: false })
  const skewX = useTransform(vel, [-2000, 2000], [12, -12])
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * speed * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    base.set(base.get() - Math.abs(move) * dir.current)
  })

  const row = [...items, ...items]
  return (
    <div className={className} aria-label={items.join(', ')}>
      <motion.div className="marquee__track" style={{ x, skewX }} aria-hidden>
        {[0, 1].map((n) => (
          <div className="marquee__row" key={n}>
            {row.map((t, i) => (
              <span key={i} className="marquee__item">
                {t}<OrbitMark className="orbitmark marquee__sep" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
