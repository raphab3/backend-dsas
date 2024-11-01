import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),

  SERVER_PORT: z.coerce.number().default(9001),

  APP_HOST: z.string(),
  API_URL: z.string(),
  BACKOFFICE_URL: z.string(),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_DATABASE: z.string(),
  DB_PASSWORD: z.string(),
  DB_USERNAME: z.string(),

  MONGODB_HOST: z.string(),
  MONGODB_DATABASE: z.string(),
  MONGODB_USER: z.string(),
  MONGODB_PASS: z.string(),
  MONGODB_PORT: z.coerce.number(),

  TZ: z.string().default('America/Sao_Paulo'),

  JWT_SECRET: z.string(),
  SALT_PASS: z.string(),

  API_SIGPMPB: z.string(),
  SIGPMPB_PASS: z.string(),
  TOKEN_SIGPMPB: z.string(),
  REFERER_SIGPMPB: z.string(),
});

const env = envSchema.parse(process.env);
try {
  envSchema.safeParse(process.env);
} catch (error) {
  console.error('❌ Invalid environment variables', error);
}

export default env;
