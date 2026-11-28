// Sharp is supplied by Next.js. Originals stay intact for large and high-DPI screens.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.join(__dirname, '..');
const photos = ['investors/aerial', 'partners/landscape', 'blog/cover', 'installment/house', 'certificate/family-forest', 'mortgage/house', 'mortgage/plot'];

(async () => {
  const manifest = {};
  for (const photo of photos) {
    const src = `/images/${photo}.webp`;
    const input = path.join(root, 'public', src);
    const { width } = await sharp(input).metadata();
    const variants = [];
    for (const size of [640, 1280, 1920].filter(size => size < width)) {
      const output = `/images/${photo}-${size}.webp`;
      await sharp(input).resize({width:size}).webp({quality:84,effort:6}).toFile(path.join(root, 'public', output));
      variants.push({src:output,width:size});
    }
    manifest[src] = [...variants, {src,width}];
  }
  await fs.writeFile(path.join(root, 'content', 'responsive-images.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Responsive variants generated for ${photos.length} photographs.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
