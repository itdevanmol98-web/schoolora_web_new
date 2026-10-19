import { z } from 'zod'

const envSchema = z.object({
  VITE_API_BASE_URL: z
    .string()
    .url('VITE_API_BASE_URL must be a valid URL')
    .default('http://localhost:4000/api/v1'),
  VITE_APP_NAME: z.string().default('AxioNexa ERP'),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MODE: z.string().optional(),
  DEV: z.boolean().optional(),
  PROD: z.boolean().optional(),
})

const parsedEnv = envSchema.safeParse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  VITE_APP_ENV: import.meta.env.VITE_APP_ENV || (import.meta.env.MODE as string),
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
})

if (!parsedEnv.success) {
  // Log configuration errors clearly without crashing during test runs if optional
  console.error('Invalid frontend environment variables:', parsedEnv.error.format())
}

export const env = {
  apiBaseUrl: parsedEnv.success
    ? parsedEnv.data.VITE_API_BASE_URL
    : 'http://localhost:4000/api/v1',
  appName: parsedEnv.success ? parsedEnv.data.VITE_APP_NAME : 'AxioNexa ERP',
  isDev: import.meta.env.DEV ?? false,
  isProd: import.meta.env.PROD ?? false,
  isTest: import.meta.env.MODE === 'test',
}

export type EnvConfig = typeof env
