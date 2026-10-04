import Reveal from './Reveal'
import { useEffect, useState } from 'react'
import Scramble from './fx/Scramble'
import Magnetic from './fx/Magnetic'
import ScrollWords from './fx/ScrollWords'

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/astroyuvinut' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yuvaraju-bondada-020667326/' },
  { label: 'LeetCode', href: 'https://leetcode.com/u/astroyuvinut/' },
]

const EMAIL = 'yuvarajubondada111@gmail.com'
const LINKEDIN_URL = 'https://in.linkedin.com/in/yuvaraju-bondada-020667326?trk=profile-badge'

/** Live Visakhapatnam time, ticking each second. */
function LocalTime() {
  const fmt = () => new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata', hour12: false })
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="localtime"><span className="localtime__dot" aria-hidden />{t} IST</span>
}

export default function Contact() {
  return (
    <footer className="contact section" id="contact" data-shot="wide" data-label="Contact">
      <Reveal as="p" className="section__kicker"><Scramble text="[ SIGNAL FOUND ]" /></Reveal>
      <ScrollWords
        as="h2"
        className="contact__big"
        segments={[
          { t: "Let's build something " },
          { t: 'that reaches orbit.', className: 'serif accent' },
        ]}
      />

      <div className="contact__grid">
        <div>
          <Reveal delay={0.1}>
            <Magnetic strength={0.2}>
              <a href={`mailto:${EMAIL}`} className="contact__email" data-cursor="Say hi" data-burst>
                {EMAIL}
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="contact__socials">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <Scramble text={s.label} hover duration={500} /> <span className="accent">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="contact__badge">
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="licard">
            <div className="licard__head">
              <svg className="licard__logo" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"
                />
              </svg>
              <span className="licard__pulse" aria-hidden="true" />
            </div>
            <p className="licard__name">Yuvaraju Bondada</p>
            <p className="licard__role">AI/ML Engineer · Space-AI</p>
            <p className="licard__meta">Visakhapatnam, India</p>
            <span className="licard__cta">
              View profile <span className="accent">↗</span>
            </span>
          </a>
        </Reveal>
      </div>

      <div className="contact__bottom">
        <span>© {new Date().getFullYear()} Yuvaraju Bondada</span>
        <span>Visakhapatnam, India · <LocalTime /> · Open to AI research &amp; engineering roles</span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
