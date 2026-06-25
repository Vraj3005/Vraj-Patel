import { z } from 'zod';

// Contact Form Schema with Honeypot spam verification and field length constraints
export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name is too long. Max 100 characters.'),
  email: z
    .string()
    .email('Please enter a valid email address.')
    .max(100, 'Email is too long. Max 100 characters.'),
  subject: z
    .string()
    .min(3, 'Subject must be at least 3 characters.')
    .max(200, 'Subject is too long. Max 200 characters.'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters.')
    .max(5000, 'Message is too long. Max 5000 characters.'),
  // Honeypot spam field. Hidden from user, bots populate it.
  honeypot: z.string().max(0, { message: 'Spam detected.' }).optional(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// AI Assistant input validation with prompt & history limits
export const aiChatInputSchema = z.object({
  prompt: z
    .string()
    .min(1, 'Prompt is required.')
    .max(500, 'Prompt is too long. Max 500 characters.'),
  sessionId: z.string().max(100, 'Session ID is too long.').optional(),
  stream: z.boolean().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'model']),
        parts: z.array(
          z.object({
            text: z.string().max(1000, 'History message parts must be less than 1000 characters.'),
          })
        ),
      })
    )
    .max(20, 'History cannot exceed 20 conversation turns.')
    .optional(),
});

export type AIChatInput = z.infer<typeof aiChatInputSchema>;

// Blog Post schema validation (Admin scope)
export const blogPostInputSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters.')
    .max(200, 'Title is too long. Max 200 characters.'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters.')
    .max(100, 'Slug is too long. Max 100 characters.')
    .regex(/^[a-z0-9-_]+$/, 'Slug must only contain lowercase letters, numbers, dashes, and underscores.'),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters.')
    .max(50000, 'Content is too long. Max 50000 characters.'),
  cover_image_url: z.string().url('Invalid image URL location.').or(z.string().max(0)).optional(),
  status: z.enum(['draft', 'published', 'archived']),
});

export type BlogPostInput = z.infer<typeof blogPostInputSchema>;
