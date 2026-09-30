import { motion } from 'framer-motion'

/** Floating button — downloads the résumé PDF from /public on click. */
export default function ResumeButton() {
  return (
    <motion.a
      className="resume-fab"
      href={`${import.meta.env.BASE_URL}Yuvaraj-Resume.pdf`}
      download="Yuvaraju-Bondada-Resume.pdf"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="resume-fab__dot" />
      Résumé
      <span className="resume-fab__icon" aria-hidden>↓</span>
    </motion.a>
  )
}
