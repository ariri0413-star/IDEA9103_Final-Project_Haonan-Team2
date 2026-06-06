// opening scene: church

let crosses = [];

let openingSong;
let badSong;
let goodSong;

let analyser;
let playButton;
let openingNun;

// Perlin noise overlay
let flowLayer;
let particles = [];
let flowField = [];

let ffCols, ffRows;
let overlayAlpha = 0;

let gridSize = 10;
let perlinCols, perlinRows;

let zoff = 0;
let zstep = 0.3;

let psNums = 6000;
let maxSpeed = 12;

// ─────────────────────────────────────────────
// stained glass

const glassColour = {
  'n': null,
  'wf': [33, 31, 44],
  'b1': [41, 60, 171],
  'b2': [45, 103, 168],
  'b3': [143, 214, 240],
};

const glass = [
  ['n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n'],
  ['n','n','n','n','n','n','n','n','n','n','wf','n','n','n','n','n','n','n','n','n','n'],
  ['n','n','n','n','n','n','n','n','wf','wf','wf','wf','wf','n','n','n','n','n','n','n','n'],
  ['n','n','n','n','n','n','n','wf','wf','wf','wf','wf','wf','wf','n','n','n','n','n','n','n'],
  ['n','n','n','n','n','n','wf','wf','wf','wf','b1','wf','wf','wf','wf','n','n','n','n','n','n'],
  ['n','n','n','n','n','wf','wf','wf','wf','b3','b1','b2','wf','wf','wf','wf','n','n','n','n','n'],
  ['n','n','n','n','n','wf','wf','wf','b1','b3','b1','b2','b1','wf','wf','wf','n','n','n','n','n'],
  ['n','n','n','n','wf','wf','b2','wf','wf','b2','b2','b3','wf','wf','b1','wf','wf','n','n','n','n'],
  ['n','n','n','n','wf','wf','wf','wf','wf','wf','b2','wf','wf','wf','wf','wf','wf','n','n','n','n'],
  ['n','n','n','wf','wf','wf','b3','wf','wf','wf','wf','wf','wf','b2','wf','wf','wf','wf','n','n','n'],
  ['n','n','n','wf','wf','b2','b3','b2','wf','wf','b3','wf','wf','b1','b1','b2','wf','wf','n','n','n'],
  ['n','n','wf','wf','wf','b1','b1','b3','b3','wf','b1','wf','b2','b3','b3','b2','wf','wf','wf','n','n'],
  ['n','n','wf','wf','wf','wf','b1','wf','wf','wf','wf','wf','wf','wf','b3','wf','wf','wf','wf','n','n'],
  ['n','n','wf','b3','wf','wf','wf','wf','wf','wf','b1','wf','wf','wf','wf','wf','wf','b1','wf','n','n'],
  ['n','wf','wf','wf','wf','wf','wf','wf','wf','b3','b2','b2','wf','wf','wf','wf','wf','wf','wf','wf','n'],
  ['n','wf','wf','wf','b1','b2','wf','wf','wf','b3','b1','b2','wf','wf','wf','b3','b2','wf','wf','wf','n'],
  ['n','wf','wf','b3','b3','b1','b2','wf','b2','b3','b2','b2','b1','wf','b3','b3','b1','b1','wf','wf','n'],
  ['n','wf','wf','b2','b2','b2','b1','wf','b1','b2','b1','b2','b2','wf','b3','b3','b3','b1','wf','wf','n'],
  ['n','wf','wf','b1','b3','b3','b3','wf','b2','b1','b3','b1','b1','wf','b3','b1','b1','b2','wf','wf','n'],
  ['n','wf','wf','b1','b1','b3','b3','wf','b1','b1','b3','b1','b1','wf','b1','b3','b1','b2','wf','wf','n'],
  ['n','wf','wf','b1','b1','b2','b3','wf','b1','b3','b3','b3','b3','wf','b1','b1','b1','b3','wf','wf','n'],
  ['n','wf','wf','b2','b2','b2','b1','wf','b1','b3','b1','b3','b3','wf','b3','b3','b1','b3','wf','wf','n'],
  ['n','wf','wf','b3','b1','b2','b2','wf','b1','b2','b2','b3','b2','wf','b1','b3','b3','b3','wf','wf','n'],
  ['n','wf','wf','b3','b3','b1','b1','wf','b2','b2','b1','b3','b2','wf','b1','b2','b1','b3','wf','wf','n'],
  ['n','wf','wf','b3','b3','b2','b1','wf','b2','b3','b2','b2','b1','wf','b2','b2','b3','b2','wf','wf','n'],
  ['n','wf','wf','b2','b2','b1','b3','wf','b1','b1','b1','b2','b2','wf','b2','b3','b2','b2','wf','wf','n'],
  ['n','wf','wf','b2','b2','b2','b1','wf','b3','b1','b1','b2','b2','wf','b3','b3','b2','b1','wf','wf','n'],
  ['n','wf','wf','b1','b1','b2','b3','wf','b2','b1','b2','b2','b2','wf','b2','b1','b1','b3','wf','wf','n'],
  ['n','wf','wf','b3','b1','b2','b3','wf','b2','b3','b1','b1','b2','wf','b1','b1','b1','b3','wf','wf','n'],
  ['n','wf','wf','b1','b3','b2','b2','wf','b2','b2','b2','b1','b1','wf','b2','b2','b1','b3','wf','wf','n'],
  ['n','wf','wf','b3','b3','b3','b3','wf','b2','b3','b3','b2','b2','wf','b1','b2','b3','b3','wf','wf','n'],
  ['n','wf','wf','b2','b3','b1','b3','wf','b2','b2','b1','b2','b3','wf','b2','b2','b2','b1','wf','wf','n'],
  ['n','wf','wf','b1','b1','b2','b3','wf','b3','b2','b2','b2','b2','wf','b1','b2','b3','b2','wf','wf','n'],
  ['n','wf','wf','b1','b1','b3','b2','wf','b2','b3','b3','b2','b2','wf','b1','b3','b3','b3','wf','wf','n'],
  ['n','wf','wf','b2','b2','b3','b3','wf','b2','b2','b1','b2','b2','wf','b3','b3','b3','b3','wf','wf','n'],
  ['n','wf','wf','b1','b1','b2','b2','wf','b1','b3','b3','b1','b2','wf','b3','b1','b2','b1','wf','wf','n'],
  ['n','wf','wf','b2','b2','b1','b2','wf','b1','b1','b3','b3','b3','wf','b1','b2','b1','b1','wf','wf','n'],
  ['n','wf','wf','b2','b3','b2','b1','wf','b1','b1','b3','b3','b2','wf','b1','b2','b1','b3','wf','wf','n'],
  ['n','wf','wf','b2','b2','b2','b1','wf','b1','b1','b1','b1','b1','wf','b3','b2','b3','b1','wf','wf','n'],
  ['n','wf','wf','b3','b3','b1','b1','wf','b3','b1','b3','b2','b2','wf','b1','b2','b3','b1','wf','wf','n'],
  ['n','wf','wf','b3','b2','b3','b1','wf','b2','b2','b2','b1','b3','wf','b2','b3','b3','b3','wf','wf','n'],
  ['n','wf','wf','b1','b2','b3','b3','wf','b1','b3','b1','b1','b1','wf','b1','b1','b1','b3','wf','wf','n'],
  ['n','wf','wf','b1','wf','b3','b3','wf','b2','b3','b3','b1','b3','wf','b1','b1','wf','b1','wf','wf','n'],
  ['n','wf','wf','b1','wf','wf','b3','wf','b3','b3','b2','b3','b3','wf','b2','wf','wf','b1','wf','wf','n'],
  ['n','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','n'],
  ['n','wf','wf','wf','wf','wf','wf','wf','wf','wf','b3','wf','wf','wf','wf','wf','wf','wf','wf','wf','n'],
  ['n','wf','wf','b3','wf','b1','wf','wf','wf','b3','b2','b3','wf','wf','wf','b1','wf','b3','wf','wf','n'],
  ['n','wf','wf','wf','b1','wf','wf','wf','b3','b1','b2','b1','b3','wf','wf','wf','b1','wf','wf','wf','n'],
  ['n','wf','wf','b2','wf','b3','wf','wf','wf','b3','b2','b3','wf','wf','wf','b3','wf','b2','wf','wf','n'],
  ['n','wf','wf','wf','wf','wf','wf','wf','wf','wf','b3','wf','wf','wf','wf','wf','wf','wf','wf','wf','n'],
  ['n','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','wf','n'],
  ['n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n'],
];

