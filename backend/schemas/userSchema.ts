import { z } from 'zod';

export const emailPasswordSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
});

export const googleLoginSchema = z.object({
    code: z.string(),
    redirectUri: z.string(),
});
