let img;

function preload() {

  img = loadImage("image/nun.png");

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  noSmooth();

  pixelDensity(1);

}

function draw() {

  clear(); 

  // If you want to see the transparent area while testing, use:

  // background(230);

  let pixelSize = 6; // Smaller number = finer pixel style

  let displayH = height * 0.85;

  let displayW = displayH * (img.width / img.height);

  if (displayW > width * 0.85) {

    displayW = width * 0.85;

    displayH = displayW * (img.height / img.width);

  }

  let startX = width / 2 - displayW / 2;

  let startY = height / 2 - displayH / 2;

  img.loadPixels();

  for (let y = 0; y < displayH; y += pixelSize) {

    for (let x = 0; x < displayW; x += pixelSize) {

      let imgX = floor(map(x, 0, displayW, 0, img.width));

      let imgY = floor(map(y, 0, displayH, 0, img.height));

      let index = (imgY * img.width + imgX) * 4;

      let r = img.pixels[index];

      let g = img.pixels[index + 1];

      let b = img.pixels[index + 2];

      let a = img.pixels[index + 3];

      // Remove very light background

      if (r > 190 && g > 190 && b > 190) {

        continue;

      }

      noStroke();

      fill(r, g, b, a);

      rect(startX + x, startY + y, pixelSize, pixelSize);

    }

  }

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}