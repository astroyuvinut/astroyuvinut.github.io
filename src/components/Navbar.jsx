import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Research', href: '#research' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

      <nav className="nav__links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
      </nav>

      <a href="#contact" className="nav__pill">Let&apos;s talk</a>

      <button
        className="nav__burger"
        aria-label="Toggle menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span className={open ? 'open' : ''} />
        <span className={open ? 'open' : ''} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__mobile"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {LINKS.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
