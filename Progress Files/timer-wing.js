// background
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

// ─────────────────────────────────────────────

// wings animation
// colour palette for wings
const wingColour = {
  'n':  null,
  'w':  [255, 255, 255],
  'f1': [ 78,  78,  78],
  'f2': [130, 130, 130],
  's1': [ 34, 179, 254],
  's2': [132, 206, 255],
};

const wing = [
  [ 'n',  'n',  'n',  'n',  'n',  'n',  'f1', 'f1', 'f1', 'f1', 'n'  ], // row 1
  [ 'n',  'n',  'n',  'n',  'f1', 'f1', 'f1', 'w',  'w',  'w',  'f1' ], // row 2
  [ 'n',  'n',  'f1', 'f1', 'f1', 'w',  'w',  'w',  'w',  'w',  'f1' ], // row 3
  [ 'n',  'f1', 'w',  'w',  'w',  'w',  'w',  'w',  'w',  'f1', 'n'  ], // row 4
  [ 'f1', 'w',  'w',  'w',  'w',  'w',  'w',  'w',  'f1', 's1', 'n'  ], // row 5
  [ 'f1', 'w',  'w',  'w',  'f2', 'f2', 'w',  'w',  'w',  'f1', 'n'  ], // row 6
  [ 'f1', 'w',  'w',  'f2', 'w',  'w',  'f2', 'w',  'w',  'f1', 's2' ], // row 7
  [ 'f1', 'w',  'w',  'w',  'w',  'w',  'f2', 'w',  'w',  'f1', 's2' ], // row 8
  [ 's1', 'f1', 'w',  'w',  'w',  'f2', 'w',  'w',  'f1', 's2', 's2' ], // row 9
  [ 'n',  's2', 'f1', 'f2', 'f2', 'w',  'f1', 'f1', 's2', 'n',  'n'  ], // row 10
  [ 'n',  'n',  's1', 'f1', 'f1', 'f1', 's1', 's2', 'n',  'n',  'n'  ], // row 11
  [ 'n',  'n',  'n',  's2', 's2', 's2', 'n',  'n',  'n',  'n',  'n'  ], // row 12
];

const WNG_W = wing[0].length;
const WNG_H = wing.length; 

const REF_W = 21;
const REF_H = 52;

let wingList = [];

// ─────────────────────────────────────────────

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();       
  frameRate(60);
  colorMode(RGB);
  initWings();
}

// ─────────────────────────────────────────────

// initialise the wings: creates a group of wings and gives each wing a random starting position and flying phase.
function initWings() {
  wingList = [];
  const count = 10;

  for (let i = 0; i < count; i++) {
    const w = spawnWing();

    if (random() < 0.5) {
      w.phase = 'out';
      w.x = w.destX;
      w.y = w.destY;
    } else {
      const t = random();
      w.x = lerp(w.startX, w.destX, t);
      w.y = lerp(w.startY, w.destY, t);
    }

    wingList.push(w);
  }
}

// create one new wing: decides the wing's size, entry edge, destination position, exit position, and flying speed.
function spawnWing() {
  const ps = calcPixSize();
  const wPx = WNG_W * ps;
  const hPx = WNG_H * ps;

  const edge = floor(random(4));

  const destX = random(width * 0.1, width * 0.9 - wPx);
  const destY = random(height * 0.1, height * 0.9 - hPx);

  let startX, startY;

  // set the wing's starting position based on the chosen screen edge
  if (edge === 0) {
    startX = destX;
    startY = -hPx; // start above the screen
  } else if (edge === 1) {
    startX = destX;
    startY = height; // start below the screen
  } else if (edge === 2) {
    startX = -wPx; // start from the left side
    startY = destY;
  } else {
    startX = width; // start from the right side
    startY = destY;
  }

  let exitX, exitY;

  // set the exit position on the opposite side of the screen
  if (edge === 0) {
    exitX = destX;
    exitY = height; // exit from the bottom
  } else if (edge === 1) {
    exitX = destX;
    exitY = -hPx; // exit from the top
  } else if (edge === 2) {
    exitX = width; // exit from the right side
    exitY = destY;
  } else {
    exitX = -wPx; // exit from the left side
    exitY = destY;
  }

  // give each wing a random flying speed
  const flySpeed = random(4, 10);

  return {
    x: startX,
    y: startY,
    startX,
    startY,
    destX,
    destY,
    exitX,
    exitY,
    flySpeed,
    phase: 'in',
  };
}

// keeps the wing size proportional to the screen size
function calcPixSize() {
  const marginX = width * 0.03;
  const marginY = height * 0.04;
  const availW = width - marginX * 2;
  const availH = height - marginY * 2;
  const cellW = availW / 3;
  const winW = cellW * 0.78;
  const winH = availH * 0.90;

  return min(winW / REF_W, winH / REF_H);
}

function drawWing(x, y, ps) {
  const x0 = floor(x);
  const y0 = floor(y);

  noStroke();

  for (let r = 0; r < WNG_H; r++) {
    for (let c = 0; c < WNG_W; c++) {
      const col = wingColour[wing[r][c]];

      if (!col) continue;

      fill(col[0], col[1], col[2]);
      rect(x0 + c * ps, y0 + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

// move the wing from its current position toward a target position
function moveToward(x, y, tx, ty, speed) {
  const dx = tx - x;
  const dy = ty - y;
  const dist = sqrt(dx * dx + dy * dy);

  if (dist <= speed) {
    return {
      x: tx,
      y: ty,
      arrived: true,
    };
  }

  return {
    x: x + dx / dist * speed,
    y: y + dy / dist * speed,
    arrived: false,
  };
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

  // draw flying wings
  const ps = calcPixSize();

  for (let w of wingList) {
    if (w.phase === 'in') {
      const res = moveToward(w.x, w.y, w.destX, w.destY, w.flySpeed);

      w.x = res.x;
      w.y = res.y;

      if (res.arrived) {
        w.phase = 'out';
      }
    } else if (w.phase === 'out') {
      const res = moveToward(w.x, w.y, w.exitX, w.exitY, w.flySpeed);

      w.x = res.x;
      w.y = res.y;

      if (res.arrived) {
        const fresh = spawnWing();
        Object.assign(w, fresh);
      }
    }

    drawWing(w.x, w.y, ps);
  }

  // update the rotation angle each frame
  angle += 0.007;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initWings();
}