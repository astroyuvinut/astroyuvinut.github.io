import Reveal from './Reveal'

const STATS = [
  { n: '5', l: 'Featured projects' },
  { n: '5', l: 'Certifications' },
  { n: '4', l: 'Languages spoken' },
]

export default function About() {
  return (
    <section className="about section" id="about">
      <Reveal as="p" className="section__kicker">[ ABOUT ]</Reveal>
      <div className="about__grid">
        <Reveal>
          <h2 className="about__lead">
            A <span className="serif accent">CSE–AI undergrad</span> building
            real systems — and aiming them at <span className="serif accent">space</span>.
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="about__body">
            I&apos;m Yuvaraju — a third-year B.Tech CSE (AI) student at KIET, based in
            Visakhapatnam. I work hands-on across machine learning, deep learning and
            full-stack development: training models on real datasets as an AI/ML intern
            at SprintM Technologies, and shipping end-to-end AI/ML and web projects for
            clients as a freelancer on Fiverr.
          </p>
          <p className="about__body">
            I&apos;m equally at home grinding LeetCode — dynamic programming, divide &amp;
            conquer, union-find — and I&apos;m pointing all of it at one goal: applying
            AI to space exploration and autonomous systems, the kind of work ISRO is
            driving forward. On Earth I build practical ML. In orbit is where I want it to go.
          </p>
        </Reveal>
      </div>

      <div className="about__stats">
        {STATS.map((s, i) => (
          <Reveal key={s.l} delay={i * 0.1}>
            <div className="stat">
              <span className="stat__n accent">{s.n}</span>
              <span className="stat__l">{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
