import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: process.cwd() + "/.env" });

const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().default(4000),

    CORS_ORIGIN: z.string().default("http://localhost:3000"),

    JWT_ACCESS_SECRET: z.string().optional(),
    JWT_REFRESH_SECRET: z.string().optional(),
    ACCESS_TTL: z.string().optional(),
    REFRESH_TTL: z.string().optional(),

    DATABASE_URL: z.string().optional(),
    S3_ENDPOINT: z.string().optional(),
    S3_REGION: z.string().optional(),
    S3_BUCKET: z.string().optional(),
    S3_ACCESS_KEY_ID: z.string().optional(),
    S3_SECRET_ACCESS_KEY: z.string().optional(),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>
export const env: Env = envSchema.parse(process.env)

export function getCorsOrigin(): string | RegExp | (string | RegExp)[] {
    const raw = env.CORS_ORIGIN.trim();

    if (!raw) return 'http://localhost:3000';

    if (raw.includes(',')) {
        return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return raw
}
