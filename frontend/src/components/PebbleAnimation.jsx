import { motion } from 'framer-motion'


export default function PebbleAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-8 h-8 bg-gray-600 rounded-full"
        initial={{
          x: -50,
          y: '40vh',
          opacity: 0.3,
          scale: 1
        }}
        animate={{
          x: ['0vw', '20vw', '40vw', '60vw', '80vw', '110vw'],
          y: ['40vh', '35vh', '40vh', '38vh', '42vh', '80vh'],
          opacity: [0.3, 0.4, 0.4, 0.3, 0.2, 0],
          scale: [1, 1, 1, 1, 0.8, 0.5]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 0.4, 0.6, 0.8, 1]
        }}
      />
    </div>
  )
}