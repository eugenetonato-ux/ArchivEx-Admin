import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svgPath = path.join(process.cwd(), 'public', 'icon.svg');
const publicDir = path.join(process.cwd(), 'public');

async function generateIcons() {
  try {
    console.log('Generating PWA PNG icons from SVG...');

    // 1. Standard 192x192 icon
    await sharp(svgPath)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'pwa-192x192.png'));
    console.log('✓ Generated pwa-192x192.png');

    // 2. Standard 512x512 icon
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'pwa-512x512.png'));
    console.log('✓ Generated pwa-512x512.png');

    // 3. Apple Touch Icon 180x180
    await sharp(svgPath)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('✓ Generated apple-touch-icon.png');

    // 4. Maskable 512x512 icon (needs 10-15% padding, meaning we scale down the icon and place on full-bleed background)
    // To do this elegantly, we extract the gradient background first and composite the scaled logo on top.
    const bg = Buffer.from(`
      <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4F46E5;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="512" height="512" rx="0" fill="url(#grad)" />
      </svg>
    `);

    // Scale the source icon down to 75% size (384x384) to act as safe zone content
    const scaledLogo = await sharp(svgPath)
      .resize(384, 384)
      .png()
      .toBuffer();

    await sharp(bg)
      .composite([{ input: scaledLogo, top: 64, left: 64 }])
      .png()
      .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
    console.log('✓ Generated pwa-maskable-512x512.png with safe-zone padding');

    console.log('All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
