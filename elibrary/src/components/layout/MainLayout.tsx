import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-base bg-grid">
      {/* Scan line decoration */}
      <div className="scan-line pointer-events-none fixed inset-0 z-50" />

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative z-10 mx-auto min-h-screen"
      >
        <Outlet />
      </motion.main>
    </div>
  )
}