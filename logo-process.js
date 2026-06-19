import { Jimp } from 'jimp';
import fs from 'fs';

async function processLogo() {
  try {
    console.log('Reading logo.png...');
    const image = await Jimp.read('logo.png');
    
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    console.log(`Image dimensions: ${width}x${height}`);
    
    // Scan pixel by pixel
    image.scan(0, 0, width, height, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const a = this.bitmap.data[idx + 3];

      // White/near-white pixel detection (background)
      // Since it could be slightly compression-noisy, we check if R, G, B are all high.
      if (r > 220 && g > 220 && b > 220) {
        this.bitmap.data[idx + 3] = 0; // Make transparent
      } 
      // Black/near-black pixel detection (text "Fikra Forge")
      // We check if R, G, B are all low and not transparent
      else if (r < 100 && g < 100 && b < 100 && a > 30) {
        // Change text color to light grey/white (#F5F5F7)
        this.bitmap.data[idx + 0] = 245;
        this.bitmap.data[idx + 1] = 245;
        this.bitmap.data[idx + 2] = 247;
        this.bitmap.data[idx + 3] = 255;
      }
    });

    console.log('Writing transparent white logo to public/logo.png...');
    await image.write('public/logo.png');
    console.log('Success!');
  } catch (error) {
    console.error('Error processing logo:', error);
  }
}

processLogo();
