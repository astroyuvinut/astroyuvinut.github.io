import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion'
import Magnetic from './fx/Magnetic'

import signature from '../assets/signature.webp'

const NAME = 'YUVARAJ'

export default function Hero() {
  const ref = useRef(null)
  const nameRef = useRef(null)

  // Scroll parallax for the giant name + fade for the foreground
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // flashlight: an ice-filled copy of the name, masked to a soft circle around the pointer
  const mx = useSpring(useMotionValue(-999), { stiffness: 260, damping: 30 })
  const my = useSpring(useMotionValue(-999), { stiffness: 260, damping: 30 })
  const lightR = useSpring(0, { stiffness: 160, damping: 22 })
  const mask = useMotionTemplate`radial-gradient(circle ${lightR}px at ${mx}px ${my}px, #000 30%, transparent 100%)`

  const track = (e) => {
    if (e.pointerType !== 'mouse' || !nameRef.current) return
    const r = nameRef.current.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
    lightR.set(260)
  }

  const letter = {
    hidden: { y: '115%', rotate: 8 },
    show: { y: 0, rotate: 0, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section
      className="hero hero--noimg" id="top" data-shot="hero" data-label="Intro" ref={ref}
      onPointerMove={track} onPointerLeave={() => lightR.set(0)}
    >
      {/* GIANT NAME */}
      <motion.div className="hero__bigname" style={{ y: textY }} aria-hidden>
        <span className="hero__bigname-line" ref={nameRef}>
          <motion.span
            className="mask hero__letters" initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
          >
            {NAME.split('').map((c, i) => (
              <motion.span key={i} className="hero__letter" variants={letter}>{c}</motion.span>
            ))}
          </motion.span>
          <motion.span
            className="hero__lit"
            style={{ WebkitMaskImage: mask, maskImage: mask }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          >
            {NAME}
          </motion.span>
        </span>
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
        <span className="hero__fg-glow" aria-hidden />
        <motion.span
          className="hero__eyebrow"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          <span className="hero__live" aria-hidden />
          AI / ML ENGINEER · CSE–AI UNDERGRAD · ASPIRING ISRO / SPACE-AI RESEARCHER
        </motion.span>

        <motion.p
          className="hero__sub"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          Building <span className="serif shimmer">intelligent systems</span> for Earth &amp; space.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ y: 16 }} animate={{ y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
        >
          <Magnetic>
            <a href="#projects" className="btn btn--accent btn--fill" data-burst>
              <span className="btn__label" data-text="View work"><span>View work</span></span>
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn--ghost btn--fill">
              <span className="btn__label" data-text="Get in touch"><span>Get in touch</span></span>
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div className="hero__scroll" style={{ opacity: fade }}>
        <span>SCROLL</span>
        <div className="hero__scroll-line" />
      </motion.div>
    </section>
  )
}
