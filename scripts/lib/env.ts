import { config } from 'dotenv'
import { resolve } from 'node:path'

config({ path: resolve(process.cwd(), '.env') })

export function getEnv(key: string, required = true): string {
  const value = process.env[key]
  if (!value && required) {
    throw new Error(`Umgebungsvariable ${key} fehlt in .env`)
  }
  return value ?? ''
}

export const DIRECTUS_URL = () => getEnv('DIRECTUS_URL')
export const DIRECTUS_TOKEN = () => getEnv('DIRECTUS_TOKEN')
