import { z } from 'zod'

export const userProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/).optional(),
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['founder', 'developer', 'consultant', 'investor', 'other']).optional(),
})

export const postSchema = z.object({
  content: z.string().min(1).max(3000),
  post_type: z.enum(['insight', 'question', 'case_study', 'hiring']),
  visibility: z.enum(['public', 'connections']).default('public'),
})

export const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  parent_comment_id: z.string().uuid().optional(),
})

export const companySchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().url().optional(),
  logo_url: z.string().url().optional(),
  description: z.string().max(500).optional(),
})

export const connectionRequestSchema = z.object({
  receiver_id: z.string().uuid(),
  note: z.string().max(300).optional(),
})
