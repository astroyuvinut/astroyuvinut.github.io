import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

import signature from '../assets/signature.webp'

export default function Hero() {
  const ref = useRef(null)

  // Scroll parallax for the giant name + fade for the foreground
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const word = {
    hidden: { y: '115%' },
    show: { y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="hero hero--noimg" id="top" data-shot="hero" data-label="Intro" ref={ref}>
      {/* GIANT NAME */}
      <motion.div className="hero__bigname" style={{ y: textY }} aria-hidden>
        <motion.span className="hero__bigname-line" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <span className="mask"><motion.span variants={word}>YUVARAJ</motion.span></span>
        </motion.span>
      </motion.div>

      {/* handwritten signature — wipes in left-to-right like signing */}
      <motion.img
        className="hero__signature"
        src={signature}
        alt="Yuvaraju signature"
        draggable="false"
        initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{ delay: 1.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* foreground UI */}
      <motion.div className="hero__fg" style={{ opacity: fade }}>
        <motion.span
          className="hero__eyebrow"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          AI / ML ENGINEER · CSE–AI UNDERGRAD · ASPIRING ISRO / SPACE-AI RESEARCHER
        </motion.span>

        <motion.p
          className="hero__sub"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          Building <span className="serif accent">intelligent systems</span> for Earth &amp; space.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <a href="#projects" className="btn btn--accent">View work</a>
          <a href="#contact" className="btn btn--ghost">Get in touch</a>
        </motion.div>
      </motion.div>

      <motion.div className="hero__scroll" style={{ opacity: fade }}>
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}
