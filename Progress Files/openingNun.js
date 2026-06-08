let img;

function preload() {

  img = loadImage("image/nun1.png");

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  noSmooth();

  pixelDensity(1);

}

function draw() {

  background(230);

  let pixelSize = 5; // Smaller = more detailed, larger = more pixelated

  let displayH = height * 0.88;

  let displayW = displayH * (img.width / img.height);

  if (displayW > width * 0.88) {

    displayW = width * 0.88;

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

      noStroke();

      fill(r, g, b, a);

      rect(startX + x, startY + y, pixelSize, pixelSize);

    }

  }

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}