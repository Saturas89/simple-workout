import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const svgBuffer = readFileSync(join(publicDir, 'icon.svg'))

const sizes = [
  { file: 'apple-touch-icon.png', size: 180, radius: 0 },   // iOS adds its own rounding
  { file: 'icon-192.png',         size: 192, radius: 0 },
  { file: 'icon-512.png',         size: 512, radius: 0 },
  { file: 'icon-192-maskable.png', size: 192, radius: 0 },
  { file: 'icon-512-maskable.png', size: 512, radius: 0 },
  { file: 'favicon-32.png',       size: 32,  radius: 0 },
]

for (const { file, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(join(publicDir, file))
  console.log(`✓ ${file} (${size}×${size})`)
}