const PW = glass[0].length;
const PH = glass.length;
const WINDOW_COLS = 3;

// candles
const candlesColour = {
  'n': null,
  'cw': [88, 88, 88],
  'f0': [252, 240, 158],
  'f1': [252, 223, 37],
  'f2': [247, 197, 0],
  'f3': [251, 147, 2],
  'g1': [234, 234, 234],
  'g2': [224, 217, 219],
  'g3': [181, 164, 167],
  'g4': [169, 143, 146],
  'g5': [161, 130, 135],
  'g6': [131, 97, 102],
  'b1': [254, 254, 204],
  'b2': [255, 238, 161],
  'b3': [245, 195, 4],
  'b4': [247, 158, 35],
  'h1': [247, 158, 35],
  'h2': [173, 111, 0],
  'h3': [164, 101, 0],
  'h4': [119, 71, 3],
  'h5': [80, 58, 1],
  'h6': [62, 43, 1],
  'h7': [36, 22, 0],
};

const candles = [
  ['n','n','n','n','n','f2','n','n','n','n','n','n','n','n','n','n','n'],
  ['n','n','n','n','f2','f1','f2','n','n','n','n','n','n','n','n','n','n'],
  ['n','n','n','n','f3','f1','f2','n','n','n','n','f2','n','n','n','n','n'],
  ['n','n','n','n','f3','f0','f3','n','n','n','f2','f1','f2','n','n','n','n'],
  ['n','n','n','n','n','cw','n','n','n','n','f3','f1','f2','n','n','n','n'],
  ['n','n','n','g1','g1','g2','g2','g2','n','n','f3','f0','f3','n','n','n','n'],
  ['n','n','g1','g2','g6','g1','g2','g6','g2','n','n','cw','n','n','n','n','n'],
  ['n','n','g2','g2','g6','g1','g6','g6','b1','b1','b1','b2','b2','b2','b2','n','n'],
  ['n','n','g2','g6','g5','g1','g6','b1','b1','b2','b2','b2','b4','b1','b2','b2','n'],
  ['n','n','g2','g4','g4','g5','g6','b1','b2','b3','b3','b3','b4','b4','b1','b2','n'],
  ['n','n','g2','g3','g4','g5','g6','b2','b3','b2','b2','b3','b3','b4','b4','b1','n'],
  ['n','n','n','g3','g4','g5','g6','g6','b3','b1','b2','b3','b3','b4','b4','b1','n'],
  ['n','n','n','g3','g4','g5','g6','g6','b3','b1','b2','b3','b3','b4','b4','n','n'],
  ['n','n','n','g3','g4','g5','g6','g6','b3','b1','b2','b3','b3','b4','b4','n','n'],
  ['n','n','g2','g3','g4','g5','g6','b1','b3','b2','b3','b3','b3','b4','b4','b2','n'],
  ['n','g2','g2','g3','g4','g5','g6','b2','b3','b3','b3','b3','b3','b4','b1','b1','b2'],
  ['h4','h2','h1','h1','h1','h1','h2','h1','h2','h3','h3','h3','h3','h4','h4','h3','h4'],
  ['n','h5','h5','h5','h5','h5','h6','h6','h6','h6','h6','h7','h7','h7','h7','h7','n'],
  ['n','h2','h2','h2','h2','h2','h3','h3','h3','h3','h3','h4','h4','h4','h4','h4','n'],
];

