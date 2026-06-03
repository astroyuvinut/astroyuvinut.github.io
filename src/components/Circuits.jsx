import { motion } from 'framer-motion'

/* PCB-style circuit traces that sit behind the hero figure. Each trace draws
   itself in on load, then a bright pulse travels along it on a CSS loop.
   Nodes pulse at the junctions. Purely decorative. */

const TRACES = [
  'M-20 140 H 220 V 60 H 360',
  'M-20 250 H 140 V 360 H 300 V 300 H 460',
  'M-20 470 H 180 V 540 H 380',
  'M-20 640 H 260 V 560 H 420 V 660 H 560',
  'M1220 120 H 1010 V 220 H 880 V 160 H 760',
  'M1220 300 H 1040 V 380 H 900',
  'M1220 470 H 980 V 540 H 820 V 470 H 700',
  'M1220 640 H 1060 V 560 H 900 V 660 H 760',
  'M600 -20 V 90 H 520',
  'M680 820 V 700 H 760',
]

const NODES = [
  [360, 60], [460, 300], [380, 540], [560, 660],
  [760, 160], [900, 380], [700, 470], [760, 660],
  [520, 90], [760, 700],
]

export default function Circuits({ glowMask }) {
  return (
    <>
      {/* base layer: faint board + flowing pulses + pulsing nodes */}
      <svg
        className="hero__circuits"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <g className="circuits__base">
          {TRACES.map((d, i) => (
            <motion.path
              key={`b${i}`}
              d={d}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.22 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 1.2, ease: 'easeInOut' }}
            />
          ))}
        </g>

        <g className="circuits__flow">
          {TRACES.map((d, i) => (
            <path
              key={`f${i}`}
              d={d}
              style={{ animationDelay: `${i * 0.6}s`, animationDuration: `${3.2 + (i % 4) * 0.7}s` }}
            />
          ))}
        </g>

        <g className="circuits__nodes">
          {NODES.map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.08, duration: 0.5 }}
              style={{ animationDelay: `${i * 0.4}s` }}
            />
          ))}
        </g>
      </svg>

      {/* glow layer: bright copy revealed only around the cursor */}
      <motion.svg
        className="hero__circuits hero__circuits--glow"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
        style={{ WebkitMaskImage: glowMask, maskImage: glowMask }}
      >
        <g className="circuits__lit">
          {TRACES.map((d, i) => <path key={`g${i}`} d={d} />)}
        </g>
        <g className="circuits__lit-nodes">
          {NODES.map(([x, y], i) => <circle key={`gn${i}`} cx={x} cy={y} r="5" />)}
        </g>
      </motion.svg>
    </>
  )
}
