import * as esbuild from 'esbuild'
import { spawn, execSync } from 'child_process'
import { mkdirSync, copyFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { getEnvDefine } from './env-define.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

mkdirSync(join(root, 'dist/assets'), { recursive: true })
copyFileSync(join(root, 'index.html'), join(root, 'dist/index.html'))
copyFileSync(join(root, 'public/vite.svg'), join(root, 'dist/vite.svg'))

execSync(
  'npx @tailwindcss/cli -i ./src/index.css -o ./dist/assets/index.css',
  { cwd: root, stdio: 'inherit' },
)

const tw = spawn(
  'npx',
  ['@tailwindcss/cli', '-i', './src/index.css', '-o', './dist/assets/index.css', '--watch'],
  { cwd: root, stdio: 'inherit', shell: true },
)

const ctx = await esbuild.context({
  entryPoints: [join(root, 'src/main.jsx')],
  bundle: true,
  outfile: join(root, 'dist/assets/bundle.js'),
  format: 'esm',
  jsx: 'automatic',
  sourcemap: true,
  loader: { '.svg': 'file' },
  define: getEnvDefine(),
})

const shutdown = () => {
  tw.kill('SIGTERM')
  ctx.dispose().catch(() => {})
  process.exit(0)
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

await ctx.serve({
  servedir: join(root, 'dist'),
  port: 5173,
  host: 'localhost',
})

console.log(`\n  Dev server running at http://localhost:5173\n`)
