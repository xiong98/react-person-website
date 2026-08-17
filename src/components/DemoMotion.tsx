import { motion } from 'motion/react'

export function DemoMotion() {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-cyan-300">motion（Framer Motion）</h3>
      <motion.button
        className="rounded bg-violet-600 px-4 py-2 text-sm hover:bg-violet-500"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        悬浮 / 点击 / 上下浮动
      </motion.button>
    </div>
  )
}
