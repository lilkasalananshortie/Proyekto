import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { AuthLayout } from '@/components/layout/Authlayout'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginForm) {
    try {
      clearError()
      await login(data)
      navigate('/feed')
    } catch {
      // Error is already set in the store
    }
  }

  const formFields = [
    { name: 'email' as const, label: 'Email Address', icon: <Mail className="w-4 h-4" /> },
    { name: 'password' as const, label: 'Password', icon: <Lock className="w-4 h-4" /> },
  ]

  return (
    <AuthLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <h2 className="font-display font-bold text-2xl md:text-3xl text-text mb-1">
          Welcome back
        </h2>
        <p className="text-sm text-text-muted font-body">
          Sign in to access your research library
        </p>
      </motion.div>

      {/* Error alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/30"
        >
          <p className="text-xs font-mono text-danger">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {formFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.06, duration: 0.3 }}
          >
            <Input
              label={field.label}
              icon={field.icon}
              type={field.name === 'password' && !showPassword ? 'password' : 'text'}
              placeholder={field.name === 'email' ? 'you@university.edu.ph' : 'Enter your password'}
              error={errors[field.name]?.message}
              {...register(field.name)}
            />
          </motion.div>
        ))}

        {/* Show/hide password toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-surface text-flame focus:ring-flame/30 accent-flame"
            />
            <span className="text-xs font-mono text-text-dim group-hover:text-text-muted transition-colors">
              Remember me
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-1 text-xs font-mono text-text-dim hover:text-flame transition-colors"
          >
            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </motion.div>

        {/* Forgot password */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-right"
        >
          <a href="#" className="text-xs font-mono text-flame hover:text-flame-hover transition-colors">
            Forgot password?
          </a>
        </motion.div>

        {/* Submit button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Button type="submit" loading={isLoading} fullWidth size="lg">
            Sign In
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </form>

      {/* Register link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 pt-6 border-t border-border text-center"
      >
        <p className="text-sm text-text-dim font-mono">
          New to Proyekto?{' '}
          <Link
            to="/register"
            className="text-flame hover:text-flame-hover font-medium transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}