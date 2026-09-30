import './App.css'
import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from './hooks/useLenis'
import Preloader from './components/Preloader'
import ResumeButton from './components/ResumeButton'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Divider from './components/Divider'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Research from './components/Research'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import IceBackground from './components/IceBackground'
import { PROJECTS } from './data/projects'

const INTRO_KEY = 'intro-seen'

export default function App() {
  // intro plays once per browser session; repeat visits land straight on the content
  const [loading, setLoading] = useState(() => {
    try { return !sessionStorage.getItem(INTRO_KEY) } catch { return true }
  })
  const finishIntro = useCallback(() => {
    try { sessionStorage.setItem(INTRO_KEY, '1') } catch { /* storage blocked */ }
    setLoading(false)
  }, [])
  useLenis()

  // lock scroll while the preloader is up
  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [loading])

  return (
    <>
      <AnimatePresence>
        {loading && <Preloader key="preloader" onDone={finishIntro} />}
      </AnimatePresence>

      <IceBackground stationCount={PROJECTS.length} />
      <ResumeButton />
      <Navbar />

      <motion.main
        initial={false}
        animate={{ scale: loading ? 1.08 : 1, opacity: loading ? 0 : 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: '50% 35%' }}
      >
        <Hero />

        <Divider label="ON EARTH" index="01" />
        <About />
        <Projects />

        <Divider label="IN ORBIT" index="02" />
        <Research />

        <Divider label="IN CODE" index="03" />
        <Skills />
        <Certifications />

        <Divider label="SIGNAL FOUND" index="04" />
        <Contact />
      </motion.main>
    </>
  )
}
