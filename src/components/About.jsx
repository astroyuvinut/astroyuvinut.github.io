import Reveal from './Reveal'
import Scramble from './fx/Scramble'
import ScrollWords from './fx/ScrollWords'
import Counter from './fx/Counter'

const STATS = [
  { n: 5, l: 'Featured projects' },
  { n: 5, l: 'Certifications' },
  { n: 4, l: 'Languages spoken' },
]

export default function About() {
  return (
    <section className="about section" id="about" data-shot="wide" data-label="About">
      <Reveal as="p" className="section__kicker"><Scramble text="[ ABOUT ]" /></Reveal>
      <div className="about__grid">
        <ScrollWords
          as="h2"
          className="about__lead"
          segments={[
            { t: 'A ' },
            { t: 'CSE–AI undergrad', className: 'serif accent' },
            { t: ' building real systems — and aiming them at ' },
            { t: 'space', className: 'serif accent' },
            { t: '.' },
          ]}
        />
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
              <Counter to={s.n} className="stat__n accent" />
              <span className="stat__l">{s.l}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
