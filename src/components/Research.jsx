import Reveal from './Reveal'

const AREAS = [
  { t: 'Satellite Intelligence', d: 'Extracting insight from satellite & telemetry data for Earth and orbit.' },
  { t: 'Autonomous Systems', d: 'Decision-making and control for systems that operate without a human in the loop.' },
  { t: 'Space-AI for ISRO', d: 'Applying ML to mission data, trajectory and onboard intelligence.' },
  { t: 'Robotics', d: 'Perception and learning for machines that sense and act in the real world.' },
]

export default function Research() {
  return (
    <section className="research section" id="research" data-shot="wide" data-label="Research">
      <Reveal as="p" className="section__kicker">[ RESEARCH DIRECTION ]</Reveal>
      <Reveal>
        <h2 className="section__title">
          Where I&apos;m <span className="serif accent">heading</span>
        </h2>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="research__intro">
          My north star: contribute to intelligent systems for space — from satellite
          telemetry to autonomous spacecraft — and grow into a Space-AI researcher
          contributing to ISRO-scale missions. I&apos;m actively seeking AI research
          internships and engineering roles to get there.
        </p>
      </Reveal>
      <div className="research__list">
        {AREAS.map((a, i) => (
          <Reveal key={a.t} delay={i * 0.08}>
            <div className="ritem">
              <h3 className="ritem__t">{a.t}</h3>
              <p className="ritem__d">{a.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
