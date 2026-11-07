import { motion, useReducedMotion } from 'framer-motion'
import Scramble from './fx/Scramble'
import { AKASHA, PAPERS } from '../data/building'

const REVEAL = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

export default function Building() {
  const reduce = useReducedMotion()
  const hasPapers = PAPERS.length > 0

  return (
    <motion.section
      className="building section"
      id="building"
      data-shot="wide"
      data-label="Currently Building"
      aria-labelledby="building-heading"
      {...(reduce ? {} : REVEAL)}
    >
      <h2 className="section__kicker" id="building-heading">
        <Scramble text="[ CURRENTLY BUILDING ]" />
      </h2>

      <div className={`building__grid ${hasPapers ? 'building__grid--split' : ''}`}>
        <div className="building__main">
          <div className="building__head">
            <h3 className="building__name">{AKASHA.name}</h3>
            <span className="building__status">{AKASHA.status}</span>
          </div>
          <p className="building__tagline serif accent">{AKASHA.tagline}</p>
          <p className="building__body">{AKASHA.body}</p>
          <ul className="building__tags">
            {AKASHA.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {hasPapers && (
          <div className="papers">
            <h4 className="papers__heading">Research</h4>
            <ul className="papers__list">
              {PAPERS.map((p) => (
                <li className="paper" key={p.title}>
                  <h5 className="paper__title">{p.title}</h5>
                  <span className="paper__status">{p.status}</span>
                  <p className="paper__summary">{p.summary}</p>
                  <span className="paper__request">Available on request</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.section>
  )
}