const CW = candles[0].length;
const CH = candles.length;

// spiderweb
const webColour = {
  'n': null,
  'w': [220, 220, 220],
};

const web = [
  ['w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w','w'],
  ['w','w','n','w','w','n','n','w','n','n','w','n','n','w','n','n','n'],
  ['w','n','w','n','w','w','w','n','n','w','n','n','w','n','n','n','n'],
  ['w','w','n','w','n','n','n','w','w','w','n','n','n','w','n','n','n'],
  ['w','n','w','n','w','w','n','w','n','n','w','w','n','w','n','n','n'],
  ['w','n','n','w','n','w','w','n','n','n','w','n','w','w','w','n','n'],
  ['w','n','w','w','n','n','w','w','n','w','n','n','n','n','w','w','n'],
  ['w','w','n','n','w','w','n','n','w','w','n','n','n','w','n','n','n'],
  ['w','n','n','n','w','n','n','n','n','w','n','n','w','n','n','n','n'],
  ['w','n','w','n','w','n','n','w','w','n','w','n','w','n','n','n','n'],
  ['w','w','n','w','w','n','w','n','n','n','w','w','n','n','n','n','n'],
  ['w','n','n','n','n','w','n','n','n','w','n','w','n','n','n','n','n'],
  ['w','n','n','w','n','n','w','n','w','n','n','n','w','n','n','n','n'],
  ['w','n','w','n','w','n','n','w','n','n','n','n','n','w','n','n','n'],
  ['w','w','n','n','n','w','w','n','n','n','n','n','n','n','n','n','n'],
  ['w','n','n','n','n','n','n','w','n','n','n','n','n','n','n','n','n'],
  ['w','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n'],
];

