import sharp from 'sharp';

async function removeBackground() {
  const inputPath = 'public/uap-logo-premium-v3.png';
  const outputPath = 'public/uap-logo-ultra-transparent.png';

  try {
    const input = sharp(inputPath);
    const { width, height } = await input.metadata();

    // Aggressive background removal:
    // Create an alpha mask from the inverse of the brightest parts
    const mask = await input
      .grayscale()
      .linear(1.5, -50) // Increase contrast (make whites whiter)
      .negate() // Flip: Whites become Transparent (0), Darks become Opaque (255)
      .toBuffer();

    await input
      .joinChannel(mask)
      .toFormat('png')
      .toFile(outputPath);
      
    console.log('Successfully created ULTRA transparent PNG.');
  } catch (err) {
    console.error('Error processing logo:', err);
  }
}

removeBackground();
