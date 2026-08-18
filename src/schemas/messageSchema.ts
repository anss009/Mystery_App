import {z} from 'zod'

export const signInSchema = z.object({
    content: z
    .string()
    .min(10, {message: 'Content must be atleast 10 character '})
    .max(300, {message: ' Content must no longer than 300 character'})
})  