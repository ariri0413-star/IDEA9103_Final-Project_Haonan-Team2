const imagePath = 'image/angel.png';
const PIXEL_SIZE = 4;

let img = new Image();
let canvas, ctx, hiddenCanvas, hiddenCtx;

window.addEventListener('load', () => {
  canvas = document.getElementById('pixelCanvas');

  if (!canvas) {
    console.error('找不到 canvas，请确认 HTML 里有 <canvas id="pixelCanvas"></canvas>');
    return;
  }

  ctx = canvas.getContext('2d');

  hiddenCanvas = document.createElement('canvas');
  hiddenCtx = hiddenCanvas.getContext('2d');

  img.onload = () => {
    resizeCanvas();
    drawPixelArt(PIXEL_SIZE);
  };

  img.onerror = () => {
    console.error('图片加载失败，请检查路径：', imagePath);
  };

  img.src = imagePath;

  window.addEventListener('resize', () => {
    resizeCanvas();
    drawPixelArt(PIXEL_SIZE);
  });
});

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawPixelArt(pixelSize) {
  if (!img.complete || img.naturalWidth === 0) return;

  hiddenCanvas.width = img.width;
  hiddenCanvas.height = img.height;
  hiddenCtx.drawImage(img, 0, 0, img.width, img.height);

  const imageAspect = img.width / img.height;
const canvasAspect = canvas.width / canvas.height;

let drawWidth, drawHeight;

if (canvasAspect > imageAspect) {
  drawHeight = canvas.height;
  drawWidth = drawHeight * imageAspect;
} else {
  drawWidth = canvas.width;
  drawHeight = drawWidth / imageAspect;
}

const offsetX = (canvas.width - drawWidth) / 2;
const offsetY = (canvas.height - drawHeight) / 2;

  ctx.clearRect(0, 0, drawWidth, drawHeight);
  ctx.imageSmoothingEnabled = false;

  const scaleX = img.width / drawWidth;
  const scaleY = img.height / drawHeight;

  for (let y = 0; y < drawHeight; y += pixelSize) {
    for (let x = 0; x < drawWidth; x += pixelSize) {
      const srcX = Math.floor(x * scaleX);
      const srcY = Math.floor(y * scaleY);

      const sampleWidth = Math.min(
        Math.ceil(pixelSize * scaleX),
        img.width - srcX
      );

      const sampleHeight = Math.min(
        Math.ceil(pixelSize * scaleY),
        img.height - srcY
      );

      const pixelData = hiddenCtx.getImageData(
        srcX,
        srcY,
        sampleWidth,
        sampleHeight
      ).data;

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
      ctx.fillRect(
  x + offsetX,
  y + offsetY,
  pixelSize,
  pixelSize
  );
    }
  }
}