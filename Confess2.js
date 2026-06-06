
let Confess2Timer = 0;

// confess scene 2: light of heaven
let Confess2sceneTransitionAlpha = 255;

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

// ————————————————————————————————————————————————
// clour plalette for goodCross
const goodCrossClour ={
  'n': null,
  'p1': [254, 129, 184],
  'p2': [253, 203, 243],
  'p3': [255, 158, 211],
  'w1': [244, 255, 255],
}

const goodCross = [
  ['n','n','n','p1','n','n','n'],
  ['n','n','n','p1','n','n','n'],
  ['n','n','n','p1','n','n','n'],
  ['n','n','p1','w1','p3','n','n'],
  ['p1','p1','w1','p2','p2','p3','p3'],
  ['n','n','p3','p2','p3','n','n'],
  ['n','n','n','p3','n','n','n'],
  ['n','n','n','p3','n','n','n'],
  ['n','n','n','p3','n','n','n'],
];

const GCW = goodCross[0].length;
const GCH = goodCross.length;

// ─────────────────────────────────────────────
// colour palette for heart
const heartColour = {
  'n': null,
  'y1': [252, 218, 123],
  'y2': [254, 182, 5],
  'y3': [248, 168, 18],
  'r1': [250, 5, 6],
  'r2': [252, 124, 124],
  'r3': [253, 197, 200],
  'r4': [254, 118, 119],
  'r5': [255, 22, 21],
  'r6': [197, 6, 6],
};

const heart = [
  ['n','n','n','y1','y2','y3','n','n','n'],
  ['n','n','n','n','n','n','n','n','n'],
  ['n','r1','r1','n','n','n','r1','r6','n'],
  ['r1','r2','r2','r1','n','r1','r1','r1','r6'],
  ['r1','r2','r3','r3','r1','r1','r1','r1','r6'],
  ['n','r1','r3','r4','r1','r1','r1','r6','n'],
  ['n','n','r1','r1','r1','r1','r6','n','n'],
  ['n','n','n','r1','r1','r6','n','n','n'],
  ['n','n','n','n','r6','n','n','n','n'],
];

const HW = heart[0].length;
const HH = heart.length;

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

function drawHeart(x, y, ps, mirror) {
  noStroke();

  for (let r = 0; r < HH; r++) {
    for (let c = 0; c < HW; c++) {

      let col = c;

      if (mirror) {
        col = HW - 1 - c;
      }

      let key = heart[r][col];
      let colour = heartColour[key];

      if (!colour) continue;

      fill(colour[0], colour[1], colour[2]);
      rect(x + c * ps, y + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function drawGoodCross(x, y, ps, mirror) {
  noStroke();

  for (let r = 0; r < GCH; r++) {
    for (let c = 0; c < GCW; c++) {

      let col = c;

      if (mirror) {
        col = GCW - 1 - c;
      }

      let key = goodCross[r][col];
      let colour = goodCrossClour[key];

      if (!colour) continue;

      fill(colour[0], colour[1], colour[2]);
      rect(x + c * ps, y + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function drawWing(x, y, ps) {
  const x0 = floor(x);
  const y0 = floor(y);

  noStroke();

  for (let r = 0; r < WNG_H; r++) {
    for (let c = 0; c < WNG_W; c++) {
      const col = wingColour[wing[r][c]];

      if (!col) continue;

      fill(col[0], col[1], col[2], 200);
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

function drawConfess2() {
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

  let rms = analyser.getLevel();
  let heartMove = rms * 200;
  let crossMove = rms * 200;

  let heartSize = ps;

  let leftHeartX = width * 0.04;
  // Chatgpt helped calculate the right heart's x position so that it would be perfectly symmetrical to the left one
  let rightHeartX = width - leftHeartX - HW * heartSize;

  let heartY = height * 0.45 - heartMove;

  drawHeart(leftHeartX, heartY, heartSize, false);
  drawHeart(rightHeartX, heartY, heartSize, true);

  // ——————————————————————————————————————————————————

  let goodCrossSize = ps;

  // left heart position
  let leftCrossX = leftHeartX;
  let leftCrossY = heartY;

  // right heart position
  let rightCrossX = rightHeartX;
  let rightCrossY = heartY;

  // left side: upper-left of heart
  drawGoodCross(
    leftCrossX - GCW * goodCrossSize * 0.4,
    leftCrossY - GCH * goodCrossSize * 1.5 - crossMove,
    goodCrossSize,
    false
  );

  // left side: lower-right of heart
  drawGoodCross(
    leftCrossX + HW * heartSize * 0.4,
    leftCrossY + HH * heartSize * 1.5 - crossMove,
    goodCrossSize,
    false
  );

  // right side: upper-right of heart, mirrored
  drawGoodCross(
    rightCrossX + HW * heartSize * 0.4,
    rightCrossY - GCH * goodCrossSize * 1.5 - crossMove,
    goodCrossSize,
    true
  );

  // right side: lower-left of heart, mirrored
  drawGoodCross(
    rightCrossX - GCW * goodCrossSize * 0.4,
    rightCrossY + HH * heartSize * 1.5 - crossMove,
    goodCrossSize,
    true
  );

  // ——————————————————————————————————————————————————

  // update the rotation angle each frame
  angle += 0.007;

  // ——————————————————————————————————————————————————
  // nun image

  let nunPixelSize = ps * 0.6;

  let displayH = height * 0.88;

  let displayW =
    displayH * (goodNun.width / goodNun.height);

  if (displayW > width * 0.88) {

    displayW = width * 0.88;

    displayH =
      displayW * (goodNun.height / goodNun.width);

  }

  // change size or keep
  displayW *= 1.1 ;
  displayH *= 1.1;

  // center position
  let startX = width / 2 - displayW / 2;

  let startY = height - displayH;

  for (
    let y = 0;
    y < displayH;
    y += nunPixelSize
  ) {

    for (
      let x = 0;
      x < displayW;
      x += nunPixelSize
    ) {

      let goodNunX = floor(
        map(x, 0, displayW, 0, goodNun.width)
      );

      let goodNunY = floor(
        map(y, 0, displayH, 0, goodNun.height)
      );

      let index =
        (goodNunY * goodNun.width + goodNunX) * 4;

      let r = goodNun.pixels[index];

      let g = goodNun.pixels[index + 1];

      let b = goodNun.pixels[index + 2];

      let a = goodNun.pixels[index + 3];

      if (a < 10) continue;

      noStroke();

      // ChatGPT helped calculate the proper glowing formula
      // soft breathing glow animation
      let glowAlpha = 220 + sin(frameCount * 0.04) * 40;
      // extra brightness from music volume
      let musicGlow = rms * 80;
      // final alpha value for nun glow
      let nunAlpha = glowAlpha + musicGlow;
      // draw nun pixels with glowing transparency
      fill(r, g, b, min(a, nunAlpha));

      rect(
        startX + x,
        startY + y,
        nunPixelSize,
        nunPixelSize
      );

    }

  }

  // scene transition overlay

  if (Confess2sceneTransitionAlpha > 0) {

    noStroke();

    fill(
      250,
      223,
      210,
      Confess2sceneTransitionAlpha
    );

    rect(
      0,
      0,
      width,
      height
    );

    Confess2sceneTransitionAlpha -= 3; // 1.5 seconds fade out

  }

  Confess2Timer++;

  if (Confess2Timer > 300) {
  Confess2Timer = 0;
  scene = "main";
  hasChosen = false;
  }
}


function playPause() {
  if (openingSong.isPlaying()) {
    openingSong.pause();
    playButton.html("Play");
  } else {
    openingSong.loop();
    playButton.html("Pause");
  }
}