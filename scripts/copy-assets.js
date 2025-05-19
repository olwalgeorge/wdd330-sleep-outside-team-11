const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
  try {
    const sourceJson = path.join(__dirname, '..', 'src', 'public', 'json');
    const destinationJson = path.join(__dirname, '..', 'dist', 'json');
    await fs.copy(sourceJson, destinationJson);
    console.log('JSON directory copied successfully!');

    const sourceImages = path.join(__dirname, '..', 'src', 'public', 'images');
    const destinationImages = path.join(__dirname, '..', 'dist', 'images');
    await fs.copy(sourceImages, destinationImages);
    console.log('Images directory copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

copyAssets();