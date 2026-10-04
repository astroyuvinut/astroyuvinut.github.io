import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

function Word({ children, progress, range, className }) {
  const opacity = useTransform(progress, range, [0.14, 1])
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span className={className} style={{ opacity, filter: blur }}>
      {children}
    </motion.span>
  )
}

/**
 * Text that lights up word by word as it scrolls through the viewport.
 * `segments` is [{ t: 'plain words ' }, { t: 'styled words', className: 'serif accent' }].
 */
export default function ScrollWords({ segments, as = 'p', className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] })
  const Tag = as
  const words = segments.flatMap((s) =>
    s.t.split(/(\s+)/).filter(Boolean).map((w) => ({ w, className: s.className })),
  )
  const solid = words.filter((x) => x.w.trim())
  let k = 0

  return (
    <Tag ref={ref} className={className} aria-label={segments.map((s) => s.t).join('')}>
      {words.map((x, i) => {
        if (!x.w.trim()) return <span key={i} aria-hidden> </span>
        const at = k++ / solid.length
        return (
          <Word key={i} progress={scrollYProgress} range={[at, at + 1 / solid.length]} className={x.className}>
            <span aria-hidden>{x.w}</span>
          </Word>
        )
      })}
    </Tag>
  )
}
