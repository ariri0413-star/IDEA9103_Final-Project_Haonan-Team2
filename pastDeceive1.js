//opening scene: church

let Deceive1Timer = 0;

// blood-like Perlin noise overlay
let bloodLayer;
let bloodParticles = [];
let bloodFlowField = [];

let bloodGridSize = 10;
let flowCols, flowRows;

let bloodZoff = 0;
let bloodZstep = 0.3;

let bloodParticleNums = 6000;
let bloodMaxSpeed = 12;
let bloodOverlayAlpha = 0;



// generate random cross positions once on load
function initCrosses() {
  crosses = [];
  const count = 18;
  for (let i = 0; i < count; i++) {
    crosses.push({
      x:       random(width),
      y:       random(height),
      alpha:   0,
      state:   'fadeIn',
      holdTimer: floor(random(40, 120)), // frames to stay fully visible
      holdAge:   0,
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
      cross.x         = random(width);
      cross.y         = random(height);
      cross.holdTimer = floor(random(40, 120));
      cross.fadeSpeed = random(3, 8);
      cross.state     = 'fadeIn';
    }

    if (cross.alpha <= 0) continue;
    const x = floor(cross.x);
    const y = floor(cross.y);
    fill(220, 220, 220, cross.alpha);
    rect(x,      y - ps,  ps, ps * 4);
    rect(x - ps, y,       ps * 3, ps);
  }
}


// ─────────────────────────────────────────────
// draw animated candle sparks
function drawSpark(cx, baseY, ps, candleCol, bottomOffset, smallJump, bigJump, mirror) {

  // calculate candle group left edge
  let x0 = floor(cx - (CW / 2) * ps);

  // choose spark column
  let col = candleCol;

  // flip spark position for mirrored candles
  if (mirror) {
    col = CW - 1 - candleCol;
  }

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

  // choose candle column
  let col = candleCol;

  // flip position for mirrored candles
  if (mirror) {
    col = CW - 1 - candleCol;
  }

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

// ——————————————————————————————————————————————


// define the function for drawing the spiderweb
function drawWeb(ps) {
  noStroke();
  for (let r = 0; r < WH; r++) {
    for (let c = 0; c < WW; c++) {
      const color = webColour[web[r][c]];
      if (!color) continue;
      fill(color[0], color[1], color[2]);
      rect(c * ps, r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

// ─────────────────────────────────────────────


// define the function for drawing the spider
function drawSpider(ps, cw, offsetY) {
  const x0 = cw - SW * ps;
  noStroke();
  for (let r = 0; r < SH; r++) {
    for (let c = 0; c < SW; c++) {
      const color = spiderColour[spider[r][c]];
      if (!color) continue;
      fill(color[0], color[1], color[2]);
      rect(x0 + c * ps, offsetY + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

// ─────────────────────────────────────────────

// draw!! :P
function drawDeceive1() {

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
        const color = glassColour[key];
        if (!color) continue;
        fill(color[0], color[1], color[2]);
        rect(startX + px * pixSize, startY + py * pixSize, pixSize + 0.5, pixSize + 0.5);
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

    // horizontal position of the left candles
    drawCandleGroup(marginX + cellW * 0.131, candleBaseY, pixSize, false);

    // right side mirroring
    drawCandleGroup(marginX + cellW * 2.869, candleBaseY, pixSize, true);

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
    rect(spiderThreadX, threadTopY + i * pixSize, pixSize + 0.5, pixSize + 0.5);
  }

  // draw the spider
  drawSpider(pixSize, cw, spiderOffsetY);

  // draw flickering crosses on the background
  drawCrosses(pixSize);

  // ─────────────────────────────

  // nun image

  let nunPixelSize = pixSize * 0.6;

  let displayH = height * 0.88;

  let displayW =
    displayH * (openingNun.width / openingNun.height);

  if (displayW > width * 0.88) {

    displayW = width * 0.88;

    displayH =
      displayW * (openingNun.height / openingNun.width);

  }

  // change size or keep
  displayW *= 1.1;
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

      let openingNunX = floor(
        map(x, 0, displayW, 0, openingNun.width)
      );

      let openingNunY = floor(
        map(y, 0, displayH, 0, openingNun.height)
      );

      let index =
        (openingNunY * openingNun.width + openingNunX) * 4;

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
  drawBloodOverlay();

  Deceive1Timer++;
  
  if (Deceive1Timer > 90) {
  Deceive1Timer = 0;
  scene = "Deceive2";
  }
}


// Play or pause background music
function playPause() {
  if (openingSong.isPlaying()) {
    openingSong.pause();
    playButton.html("Play");
  } else {
    openingSong.loop();
    playButton.html("Pause");
  }
}
function initBloodOverlay() {
  bloodLayer = createGraphics(width, height);
  bloodLayer.clear();
  bloodLayer.noSmooth();

  flowCols = floor(width / bloodGridSize);
  flowRows = floor(height / bloodGridSize);

  bloodParticles = [];
  bloodFlowField = [];

  for (let i = 0; i < bloodParticleNums; i++) {
    bloodParticles.push(new BloodParticle(true));
  }

  bloodOverlayAlpha = 0;
}

function drawBloodOverlay() {
  let yoff = 0;

  for (let y = 0; y < flowRows; y++) {
    let xoff = 0;

    for (let x = 0; x < flowCols; x++) {
      let index = x + y * flowCols;

      let angle =
        HALF_PI +
        noise(xoff, yoff, bloodZoff) * 1.1 -
        0.55;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.8);

      bloodFlowField[index] = v;

      xoff += 0.03;
    }

    yoff += 0.03;
  }

  bloodZoff += bloodZstep;

  for (let p of bloodParticles) {
    p.follow(bloodFlowField);
    p.update();
    p.edges();
    p.show();
  }

  bloodOverlayAlpha = min(bloodOverlayAlpha + 8, 255);

  tint(255, bloodOverlayAlpha);
  image(bloodLayer, 0, 0);
  noTint();
}

class BloodParticle {
  constructor(firstTime = false) {
    this.reset(firstTime);
  }

  reset(firstTime = false) {
    this.pos = createVector(
      random(width),
      firstTime ? random(height) : random(-300, -20)
    );

    this.vel = createVector(
      random(-0.05, 0.05),
      random(0.3, 0.8)
    );

    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.maxSpeed = bloodMaxSpeed;
  }

  follow(vectors) {
    let x = floor(this.pos.x / bloodGridSize);
    let y = floor(this.pos.y / bloodGridSize);

    if (x < 0 || x >= flowCols || y < 0 || y >= flowRows) return;

    let index = x + y * flowCols;
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

    this.vel.y += 0.01;
    this.vel.mult(0.985);

    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    if (this.pos.y < 0) {
      this.updatePrev();
      return;
    }

    bloodLayer.stroke(120, 0, 15, 200);
    bloodLayer.strokeWeight(3.5);

    bloodLayer.line(
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
    if (this.pos.y > height + 30) {
      this.reset(false);
    }

    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
  }
}