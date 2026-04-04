import sharp from 'sharp';

async function checkColors() {
  const inputPath = 'public/uap-logo-premium-v3.png';
  try {
    const { data } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
    console.log('First pixel (RGB):', data[0], data[1], data[2]);
  } catch (err) {
    console.log('Error:', err);
  }
}
checkColors();
