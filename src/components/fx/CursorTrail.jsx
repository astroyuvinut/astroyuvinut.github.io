import { useEffect, useRef } from 'react'

const LIFE = 380        // ms a trail point lives
const SPECK_LIFE = 900  // ms a frost speck lives

/** Comet tail behind the pointer, shedding frost specks that drift and fade. */
export default function CursorTrail() {
  const canvas = useRef(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv.getContext('2d')
    const pts = []
    const specks = []
    let raf = 0
    let dpr = 1

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cv.width = innerWidth * dpr
      cv.height = innerHeight * dpr
    }
    size()

    const draw = () => {
      const now = performance.now()
      while (pts.length && now - pts[0].t > LIFE) pts.shift()
      for (let i = specks.length - 1; i >= 0; i--) if (now - specks[i].t > SPECK_LIFE) specks.splice(i, 1)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      ctx.lineCap = 'round'
      ctx.shadowColor = 'rgba(168, 220, 255, 0.9)'
      ctx.shadowBlur = 12

      // tapered tail: each segment thinner and fainter toward the old end
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const k = 1 - (now - b.t) / LIFE
        ctx.strokeStyle = `rgba(198, 236, 255, ${0.75 * k})`
        ctx.lineWidth = 0.5 + 3.5 * k * (i / pts.length)
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      ctx.shadowBlur = 6
      for (const s of specks) {
        const age = (now - s.t) / SPECK_LIFE
        s.x += s.vx; s.y += s.vy; s.vy += 0.015
        ctx.fillStyle = `rgba(168, 220, 255, ${0.8 * (1 - age)})`
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * (1 - age * 0.6), 0, Math.PI * 2)
        ctx.fill()
      }

      raf = pts.length || specks.length ? requestAnimationFrame(draw) : 0
    }

    const move = (e) => {
      if (e.pointerType !== 'mouse') return
      const now = performance.now()
      const last = pts[pts.length - 1]
      pts.push({ x: e.clientX, y: e.clientY, t: now })
      if (last) {
        const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y)
        if (speed > 6 && Math.random() < Math.min(0.6, speed / 60)) {
          specks.push({
            x: e.clientX, y: e.clientY, t: now,
            vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
            r: 0.8 + Math.random() * 1.4,
          })
        }
      }
      if (!raf) raf = requestAnimationFrame(draw)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('resize', size)
    }
  }, [])

  return <canvas ref={canvas} className="cursor-trail" aria-hidden />
}
