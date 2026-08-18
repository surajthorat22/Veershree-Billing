export async function fileToResizedDataUrl(
  file: File,
  maxWidth = 900,
  maxHeight = 900,
): Promise<string> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to process the image.');
    }
    context.drawImage(image, 0, 0, width, height);
    const mime = file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png';
    return canvas.toDataURL(mime, 0.9);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to read the selected image.'));
    image.src = src;
  });
}
