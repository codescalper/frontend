import { CanvasPreview } from './canvasPreview';

let previewUrl = '';

function toBlob(canvas) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve);
  });
}

export async function ImgPreview(image, crop, scale = 1, rotate = 0) {
  const canvas = document.createElement('canvas');
  CanvasPreview(image, canvas, crop, scale, rotate);

  const blob = await toBlob(canvas);

  if (!blob) {
    console.error('Failed to create blob');
    return '';
  }

  if (previewUrl) {
    URL.revokeObjectURL(previewUrl);
  }

  previewUrl = URL.createObjectURL(blob);
  return previewUrl;
}
