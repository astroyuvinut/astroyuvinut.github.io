import { motion } from 'framer-motion'

/**
 * Scroll-reveal wrapper. Fades + slides children in when they enter view.
 * Usage: <Reveal delay={0.1}>...</Reveal>
 */
export default function Reveal({ children, delay = 0, y = 40, as = 'div', className }) {
  const MotionTag = motion[as] || motion.div
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
