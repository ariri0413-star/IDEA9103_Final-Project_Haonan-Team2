// opening scene: church

// Perlin noise overlay

let Confess1Timer = 0;

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

// generate random cross positions once on load
function initCrosses() {
  crosses = [];
  const count = 18;

  for (let i = 0; i < count; i++) {
    crosses.push({
      x: random(width),
      y: random(height),
      alpha: 0,
      state: 'fadeIn',
      holdTimer: floor(random(40, 120)), // frames to stay fully visible
      holdAge: 0,
      fadeSpeed: random(3, 8),
    });
  }
}

// define the function for drawing flickering crosses across the background
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

// define the function for drawing the candles with optional horizontal mirroring

// cx: the centre x-position of the candle group
// baseY: the bottom y-position of the candle base
// ps: the size of each pixel grid
// mirror: whether to flip the group horizontally

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

// ─────────────────────────────────────────────
// draw animated candle sparks
function drawSpark(cx, baseY, ps, candleCol, bottomOffset, smallJump, bigJump, mirror) {
  // calculate candle group left edge
  let x0 = floor(cx - (CW / 2) * ps);
  // choose spark column & flip spark position for mirrored candles
  let col = mirror ? CW - 1 - candleCol : candleCol;
  // final x position
  let x = x0 + col * ps;
  // the bottom pixel of flame touches the top of the candle
  let bottomY = baseY - bottomOffset * ps;
  // lower two-pixel flame, smaller movement
  rect(x, bottomY - smallJump, ps, ps);
  rect(x, bottomY - ps - smallJump, ps, ps);
  // top single-pixel spark, bigger movement
  rect(x, bottomY - 3 * ps - bigJump, ps, ps);
}
// ——————————————————————————————————————————————————

// draw pixel style light circle behind each candle flame

function drawHalo(cx, baseY, ps, candleCol, bottomOffset, haloSize, mirror) {
  // calculate candle group left edge
  let x0 = floor(cx - (CW / 2) * ps);
  // choose candle column & flip position for mirrored candles
  let col = mirror ? CW - 1 - candleCol : candleCol;
  // centre position of the halo
  let centerX = floor(x0 + col * ps + ps / 2);
  let centerY = floor(baseY - bottomOffset * ps - ps * 1.5);
  // halo block size
  let block = ps;

  noStroke();
  // draw pixel circle
  for (let y = -5; y <= 5; y++) {
    for (let x = -5; x <= 5; x++) {
      // distance from centre
      let d = sqrt(x * x + y * y);
      // glow
      if (d < haloSize * 0.55) {
        fill(252, 223, 37, 45);
        rect(centerX + x * block, centerY + y * block, block, block);
      }
    }
  }
}

// define the function for drawing the spiderweb
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

// define the function for drawing the spider
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

function drawConfess1() {
  // Control different jump strengths for layered flame motion
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
  const cellW = availW / cols;

  const winW = cellW * 0.78;
  const winH = availH * 0.90;
  const pixSize = min(winW / PW, winH / PH);
  const actualW = pixSize * PW;
  const actualH = pixSize * PH;
  const cy = marginY + availH / 2;

  // draw multiple stained glass church windows
  for (let col = 0; col < cols; col++) {
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
  // vertical position of the candles
  const candleBaseY = cy + actualH / 2 + pixSize * 5;
  // left candle group x position
  let leftCandleX = marginX + cellW * 0.131;
  // right candle group x position
  let rightCandleX = marginX + cellW * 2.869;
  // halo size reacts to music volume
  let haloSize = 4.2 + rms * 30;
  // draw halos 
  drawHalo(leftCandleX, candleBaseY, pixSize, 4.5, 18, haloSize, false);
  drawHalo(leftCandleX, candleBaseY, pixSize, 10.5, 17, haloSize * 0.8, false);

  drawHalo(rightCandleX, candleBaseY, pixSize, 5.5, 18, haloSize, true);
  drawHalo(rightCandleX, candleBaseY, pixSize, 11.5, 17, haloSize * 0.8, true);
  // draw left candle group
  drawCandleGroup(leftCandleX, candleBaseY, pixSize, false);
  // draw right candle group
  drawCandleGroup(rightCandleX, candleBaseY, pixSize, true);

  // ————————————sparks————————————————————
  // spark colour
  fill(252, 223, 37);
  // LEFT SIDE
  // tall candle spark
  drawSpark(leftCandleX, candleBaseY, pixSize, 5, 18, smallJump, bigJump, false);
  // short candle spark
  drawSpark(leftCandleX, candleBaseY, pixSize, 11, 16, smallJump, bigJump, false);
  // RIGHT SIDE
  // tall candle spark
  drawSpark(rightCandleX, candleBaseY, pixSize, 5, 18, smallJump, bigJump, true);
  // short candle spark
  drawSpark(rightCandleX, candleBaseY, pixSize, 11, 16, smallJump, bigJump, true);
  
  // ————————————————————————————————————————————————————

  // draw spiderweb
  drawWeb(pixSize);
  // ── spider animation ──
  // animate the spider thread extending and retracting, then calculate the spider’s position based on the thread length
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
  // draw the spider thread
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
  // draw the spider
  drawSpider(pixSize, cw, spiderOffsetY);
  // draw flickering crosses on the background
  drawCrosses(pixSize);

  // ─────────────────────────────

  // nun image

  let nunPixelSize = pixSize * 0.6;

  let displayH = height * 0.88;
  let displayW = displayH * (openingNun.width / openingNun.height);

  if (displayW > width * 0.88) {
    displayW = width * 0.88;
    displayH = displayW * (openingNun.height / openingNun.width);
  }

  // change size or keep
  displayW *= 1.1;
  displayH *= 1.1;
  // center position
  let startX = width / 2 - displayW / 2;
  let startY = height - displayH;

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

  // overlay Perlin noise above the image and let it slowly build up
  drawPerlinOverlay();

  Confess1Timer++;

  if (Confess1Timer > 90) {
  goodSong.stop();
  Confess1Timer = 0;
  scene = "Confess2";
  }
}


function initFlowLayer() {
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