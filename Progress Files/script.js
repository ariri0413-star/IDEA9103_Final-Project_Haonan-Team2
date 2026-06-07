const imagePath = 'nun.png';
const pixelSizes = [8, 10, 12, 16];
let img = new Image();
let canvas, ctx, hiddenCanvas, hiddenCtx, pixelSizeInput, pixelSizeLabel;

window.addEventListener('load', () => {
  canvas = document.getElementById('pixelCanvas');
  ctx = canvas.getContext('2d');

  hiddenCanvas = document.createElement('canvas');
  hiddenCtx = hiddenCanvas.getContext('2d');

  pixelSizeInput = document.getElementById('pixelSize');
  pixelSizeLabel = document.getElementById('pixelSizeValue');

  pixelSizeInput.addEventListener('input', () => {
    pixelSizeLabel.textContent = `${pixelSizeInput.value}px`;
    drawPixelArt(Number(pixelSizeInput.value));
  });

  img.onload = () => {
    resizeCanvas();
    drawPixelArt(Number(pixelSizeInput.value));
    document.getElementById('status').textContent = '图片已加载，正在渲染像素画风。';
  };

  img.onerror = () => {
    document.getElementById('status').textContent = '无法加载图片，请确认项目文件夹里有 nun.png。';
  };

  img.src = imagePath;
  window.addEventListener('resize', () => {
    resizeCanvas();
    drawPixelArt(Number(pixelSizeInput.value));
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
  const stepX = pixelSize;
  const stepY = pixelSize;

  ctx.clearRect(0, 0, scaledWidth, scaledHeight);
  ctx.imageSmoothingEnabled = false;

  const scaleX = img.width / scaledWidth;
  const scaleY = img.height / scaledHeight;

  for (let y = 0; y < scaledHeight; y += stepY) {
    for (let x = 0; x < scaledWidth; x += stepX) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);
      const sampleWidth = Math.min(Math.ceil(stepX * scaleX), img.width - srcX);
      const sampleHeight = Math.min(Math.ceil(stepY * scaleY), img.height - srcY);

      const pixelData = hiddenCtx.getImageData(srcX, srcY, sampleWidth, sampleHeight).data;
      let red = 0, green = 0, blue = 0, alpha = 0;
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
      alpha = Math.round(alpha / count / 255 * 100) / 100;

      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      ctx.fillRect(x, y, stepX, stepY);
    }
  }

  ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y <= scaledHeight; y += stepY) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(scaledWidth, y + 0.5);
    ctx.stroke();
  }
  for (let x = 0; x <= scaledWidth; x += stepX) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, scaledHeight);
    ctx.stroke();
  }

  document.getElementById('status').textContent = `当前像素块大小：${pixelSize}px`; 
}
