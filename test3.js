let img;

let bgMask = [];

function preload() {

  img = loadImage("image/nun2.png");

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  noSmooth();

  pixelDensity();

  img.loadPixels();

  createBackgroundMask();

}

function draw() {

  clear(); // Transparent background

  let pixelSize = 4; // Smaller = more detailed pixel style

  let displayH = height * 0.9;

  let displayW = displayH * (img.width / img.height);

  if (displayW > width * 0.9) {

    displayW = width * 0.9;

    displayH = displayW * (img.height / img.width);

  }

  let startX = width / 2 - displayW / 2;

  let startY = height / 2 - displayH / 2;

  for (let y = 0; y < displayH; y += pixelSize) {

    for (let x = 0; x < displayW; x += pixelSize) {

      let imgX = floor(map(x, 0, displayW, 0, img.width));

      let imgY = floor(map(y, 0, displayH, 0, img.height));

      let id = imgY * img.width + imgX;

      // Only remove background pixels connected to the image edge

      if (bgMask[id]) {

        continue;

      }

      let index = id * 4;

      let r = img.pixels[index];

      let g = img.pixels[index + 1];

      let b = img.pixels[index + 2];

      let a = img.pixels[index + 3];

      noStroke();

      fill(r, g, b, a);

      rect(startX + x, startY + y, pixelSize, pixelSize);

    }

  }

}

function createBackgroundMask() {

  let w = img.width;

  let h = img.height;

  bgMask = new Array(w * h).fill(false);

  let visited = new Array(w * h).fill(false);

  let queue = [];

  // Use the four corners as background starting points

  queue.push([0, 0]);

  queue.push([w - 1, 0]);

  queue.push([0, h - 1]);

  queue.push([w - 1, h - 1]);

  while (queue.length > 0) {

    let [x, y] = queue.shift();

    if (x < 0 || x >= w || y < 0 || y >= h) continue;

    let id = y * w + x;

    if (visited[id]) continue;

    visited[id] = true;

    if (isBackgroundPixel(x, y)) {

      bgMask[id] = true;

      queue.push([x + 1, y]);

      queue.push([x - 1, y]);

      queue.push([x, y + 1]);

      queue.push([x, y - 1]);

    }

  }

}

function isBackgroundPixel(x, y) {

  let index = (y * img.width + x) * 4;

  let r = img.pixels[index];

  let g = img.pixels[index + 1];

  let b = img.pixels[index + 2];

  // Background is light grey, but this only applies to connected edge areas

  let brightness = (r + g + b) / 3;

  let colorDifference = abs(r - g) + abs(g - b) + abs(r - b);

  return brightness > 120 && colorDifference < 55;

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}