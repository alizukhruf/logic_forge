import { motion } from 'framer-motion'

const letters = [...'Logic Forge']

export function LoadingScreen({ reducedMotion = false }) {
  const duration = reducedMotion ? 0.35 : 0.95

  return (
    <motion.div
      className="loading-screen"
      role="status"
      aria-label="Loading Logic Forge"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: reducedMotion ? 0.2 : 0.55, ease: 'easeInOut' } }}
    >
      <div className="loading-screen__ambient loading-screen__ambient--one" />
      <div className="loading-screen__ambient loading-screen__ambient--two" />
      <motion.div
        className="loading-screen__content"
        initial={reducedMotion ? false : { y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reducedMotion ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="loading-screen__mark-wrap"
          initial={reducedMotion ? false : { scale: 0.58, rotateY: -70, rotateZ: -14, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, rotateZ: 0, opacity: 1 }}
          transition={{ duration, delay: reducedMotion ? 0 : 0.12, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            className="loading-screen__orbit loading-screen__orbit--outer"
            initial={reducedMotion ? false : { rotate: -90, scale: 0.55, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.25 : 1.25, delay: reducedMotion ? 0 : 0.25, ease: 'easeOut' }}
          />
          <motion.span
            className="loading-screen__orbit loading-screen__orbit--inner"
            initial={reducedMotion ? false : { rotate: 80, scale: 0.65, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: reducedMotion ? 0.25 : 1.05, delay: reducedMotion ? 0 : 0.38, ease: 'easeOut' }}
          />
          <motion.img
            src={`${import.meta.env.BASE_URL}logic-forge-mark.png`}
            alt=""
            className="loading-screen__mark"
            initial={reducedMotion ? false : {
              clipPath: 'polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)',
              filter: 'brightness(2.2) drop-shadow(0 0 0 rgba(34,211,238,0))',
            }}
            animate={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              filter: 'brightness(1) drop-shadow(0 0 26px rgba(34,211,238,.45))',
            }}
            transition={{ duration, delay: reducedMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
          {!reducedMotion && [0, 1, 2, 3, 4, 5].map(index => (
            <motion.i
              key={index}
              className="loading-screen__spark"
              style={{ '--spark-index': index }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 0.7], opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.62 + index * 0.08, ease: 'easeOut' }}
            />
          ))}
        </motion.div>

        <div className="loading-screen__wordmark" aria-hidden="true">
          {letters.map((letter, index) => (
            <motion.span
              key={`${letter}-${index}`}
              className={letter === ' ' ? 'loading-screen__space' : ''}
              initial={reducedMotion ? false : {
                opacity: 0,
                y: 22,
                rotateX: -80,
                filter: 'blur(8px)',
              }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              transition={{
                duration: reducedMotion ? 0.2 : 0.55,
                delay: reducedMotion ? 0 : 0.65 + index * 0.055,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === ' ' ? '\u00a0' : letter}
            </motion.span>
          ))}
        </div>
        <motion.p
          className="loading-screen__tagline"
          initial={reducedMotion ? false : { opacity: 0, letterSpacing: '0.55em', y: 8 }}
          animate={{ opacity: 1, letterSpacing: '0.34em', y: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.7, delay: reducedMotion ? 0 : 1.12 }}
        >
          DESIGN <span>·</span> DEVELOP <span>·</span> LAUNCH
        </motion.p>
      </motion.div>

      <motion.div
        className="loading-screen__progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reducedMotion ? 0.25 : 2.3, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}
