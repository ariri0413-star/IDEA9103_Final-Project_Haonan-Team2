// light of heaven
let angle = 0;
const NUM_RAYS = 24;
const PIXEL_SIZE = 6;

const BLUE_TONES = [
  [246, 253, 255],
  [223, 243, 255],
  [204, 255, 255],
  [198, 240, 255],
];

const YELLOW_TONES = [
  [255, 252, 220],
  [255, 255, 255],
  [255, 252, 195],
  [255, 252, 233],
];


function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();       
  frameRate(60);
  colorMode(RGB);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(255);

  let cx = width / 2;
  let cy = height / 2;

  // draw pixel blocks
  for (let py = 0; py < height; py += PIXEL_SIZE) {
    for (let px = 0; px < width; px += PIXEL_SIZE) {

      let dx = px + PIXEL_SIZE / 2 - cx;
      let dy = py + PIXEL_SIZE / 2 - cy;
      let dist = sqrt(dx * dx + dy * dy);

      // calculate the angle and subtract the current rotation offset
      let a = (atan2(dy, dx) - angle + TWO_PI * 10) % TWO_PI;

      // determine which ray the block falls on
      let rayIndex = floor(a / TWO_PI * NUM_RAYS);
      let isEven = rayIndex % 2 === 0;

      let c;
      if (isEven) {
        // even rays: sky blue tones
        let tone = BLUE_TONES[floor(rayIndex / 2) % BLUE_TONES.length];
        let bright = map(dist, 0, max(width, height) / 2, 1.05, 0.88);
        c = color(tone[0] * bright, tone[1] * bright, tone[2] * bright);
      } else {
        // odd rays: warm yellow tones
        let tone = YELLOW_TONES[floor(rayIndex / 2) % YELLOW_TONES.length];
        let bright = map(dist, 0, max(width, height) / 2, 1.05, 0.85);
        c = color(tone[0] * bright, tone[1] * bright, tone[2]);
      }

      fill(c);
      noStroke();
      rect(px, py, PIXEL_SIZE, PIXEL_SIZE);
    }
  }

  // soft white glow at the center
  for (let r = 60; r > 0; r -= 4) {
    let alpha = map(r, 0, 60, 255, 0);
    fill(255, 255, 255, alpha);
    noStroke();
    ellipse(cx, cy, r, r);
  }

  // update the rotation angle each frame
  angle += 0.007;
}