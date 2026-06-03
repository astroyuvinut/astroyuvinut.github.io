import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/** Big editorial divider: ON EARTH / IN ORBIT / IN CODE / SIGNAL FOUND */
export default function Divider({ label, index = '01' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])

  return (
    <div className="divider" ref={ref}>
      <span className="divider__index accent">{index}</span>
      <motion.h2 className="divider__label" style={{ x }}>{label}</motion.h2>
    </div>
  )
}
