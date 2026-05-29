const imagePath = 'image/nun2.png';
const PIXEL_SIZE = 4;

let img = new Image();
let canvas, ctx, hiddenCanvas, hiddenCtx;

window.addEventListener('load', () => {
  canvas = document.getElementById('pixelCanvas');
  ctx = canvas.getContext('2d');

  hiddenCanvas = document.createElement('canvas');
  hiddenCtx = hiddenCanvas.getContext('2d');

  img.onload = () => {
    resizeCanvas();
    drawPixelArt(PIXEL_SIZE);
  };

  img.onerror = () => {
    console.error('无法加载图片，请确认路径是否正确：', imagePath);
  };

  img.src = imagePath;

  window.addEventListener('resize', () => {
    resizeCanvas();
    drawPixelArt(PIXEL_SIZE);
  });
});

function resizeCanvas() {
  const container = document.querySelector('.canvas-wrapper');
  const maxWidth = container.clientWidth;
  const aspectRatio = img.width / img.height || 1;
  const width = Math.min(maxWidth, img.width);

  canvas.width = width;
  canvas.height = Math.round(width / aspectRatio);
}

function drawPixelArt(pixelSize) {
  if (!img.complete || img.naturalWidth === 0) return;

  hiddenCanvas.width = img.width;
  hiddenCanvas.height = img.height;
  hiddenCtx.drawImage(img, 0, 0, img.width, img.height);

  const scaledWidth = canvas.width;
  const scaledHeight = canvas.height;

  ctx.clearRect(0, 0, scaledWidth, scaledHeight);
  ctx.imageSmoothingEnabled = false;

  const scaleX = img.width / scaledWidth;
  const scaleY = img.height / scaledHeight;

  for (let y = 0; y < scaledHeight; y += pixelSize) {
    for (let x = 0; x < scaledWidth; x += pixelSize) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      const sampleWidth = Math.min(Math.ceil(pixelSize * scaleX), img.width - srcX);
      const sampleHeight = Math.min(Math.ceil(pixelSize * scaleY), img.height - srcY);

      const pixelData = hiddenCtx.getImageData(srcX, srcY, sampleWidth, sampleHeight).data;

      let red = 0;
      let green = 0;
      let blue = 0;
      let alpha = 0;
      const count = pixelData.length / 4;

      for (let i = 0; i < pixelData.length; i += 4) {
        red += pixelData[i];
        green += pixelData[i + 1];
        blue += pixelData[i + 2];
        alpha += pixelData[i + 3];
      }

      red = Math.round(red / count);
      green = Math.round(green / count);
      blue = Math.round(blue / count);
      alpha = Math.round((alpha / count / 255) * 100) / 100;

      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      ctx.fillRect(x, y, pixelSize, pixelSize);
    }
  }
}