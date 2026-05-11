import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Lock,
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Shield,
  Check,
} from 'lucide-react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/stores/auth'

import type { DegreeLevel, ResearchField } from '@/types'
import {
  institutionOptions,
  departmentOptions,
  degreeOptions,
  fieldOptions,
} from '@/lib/data'

const registerSchema = z
  .object({
    first_name: z.string().min(2, 'Must be at least 2 characters').max(50, 'Too long'),
    last_name: z.string().min(2, 'Must be at least 2 characters').max(50, 'Too long'),
    username: z
      .string()
      .min(3, 'Must be at least 3 characters')
      .max(20, 'Maximum 20 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .regex(/[A-Z]/, 'Must have at least 1 uppercase letter')
      .regex(/[a-z]/, 'Must have at least 1 lowercase letter')
      .regex(/[0-9]/, 'Must have at least 1 number'),
    password_confirmation: z.string().min(1, 'Please confirm your password'),
    institution_id: z.string().min(1, 'Select your institution'),
    department_id: z.string().min(1, 'Select your department'),
    degree_level: z.string().min(1, 'Select your degree level'),
    primary_field: z.string().min(1, 'Select your primary field'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

type RegisterForm = z.infer<typeof registerSchema>

const passwordRules = [
  { label: '8+ characters', test: (v: string) => v.length >= 8 },
  { label: '1 uppercase', test: (v: string) => /[A-Z]/.test(v) },
  { label: '1 lowercase', test: (v: string) => /[a-z]/.test(v) },
  { label: '1 number', test: (v: string) => /[0-9]/.test(v) },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading, error, clearError } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      institution_id: '',
      department_id: '',
      degree_level: '',
      primary_field: '',
    },
  })

  const watchedPassword = watch('password')
  const watchedInstitution = watch('institution_id')

  async function onSubmit(data: RegisterForm) {
    try {
      clearError()
      await registerUser({
        ...data,
        degree_level: data.degree_level as DegreeLevel,
        primary_field: data.primary_field as ResearchField,
      })
      navigate('/feed')
    } catch {
      // Error handled by store
    }
  }

  function handleInstitutionChange(value: string) {
    setValue('institution_id', value)
    setValue('department_id', '')
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3 },
    }),
  }

  return (
    <AuthLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-8 rounded-full bg-flame" />
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text">
            Create account
          </h2>
        </div>
        <p className="text-sm text-text-muted font-body ml-4">
          Join the Philippine academic research community
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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {/* ===== Section: Personal Info ===== */}
        <motion.fieldset
          custom={0}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <legend className="flex items-center gap-2 text-xs font-mono font-medium text-text-dim uppercase tracking-widest mb-3">
            <User className="w-3.5 h-3.5" />
            Personal Information
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Juan"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="Dela Cruz"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Username"
              icon={<Shield className="w-4 h-4" />}
              placeholder="juan_delacruz"
              error={errors.username?.message}
              {...register('username')}
            />
            <p className="text-[10px] text-text-dim font-mono mt-1">
              Your public identity. Letters, numbers, and underscores only.
            </p>
          </div>
        </motion.fieldset>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* ===== Section: Contact ===== */}
        <motion.fieldset
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <legend className="flex items-center gap-2 text-xs font-mono font-medium text-text-dim uppercase tracking-widest mb-3">
            <Mail className="w-3.5 h-3.5" />
            Contact
          </legend>
          <Input
            label="Email Address"
            icon={<Mail className="w-4 h-4" />}
            type="email"
            placeholder="juan.delacruz@university.edu.ph"
            error={errors.email?.message}
            {...register('email')}
          />
          <p className="text-[10px] text-text-dim font-mono mt-1.5">
            Using your <span className="text-flame">.edu.ph</span> email helps verify your student status faster.
          </p>
        </motion.fieldset>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* ===== Section: Security ===== */}
        <motion.fieldset
          custom={5}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <legend className="flex items-center gap-2 text-xs font-mono font-medium text-text-dim uppercase tracking-widest mb-3">
            <Lock className="w-3.5 h-3.5" />
            Security
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="Create a strong password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              icon={<Lock className="w-4 h-4" />}
              type="password"
              placeholder="Re-enter your password"
              error={errors.password_confirmation?.message}
              {...register('password_confirmation')}
            />
          </div>
          {/* Live password strength indicator */}
          {watchedPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 flex flex-wrap gap-x-4 gap-y-1"
            >
              {passwordRules.map((rule) => (
                <div
                  key={rule.label}
                  className="flex items-center gap-1 text-[10px] font-mono"
                >
                  {rule.test(watchedPassword) ? (
                    <Check className="w-3 h-3 text-success" />
                  ) : (
                    <div className="w-3 h-3 rounded-full border border-text-dim" />
                  )}
                  <span
                    className={
                      rule.test(watchedPassword)
                        ? 'text-success'
                        : 'text-text-dim'
                    }
                  >
                    {rule.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </motion.fieldset>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* ===== Section: Academic Profile ===== */}
        <motion.fieldset
          custom={8}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <legend className="flex items-center gap-2 text-xs font-mono font-medium text-text-dim uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Profile
          </legend>
          <div className="space-y-4">
            <Select
                label="Institution"
                options={institutionOptions}
                placeholder="Select your university / college"
                error={errors.institution_id?.message}
                value={watchedInstitution}
                onChange={(e) => handleInstitutionChange(e.target.value)}
            />
            <Select
              label="Department / College"
              options={departmentOptions}
              placeholder="Select your department"
              error={errors.department_id?.message}
              {...register('department_id')}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Degree Level"
                options={degreeOptions}
                placeholder="Select degree level"
                error={errors.degree_level?.message}
                {...register('degree_level')}
              />
              <Select
                label="Primary Research Field"
                options={fieldOptions}
                placeholder="Select your field"
                error={errors.primary_field?.message}
                {...register('primary_field')}
              />
            </div>
          </div>
        </motion.fieldset>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Submit */}
        <motion.div
          custom={12}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="space-y-4"
        >
          <Button type="submit" loading={isLoading} fullWidth size="lg">
            Create Account
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-[10px] text-text-dim font-mono text-center leading-relaxed">
            By creating an account, you agree to the Proyekto{' '}
            <a href="#" className="text-flame hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-flame hover:underline">
              Academic Integrity Policy
            </a>
            .
          </p>
        </motion.div>

        {/* Login link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-4 border-t border-border text-center"
        >
          <p className="text-sm text-text-dim font-mono">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-flame hover:text-flame-hover font-medium transition-colors inline-flex items-center gap-1"
            >
              Sign in
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </motion.div>
      </form>
    </AuthLayout>
  )
}