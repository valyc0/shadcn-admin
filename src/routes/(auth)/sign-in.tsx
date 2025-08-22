import { createFileRoute } from '@tanstack/react-router'
import { SignIn } from '@/features/auth/sign-in'
import { z } from 'zod'

const signInSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/(auth)/sign-in')({
  component: SignIn,
  validateSearch: signInSearchSchema,
})
