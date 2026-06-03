import Reveal from './Reveal'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/astroyuvinut' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuvaraju-bondada-020667326/' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/astroyuvinut/' },
]

const EMAIL = 'yuvarajubondada111@gmail.com'

export default function Contact() {
  return (
    <footer className="contact section" id="contact">
      <Reveal as="p" className="section__kicker">[ SIGNAL FOUND ]</Reveal>
      <Reveal>
        <h2 className="contact__big">
          Let&apos;s build something
          <br />
          <span className="serif accent">that reaches orbit.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <a href={`mailto:${EMAIL}`} className="contact__email" data-cursor>
          {EMAIL}
        </a>
      </Reveal>

      <Reveal delay={0.2}>
        <ul className="contact__socials">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" data-cursor>
                {s.label} <span className="accent">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="contact__bottom">
        <span>© {new Date().getFullYear()} Yuvaraju Bondada</span>
        <span>Visakhapatnam, India · Open to AI research &amp; engineering roles</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
