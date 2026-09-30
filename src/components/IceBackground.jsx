import { useEffect, useRef, useState } from 'react'
import { setIce } from '../lib/iceHandle'

/**
 * Fixed full-screen 3D ice field behind the whole site. three.js is loaded
 * lazily after first paint so it never blocks the hero; if WebGL is missing
 * the canvas is dropped and a CSS gradient takes over.
 */
export default function IceBackground({ stationCount }) {
  const canvasRef = useRef(null)
  const hudRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    // cancelled also covers StrictMode's mount → unmount → mount: the first
    // pass is torn down before the dynamic import resolves, so only one scene exists.
    let cancelled = false
    let ice = null
    let unbind = () => {}

    const start = () =>
      import('../lib/iceScene')
        .then(({ createIceScene, bindScrollShots, scramble }) => {
          if (cancelled || !canvasRef.current) return
          ice = createIceScene(canvasRef.current, { stationCount })
          if (!ice) { setFallback(true); return }
          setIce(ice)
          unbind = bindScrollShots(ice, { onLabel: (t) => scramble(hudRef.current, t) })
          requestAnimationFrame(() => !cancelled && setReady(true))
        })
        .catch(() => !cancelled && setFallback(true))

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1200 })
      : window.setTimeout(start, 200)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      unbind()
      ice?.destroy()
      setIce(null)
    }
  }, [stationCount])

  return (
    <div className={`ice-bg ${fallback ? 'ice-bg--fallback' : ''}`} aria-hidden="true">
      {!fallback && (
        <canvas ref={canvasRef} className={`ice-bg__canvas ${ready ? 'is-ready' : ''}`} />
      )}
      <div className="ice-bg__vignette" />
      {!fallback && <span className="ice-hud" ref={hudRef}>Intro</span>}
    </div>
  )
}
