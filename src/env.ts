import z from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  FIREBASE_PROJECT_ID: z.string(),
  FIREBASE_CLIENT_EMAIL: z.string(),
  FIREBASE_PRIVATE_KEY: z.string(),
  FIREBASE_DATABASE_URL: z.string(),
  OPENAI_API_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
