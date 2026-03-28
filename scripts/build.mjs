import * as esbuild from 'esbuild'
import { execSync } from 'child_process'
import { mkdirSync, copyFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { getEnvDefine } from './env-define.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

mkdirSync(join(root, 'dist/assets'), { recursive: true })

execSync(
  'npx @tailwindcss/cli -i ./src/index.css -o ./dist/assets/index.css',
  { cwd: root, stdio: 'inherit' },
)

await esbuild.build({
  entryPoints: [join(root, 'src/main.jsx')],
  bundle: true,
  outfile: join(root, 'dist/assets/bundle.js'),
  format: 'esm',
  jsx: 'automatic',
  minify: true,
  sourcemap: true,
  loader: { '.svg': 'file' },
  define: getEnvDefine(),
})

copyFileSync(join(root, 'index.html'), join(root, 'dist/index.html'))
copyFileSync(join(root, 'dist/index.html'), join(root, 'dist/404.html'))
copyFileSync(join(root, 'public/vite.svg'), join(root, 'dist/vite.svg'))
writeFileSync(join(root, 'dist/.nojekyll'), '')
