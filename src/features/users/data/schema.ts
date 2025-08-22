import { z } from 'zod'

const userSchema = z.object({
  id: z.number().optional(),
  username: z.string(),
  password: z.string().optional(),
  role_id: z.number(),
  role_name: z.string().optional(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
