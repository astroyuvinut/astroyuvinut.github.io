import { useEffect } from 'react'
import Lenis from 'lenis'
import { wipeTo } from '../lib/wipeHandle'

/**
 * Initialises Lenis smooth scrolling for the whole page.
 * Also wires anchor links (href="#id") to Lenis: the page wipe covers the screen,
 * the scroll jumps underneath, and the wipe lifts on the target section.
 */
export function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')
      if (id.length <= 1) return
      const el = document.querySelector(id)
      if (!el) return
      e.preventDefault()
      const label = id === '#top' ? 'HOME' : id.slice(1).toUpperCase()
      wipeTo(label, () => lenis.scrollTo(el, { offset: -10, immediate: true, force: true }))
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}
