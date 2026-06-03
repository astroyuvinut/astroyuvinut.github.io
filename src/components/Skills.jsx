import Reveal from './Reveal'

const GROUPS = [
  { title: 'Languages', items: ['Python', 'JavaScript', 'HTML', 'CSS'] },
  { title: 'ML / AI', items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'RAG'] },
  { title: 'Web', items: ['React', 'Node.js', 'Full-Stack'] },
  { title: 'Tools / Cloud', items: ['Git', 'GitHub', 'VS Code', 'Jupyter', 'Cloudflare'] },
  { title: 'Domains', items: ['Deep Learning', 'NLP', 'Computer Vision', 'Robotics', 'IoT', 'Data Science', 'DSA'] },
  { title: 'Competitive Programming', items: ['Dynamic Programming', 'Hash Table', 'Greedy', 'Binary Search', 'Divide & Conquer', 'Union-Find'] },
]

const LOGOS = ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'React', 'GitHub', 'Cloudflare', 'NumPy']

export default function Skills() {
  return (
    <section className="skills section" id="skills">
      <Reveal as="p" className="section__kicker">[ SKILLS STACK ]</Reveal>
      <Reveal>
        <h2 className="section__title">
          What I <span className="serif accent">build with</span>
        </h2>
      </Reveal>

      <div className="skills__grid">
        {GROUPS.map((g, i) => (
          <Reveal key={g.title} delay={i * 0.07}>
            <div className="skillgroup">
              <h4 className="skillgroup__title">{g.title}</h4>
              <ul className="skillgroup__items">
                {g.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="logostrip">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <span key={i} className="logostrip__item">{l}</span>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
