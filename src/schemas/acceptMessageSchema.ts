import {z} from 'zod'

export const signInSchema = z.object({
    acceptMessage: z.boolean(),
})  