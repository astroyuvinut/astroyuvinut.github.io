import Reveal from './Reveal'
import Scramble from './fx/Scramble'
import OrbitMark from './fx/OrbitMark'

const CERTS = [
  { org: 'Tata', name: 'GenAI Powered Data Analytics Job Simulation — Forage', year: 'Feb 2026' },
  { org: 'Infosys', name: 'Introduction to Data Science — Springboard', year: 'Oct 2025' },
  { org: 'SprintM', name: 'AI & Machine Learning with Hands-on Projects', year: 'Oct 2025' },
  { org: 'SprintM', name: 'AI/ML Internship Completion (Startup India / NIP)', year: '2025' },
  { org: 'SEOK', name: 'Full Stack Developer — SEOK & SprintM', year: '' },
]

export default function Certifications() {
  return (
    <section className="certs section" data-shot="wide" data-label="Certifications">
      <Reveal as="p" className="section__kicker"><Scramble text="[ CERTIFICATIONS ]" /></Reveal>
      <Reveal>
        <h2 className="section__title">
          Proof of <span className="serif accent">work</span>
        </h2>
      </Reveal>
      <div className="certs__list">
        {CERTS.map((c, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className="cert" data-cursor="Verified">
              <span className="cert__org">{c.org}</span>
              <span className="cert__name">{c.name}</span>
              {c.year && <span className="cert__year">{c.year}</span>}
              <span className="cert__mark accent"><OrbitMark /></span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
