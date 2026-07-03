import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { institutionOptions, departmentOptions, degreeOptions, fieldOptions } from '@/lib/data'
import type { UserProfile, UpdateProfilePayload, DegreeLevel, ResearchField } from '@/types'

interface EditProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: UserProfile
  onSubmit: (payload: UpdateProfilePayload) => Promise<void>
}

const editProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'Too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Too long'),
  username: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(20, 'Maximum 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  bio: z.string().max(500, 'Bio must be 500 characters or fewer').optional(),
  institution_id: z.string().min(1, 'Select your institution'),
  department_id: z.string().min(1, 'Select your department'),
  degree_level: z.string().min(1, 'Select your degree level'),
  primary_field: z.string().min(1, 'Select your primary field'),
})

type EditProfileForm = z.infer<typeof editProfileSchema>

const MAX_BIO = 500

/**
 * EditProfileModal — form for the profile owner to edit their public profile.
 *
 * Strongly typed via zod + react-hook-form. Only the profile owner sees the
 * "Edit Profile" button that opens this modal. Submit delegates to the parent
 * via onSubmit (which calls the useUpdateProfile hook).
 */
export function EditProfileModal({
  open,
  onOpenChange,
  profile,
  onSubmit,
}: EditProfileModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
  })

  // Sync form defaults whenever the profile changes (or modal reopens)
  useEffect(() => {
    if (open) {
      reset({
        first_name: profile.first_name,
        last_name: profile.last_name,
        username: profile.username,
        bio: profile.bio ?? '',
        institution_id: profile.institution_id,
        department_id: profile.department_id,
        degree_level: profile.degree_level,
        primary_field: 'information_technology', // not stored on User; default to current
      })
    }
  }, [open, profile, reset])

  const bioValue = watch('bio') ?? ''
  const bioRemaining = MAX_BIO - bioValue.length

  async function handleValid(data: EditProfileForm) {
    const payload: UpdateProfilePayload = {
      first_name: data.first_name,
      last_name: data.last_name,
      username: data.username,
      bio: data.bio || undefined,
      institution_id: data.institution_id,
      department_id: data.department_id,
      degree_level: data.degree_level as DegreeLevel,
      primary_field: data.primary_field as ResearchField,
    }
    await onSubmit(payload)
    onOpenChange(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) {
      reset()
    }
    onOpenChange(next)
  }

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit profile"
      description="Update your public profile information."
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="edit-profile-form"
            size="sm"
            loading={isSubmitting}
          >
            Save changes
          </Button>
        </>
      }
    >
      <form id="edit-profile-form" onSubmit={handleSubmit(handleValid)} className="space-y-5">
        {/* Names */}
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

        {/* Username */}
        <Input
          label="Username"
          placeholder="juan_delacruz"
          error={errors.username?.message}
          {...register('username')}
        />

        {/* Bio */}
        <div className="space-y-1.5">
          <label
            htmlFor="edit-bio"
            className="block text-xs font-medium text-text-muted font-mono tracking-wide uppercase"
          >
            Bio
          </label>
          <textarea
            id="edit-bio"
            rows={4}
            placeholder="Tell the community about your research interests..."
            className="input-terminal resize-y min-h-[100px]"
            {...register('bio')}
          />
          <div className="flex justify-end">
            <span className={`text-[10px] font-mono tabular-nums ${bioRemaining < 50 ? 'text-warning' : 'text-text-dim'}`}>
              {bioRemaining} chars left
            </span>
          </div>
          {errors.bio && (
            <p className="text-xs text-danger font-mono">{errors.bio.message}</p>
          )}
        </div>

        {/* Academic */}
        <Select
          label="Institution"
          options={institutionOptions}
          placeholder="Select your university"
          error={errors.institution_id?.message}
          {...register('institution_id')}
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
      </form>
    </Modal>
  )
}
