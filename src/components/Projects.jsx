import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Reveal from './Reveal'
import { PROJECTS } from '../data/projects'
import { getIce } from '../lib/iceHandle'

function Card({ p, index }) {
  const hasRepo = Boolean(p.repo)
  const ref = useRef(null)

  // flash this project's ice pane and fire a particle burst down the track
  useEffect(() => {
    const el = ref.current
    const light = () => {
      const ice = getIce()
      if (!ice) return
      ice.pulse(index)
      ice.emit(12, true)
    }
    el.addEventListener('pointerenter', light)
    el.addEventListener('focus', light)
    return () => {
      el.removeEventListener('pointerenter', light)
      el.removeEventListener('focus', light)
    }
  }, [index])

  return (
    <motion.a
      ref={ref}
      className={`pcard ${hasRepo ? '' : 'pcard--nolink'}`}
      href={hasRepo ? p.repo : undefined}
      target={hasRepo ? '_blank' : undefined}
      rel={hasRepo ? 'noreferrer' : undefined}
      data-shot={index}
      data-label={p.title}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="pcard__top">
        <span className="pcard__id accent">{p.id}</span>
        <span className="pcard__tag">{p.tag}</span>
      </div>
      <h3 className="pcard__title">{p.title}</h3>
      <p className="pcard__blurb">{p.blurb}</p>
      <ul className="pcard__stack">
        {p.stack.map((s) => <li key={s}>{s}</li>)}
      </ul>
      <span className="pcard__arrow">{hasRepo ? '↗' : ''}</span>
    </motion.a>
  )
}

export default function Projects() {
  return (
    <section className="projects section" id="projects">
      <Reveal as="p" className="section__kicker">[ FEATURED WORK ]</Reveal>
      <Reveal>
        <h2 className="section__title">
          Selected <span className="serif accent">projects</span>
        </h2>
      </Reveal>
      <div className="projects__grid">
        {PROJECTS.map((p, i) => <Card key={p.id} p={p} index={i} />)}
      </div>
    </section>
  )
}
