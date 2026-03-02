import { z } from "zod";

const envSchema = z.object({
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    // Supabase service role (server-only)
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
    // Database (Prisma)
    DATABASE_URL: z.string().url(),
    // App
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        const { fieldErrors } = parsed.error.flatten();
        const missing = Object.entries(fieldErrors)
            .map(([key, errors]) => `  ${key}: ${errors?.join(", ")}`)
            .join("\n");
        throw new Error(`❌ Invalid environment variables:\n${missing}`);
    }
    return parsed.data;
}

export const env = validateEnv();
