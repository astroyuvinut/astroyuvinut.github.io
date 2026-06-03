import { motion } from 'framer-motion'
import Reveal from './Reveal'

const PROJECTS = [
  {
    id: '01',
    title: 'ReelRAG',
    tag: 'IN CODE',
    blurb:
      'A RAG chatbot that compares two videos side by side — paste two YouTube or Instagram URLs and it fetches transcripts and metadata, then answers conversational questions about both, with every reply cited to the exact video and transcript chunk it came from.',
    stack: ['Python', 'RAG', 'Cloudflare', 'NLP'],
    repo: 'https://github.com/astroyuvinut/ReelRAG',
  },
  {
    id: '02',
    title: 'Heart Stroke Prediction System',
    tag: 'ON EARTH',
    blurb:
      'A binary classification pipeline predicting stroke risk from patient health records, using logistic regression, XGBoost and ensembles with SMOTE for class imbalance — built with clinical interpretability in mind.',
    stack: ['Python', 'Scikit-learn', 'Pandas', 'XGBoost'],
    repo: 'https://github.com/astroyuvinut/heart-attack-prediction',
  },
  {
    id: '03',
    title: 'Space Expo — AI Satellite Data Analysis',
    tag: 'IN ORBIT',
    blurb:
      'A conceptual AI system that analyses satellite telemetry patterns and simulates orbital mission parameters — showing how ML pipelines can support real-time space research and mission-automation workflows.',
    stack: ['Python', 'NumPy', 'Simulation', 'ML'],
    repo: 'https://github.com/astroyuvinut/astro--the-space-expo',
  },
  {
    id: '04',
    title: 'Satellite Trajectory Predictor',
    tag: 'IN ORBIT',
    blurb:
      'A simulation tool that predicts satellite orbital paths by combining physics-based equations with data-driven refinement — sitting right at the intersection of AI and aerospace engineering.',
    stack: ['Python', 'Physics Modeling', 'ML'],
    repo: 'https://github.com/astroyuvinut/space-explorer',
  },
  {
    id: '05',
    title: 'AI-Driven Browser',
    tag: 'IN CODE',
    blurb:
      'An intelligent browser with AI-powered smart search, real-time content summarization and context-aware navigation, driven by NLP techniques.',
    stack: ['Python', 'NLP', 'LLMs'],
    repo: '',
  },
]

function Card({ p }) {
  const hasRepo = Boolean(p.repo)
  return (
    <motion.a
      className={`pcard ${hasRepo ? '' : 'pcard--nolink'}`}
      href={hasRepo ? p.repo : undefined}
      target={hasRepo ? '_blank' : undefined}
      rel={hasRepo ? 'noreferrer' : undefined}
      data-cursor
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
        {PROJECTS.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </section>
  )
}
