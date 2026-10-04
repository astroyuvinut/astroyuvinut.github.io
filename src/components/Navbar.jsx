import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Scramble from './fx/Scramble'
import Magnetic from './fx/Magnetic'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`nav ${scrolled ? 'nav--scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <a href="#top" className="nav__logo">
        Yuvaraju<span className="accent">.</span>
      </a>

      <nav className="nav__links" onPointerLeave={() => setHovered(null)}>
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onPointerEnter={() => setHovered(l.href)}>
            {hovered === l.href && (
              <motion.span
                layoutId="nav-hover"
                className="nav__hover"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Scramble text={l.label} hover duration={450} />
          </a>
        ))}
      </nav>

      <Magnetic strength={0.3}>
        <a href="#contact" className="nav__pill">Let&apos;s talk</a>
      </Magnetic>

      <a
        className="nav__resume"
        href={`${import.meta.env.BASE_URL}Yuvaraj-Resume.pdf`}
        download="Yuvaraju-Bondada-Resume.pdf"
      >
        Résumé <span aria-hidden>↓</span>
      </a>
    </motion.header>
  )
}
