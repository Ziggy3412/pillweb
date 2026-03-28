import { existsSync, readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

let dotEnvLoaded = false

/** Loads project `.env` into `process.env` (only keys not already set). */
function loadDotEnv() {
  if (dotEnvLoaded) return
  dotEnvLoaded = true
  const p = join(projectRoot, '.env')
  if (!existsSync(p)) return
  const text = readFileSync(p, 'utf8')
  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

/** For GitHub Pages project sites (e.g. /pillweb/). No trailing slash. */
function publicBasePath() {
  const raw = (process.env.PUBLIC_BASE_PATH || '').trim()
  if (!raw || raw === '/') return ''
  return raw.replace(/\/+$/, '')
}

/** Injected into the browser bundle. Use `.env` or export VITE_* before dev/build. */
export function getEnvDefine() {
  loadDotEnv()
  return {
    __GOOGLE_CLIENT_ID__: JSON.stringify(process.env.VITE_GOOGLE_CLIENT_ID || ''),
    __API_URL__: JSON.stringify(process.env.VITE_API_URL || 'http://localhost:3000'),
    __BASE_PATH__: JSON.stringify(publicBasePath()),
  }
}
