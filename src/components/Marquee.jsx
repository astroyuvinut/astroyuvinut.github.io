import { motion } from 'framer-motion'

const WORDS = [
  'SPACE AI', 'MACHINE LEARNING', 'AUTONOMOUS SYSTEMS',
  'RAG', 'COMPUTER VISION', 'SATELLITE INTELLIGENCE',
]

export default function Marquee({ reverse = false, duration = 28 }) {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="marquee" aria-hidden>
      <motion.div
        className="marquee__track"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration, ease: 'linear', repeat: Infinity }}
      >
        {row.map((w, i) => (
          <span key={i} className="marquee__item">
            {w}<span className="marquee__dot accent">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}
