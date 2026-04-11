import sharp from 'sharp';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const images = [
  {
    input: 'assets/images/logo.png',
    output: 'assets/images/logo.webp',
    width: 720,
    quality: 85,
  },
];

for (const { input, output, width, quality } of images) {
  const inputPath = join(root, input);
  const outputPath = join(root, output);

  if (!existsSync(inputPath)) {
    console.warn(`  skipped  ${input} (file not found)`);
    continue;
  }

  await sharp(inputPath)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(outputPath);

  const { size } = await import('fs').then(fs => fs.promises.stat(outputPath));
  console.log(`  optimized  ${output}  (${(size / 1024).toFixed(0)} KB)`);
}