const WW = web[0].length;
const WH = web.length;

// spider
const spiderColour = {
  'n': null,
  'w': [220, 220, 220],
  's': [40, 25, 98],
  'e': [176, 12, 12],
};

const spider = [
  ['n','n','n','n','n','w','n','n','n','n','n'],
  ['n','n','n','n','n','w','n','n','n','n','n'],
  ['n','n','n','n','n','w','n','n','n','n','n'],
  ['n','n','n','n','n','w','n','n','n','n','n'],
  ['n','s','s','n','n','w','n','n','s','s','n'],
  ['n','n','n','s','n','w','n','s','n','n','n'],
  ['n','s','s','s','s','s','s','s','s','s','n'],
  ['s','n','n','s','e','s','e','s','n','n','s'],
  ['n','n','s','n','s','n','s','n','s','n','n'],
  ['n','s','n','n','s','n','s','n','n','s','n'],
  ['n','s','n','n','n','n','n','n','n','s','n'],
];

const SW = spider[0].length;
const SH = spider.length;

// ─────────────────────────────────────────────

function preload() {
  openingSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  badSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  goodSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  openingNun = loadImage("image/nun1.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noSmooth();
  initCrosses();

  analyser = new p5.Amplitude();
  analyser.setInput(openingSong);

  playButton = createButton("Play/Pause");
  playButton.position(width * 0.02, height * 0.03);
  playButton.mousePressed(playPause);

  initFlowLayer();   // ←新增
}


function initCrosses() {
  crosses = [];
  const count = 18;

  for (let i = 0; i < count; i++) {
    crosses.push({
      x: random(width),
      y: random(height),
      alpha: 0,
      state: 'fadeIn',
      holdTimer: floor(random(40, 120)),
      holdAge: 0,
      fadeSpeed: random(3, 8),
    });
  }
}

function drawCrosses(ps) {
  noStroke();

  for (let cross of crosses) {
    if (cross.state === 'fadeIn') {
      cross.alpha += cross.fadeSpeed;
      if (cross.alpha >= 255) {
        cross.alpha = 255;
        cross.state = 'hold';
        cross.holdAge = 0;
      }
    } else if (cross.state === 'hold') {
      cross.holdAge++;
      if (cross.holdAge >= cross.holdTimer) {
        cross.state = 'fadeOut';
      }
    } else if (cross.state === 'fadeOut') {
      cross.alpha -= cross.fadeSpeed;
      if (cross.alpha <= 0) {
        cross.alpha = 0;
        cross.state = 'move';
      }
    } else if (cross.state === 'move') {
      cross.x = random(width);
      cross.y = random(height);
      cross.holdTimer = floor(random(40, 120));
      cross.fadeSpeed = random(3, 8);
      cross.state = 'fadeIn';
    }

    if (cross.alpha <= 0) continue;

    const x = floor(cross.x);
    const y = floor(cross.y);

    fill(220, 220, 220, cross.alpha);
    rect(x, y - ps, ps, ps * 4);
    rect(x - ps, y, ps * 3, ps);
  }
}

function drawCandleGroup(cx, baseY, ps, mirror) {
  const x0 = floor(cx - (CW / 2) * ps);
  const y0 = floor(baseY - CH * ps);

  noStroke();

  for (let r = 0; r < CH; r++) {
    for (let c = 0; c < CW; c++) {
      const col = mirror ? CW - 1 - c : c;
      const colour = candlesColour[candles[r][col]];

      if (!colour) continue;

      fill(colour[0], colour[1], colour[2]);
      rect(x0 + c * ps, y0 + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function drawSpark(cx, baseY, ps, candleCol, bottomOffset, smallJump, bigJump, mirror) {
  let x0 = floor(cx - (CW / 2) * ps);
  let col = mirror ? CW - 1 - candleCol : candleCol;
  let x = x0 + col * ps;
  let bottomY = baseY - bottomOffset * ps;

  rect(x, bottomY - smallJump, ps, ps);
  rect(x, bottomY - ps - smallJump, ps, ps);
  rect(x, bottomY - 3 * ps - bigJump, ps, ps);
}

function drawHalo(cx, baseY, ps, candleCol, bottomOffset, haloSize, mirror) {
  let x0 = floor(cx - (CW / 2) * ps);
  let col = mirror ? CW - 1 - candleCol : candleCol;

  let centerX = floor(x0 + col * ps + ps / 2);
  let centerY = floor(baseY - bottomOffset * ps - ps * 1.5);

  let block = ps;

  noStroke();

  for (let y = -5; y <= 5; y++) {
    for (let x = -5; x <= 5; x++) {
      let d = sqrt(x * x + y * y);

      if (d < haloSize * 0.55) {
        fill(252, 223, 37, 45);
        rect(centerX + x * block, centerY + y * block, block, block);
      }
    }
  }
}

function drawWeb(ps) {
  noStroke();

  for (let r = 0; r < WH; r++) {
    for (let c = 0; c < WW; c++) {
      const colour = webColour[web[r][c]];

      if (!colour) continue;

      fill(colour[0], colour[1], colour[2]);
      rect(c * ps, r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function drawSpider(ps, cw, offsetY) {
  const x0 = cw - SW * ps;

  noStroke();

  for (let r = 0; r < SH; r++) {
    for (let c = 0; c < SW; c++) {
      const colour = spiderColour[spider[r][c]];

      if (!colour) continue;

      fill(colour[0], colour[1], colour[2]);
      rect(x0 + c * ps, offsetY + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function draw() {
  let rms = analyser.getLevel();
  let smallJump = rms * 80;
  let bigJump = rms * 160;

  const cw = width;
  const ch = height;

  background(12, 10, 22);

  const marginX = cw * 0.03;
  const marginY = ch * 0.04;
  const availW = cw - marginX * 2;
  const availH = ch - marginY * 2;
  const cellW = availW / WINDOW_COLS;

  const winW = cellW * 0.78;
  const winH = availH * 0.90;
  const pixSize = min(winW / PW, winH / PH);
  const actualW = pixSize * PW;
  const actualH = pixSize * PH;
  const cy = marginY + availH / 2;

  for (let col = 0; col < WINDOW_COLS; col++) {
    const cx = marginX + col * cellW + cellW / 2;
    const startX = floor(cx - actualW / 2);
    const startY = floor(cy - actualH / 2);

    noStroke();

    for (let py = 0; py < PH; py++) {
      for (let px = 0; px < PW; px++) {
        const key = glass[py][px];
        const colour = glassColour[key];

        if (!colour) continue;

        fill(colour[0], colour[1], colour[2]);
        rect(
          startX + px * pixSize,
          startY + py * pixSize,
          pixSize + 0.5,
          pixSize + 0.5
        );
      }
    }
  }

  const candleBaseY = cy + actualH / 2 + pixSize * 5;

  let leftCandleX = marginX + cellW * 0.131;
  let rightCandleX = marginX + cellW * 2.869;

  let haloSize = 4.2 + rms * 30;

  drawHalo(leftCandleX, candleBaseY, pixSize, 4.5, 18, haloSize, false);
  drawHalo(leftCandleX, candleBaseY, pixSize, 10.5, 17, haloSize * 0.8, false);

  drawHalo(rightCandleX, candleBaseY, pixSize, 5.5, 18, haloSize, true);
  drawHalo(rightCandleX, candleBaseY, pixSize, 11.5, 17, haloSize * 0.8, true);

  drawCandleGroup(leftCandleX, candleBaseY, pixSize, false);
  drawCandleGroup(rightCandleX, candleBaseY, pixSize, true);

  fill(252, 223, 37);

  drawSpark(leftCandleX, candleBaseY, pixSize, 5, 18, smallJump, bigJump, false);
  drawSpark(leftCandleX, candleBaseY, pixSize, 11, 16, smallJump, bigJump, false);

  drawSpark(rightCandleX, candleBaseY, pixSize, 5, 18, smallJump, bigJump, true);
  drawSpark(rightCandleX, candleBaseY, pixSize, 11, 16, smallJump, bigJump, true);

  drawWeb(pixSize);

  const maxThread = 18;
  const cycleDur = 180;
  const halfCycle = cycleDur / 2;
  const t = frameCount % cycleDur;

  const threadLen = t < halfCycle
    ? map(t, 0, halfCycle, 0, maxThread)
    : map(t, halfCycle, cycleDur, maxThread, 0);

  const threadLenInt = floor(threadLen);

  const spiderThreadX = cw - floor(SW / 2) * pixSize - pixSize;
  const threadTopY = 0;
  const spiderOffsetY = threadLenInt * pixSize;

  noStroke();
  fill(220, 220, 220);

  for (let i = 0; i < threadLenInt; i++) {
    rect(
      spiderThreadX,
      threadTopY + i * pixSize,
      pixSize + 0.5,
      pixSize + 0.5
    );
  }

  drawSpider(pixSize, cw, spiderOffsetY);
  drawCrosses(pixSize);

  let nunPixelSize = pixSize * 0.6;

  let displayH = height * 0.88;
  let displayW = displayH * (openingNun.width / openingNun.height);

  if (displayW > width * 0.88) {
    displayW = width * 0.88;
    displayH = displayW * (openingNun.height / openingNun.width);
  }

  displayW *= 1.1;
  displayH *= 1.1;

  let startX = width / 2 - displayW / 2;
  let startY = height - displayH;

  openingNun.loadPixels();

  for (let y = 0; y < displayH; y += nunPixelSize) {
    for (let x = 0; x < displayW; x += nunPixelSize) {
      let openingNunX = floor(map(x, 0, displayW, 0, openingNun.width));
      let openingNunY = floor(map(y, 0, displayH, 0, openingNun.height));

      let index = (openingNunY * openingNun.width + openingNunX) * 4;

      let r = openingNun.pixels[index];
      let g = openingNun.pixels[index + 1];
      let b = openingNun.pixels[index + 2];
      let a = openingNun.pixels[index + 3];

      if (a < 10) continue;

      noStroke();
      fill(r, g, b, a);

      rect(
        startX + x,
        startY + y,
        nunPixelSize,
        nunPixelSize
      );
    }
  }

  // 柏林噪声覆盖在图片最上层，并且慢慢累积
  drawPerlinOverlay();
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  playButton.position(width * 0.02, height * 0.03);

  initCrosses();
  initFlowLayer();
}

function playPause() {
  if (openingSong.isPlaying()) {
    openingSong.pause();
    playButton.html("Play");
  } else {
    openingSong.loop();
    playButton.html("Pause");
  }
}function initFlowLayer() {
  flowLayer = createGraphics(width, height);
  flowLayer.clear();

  ffCols = floor(width / gridSize);
  ffRows = floor(height / gridSize);

  particles = [];
  flowField = [];

  for (let i = 0; i < psNums; i++) {
    particles.push(new FlowParticle()); 
  }

  overlayAlpha = 0;
}

function drawPerlinOverlay() {
  let yoff = 0;

  for (let y = 0; y < ffRows; y++) {
    let xoff = 0;

    for (let x = 0; x < ffCols; x++) {
      let index = x + y * ffCols;

      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.8);

      flowField[index] = v;

      xoff += 0.05;
    }

    yoff += 0.05;
  }

  zoff += zstep;

  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }

  overlayAlpha = min(overlayAlpha + 8, 255);

  tint(255, overlayAlpha);
  image(flowLayer, 0, 0);
  noTint();
}

class FlowParticle{
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.maxSpeed = maxSpeed;
  }

  follow(vectors) {
    let x = floor(this.pos.x / gridSize);
    let y = floor(this.pos.y / gridSize);
    let index = x + y * ffCols;

    let force = vectors[index];

    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    let t = noise(this.pos.x * 0.01, this.pos.y * 0.01);

    let r = lerp(255, 245, t);
    let g = lerp(220, 230, t);
    let b = lerp(230, 180, t);

    flowLayer.stroke(r, g, b, 100);
    flowLayer.strokeWeight(7);

    flowLayer.line(
      this.pos.x,
      this.pos.y,
      this.prevPos.x,
      this.prevPos.y
    );

    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }

    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}

