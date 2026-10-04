import Reveal from './Reveal'
import Scramble from './fx/Scramble'
import ScrollWords from './fx/ScrollWords'

const AREAS = [
  { t: 'Satellite Intelligence', d: 'Extracting insight from satellite & telemetry data for Earth and orbit.' },
  { t: 'Autonomous Systems', d: 'Decision-making and control for systems that operate without a human in the loop.' },
  { t: 'Space-AI for ISRO', d: 'Applying ML to mission data, trajectory and onboard intelligence.' },
  { t: 'Robotics', d: 'Perception and learning for machines that sense and act in the real world.' },
]

export default function Research() {
  return (
    <section className="research section" id="research" data-shot="wide" data-label="Research">
      <Reveal as="p" className="section__kicker"><Scramble text="[ RESEARCH DIRECTION ]" /></Reveal>
      <Reveal>
        <h2 className="section__title">
          Where I&apos;m <span className="serif accent">heading</span>
        </h2>
      </Reveal>
      <ScrollWords
        className="research__intro"
        segments={[
          { t: 'My north star: contribute to intelligent systems for space — from satellite telemetry to autonomous spacecraft — and grow into a ' },
          { t: 'Space-AI researcher', className: 'serif accent' },
          { t: " contributing to ISRO-scale missions. I'm actively seeking AI research internships and engineering roles to get there." },
        ]}
      />
      <div className="research__list">
        {AREAS.map((a, i) => (
          <Reveal key={a.t} delay={i * 0.08}>
            <div className="ritem">
              <span className="ritem__n accent">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="ritem__t">{a.t}</h3>
              <p className="ritem__d">{a.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
