const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, 'images', 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function convertSvgToPng(size) {
  const outputPath = path.join(__dirname, 'images', `icon${size}.png`);
  
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outputPath);
  
  console.log(`Created ${outputPath}`);
}

async function convertAll() {
  for (const size of sizes) {
    await convertSvgToPng(size);
  }
  console.log('All icons created successfully!');
}

convertAll().catch(err => {
  console.error('Error converting icons:', err);
}); 