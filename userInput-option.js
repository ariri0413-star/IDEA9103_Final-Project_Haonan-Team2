let myFont;

let angelPower = 1;

let bloodPower = 1;

let glitchPower = 1;

function preload() {

  myFont = loadFont("font/Micro.otf");

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  textFont(myFont);

  noSmooth();

  noCursor(); // 隐藏系统鼠标

}

function draw() {

  background(20);

  updateMousePower();

  drawAngelScreenGlow(angelPower);

  drawScreenGlitch(glitchPower);

  let titleSize = constrain(width * 0.06, 32, 90);

  let confessX = width * 0.28;

  let deceiveX = width * 0.72;

  let optionY = height * 0.5;

  drawPixelHolySymbols(confessX, optionY, titleSize, angelPower);

  drawBloodAroundText(deceiveX, optionY, titleSize, bloodPower);

  drawOption("Confess", confessX, optionY, titleSize);

  drawOption("Deceive", deceiveX, optionY, titleSize);

  drawPixelCursor();

}

// 鼠标三等分控制

function updateMousePower() {

  let leftZone = width / 3;

  let rightZone = width * 2 / 3;

  if (mouseX < leftZone) {

    let amt = map(mouseX, 0, leftZone, 1, 0);

    angelPower = lerp(angelPower, 1 + amt * 1.5, 0.08);

    bloodPower = lerp(bloodPower, 1 - amt, 0.08);

    glitchPower = lerp(glitchPower, 1 - amt, 0.08);

  } else if (mouseX > rightZone) {

    let amt = map(mouseX, rightZone, width, 0, 1);

    angelPower = lerp(angelPower, 1 - amt, 0.08);

    bloodPower = lerp(bloodPower, 1 + amt * 1.8, 0.08);

    glitchPower = lerp(glitchPower, 1 + amt * 2.2, 0.08);

  } else {

    angelPower = lerp(angelPower, 1, 0.08);

    bloodPower = lerp(bloodPower, 1, 0.08);

    glitchPower = lerp(glitchPower, 1, 0.08);

  }

  angelPower = constrain(angelPower, 0, 2.5);

  bloodPower = constrain(bloodPower, 0, 3);

  glitchPower = constrain(glitchPower, 0, 3.5);

}

// 全屏黄粉色天使光效

function drawAngelScreenGlow(power) {

  if (power <= 0.05) return;

  rectMode(CORNER);

  noStroke();

  // 只有靠左增强时，全屏光晕更明显

  let alpha = map(power, 1, 2.5, 0, 35);

  alpha = constrain(alpha, 0, 35);

  fill(255, 190, 210, alpha);

  rect(0, 0, width, height);

  if (power > 1) {

    for (let i = 0; i < 60 * (power - 1); i++) {

      let px = random(width);

      let py = random(height);

      let s = random([6, 8, 10, 12, 16]);

      if (random() < 0.5) {

        fill(255, 230, 130, random(20, 60) * power);

      } else {

        fill(255, 150, 210, random(15, 55) * power);

      }

      rect(px, py, s, s);

    }

  }

}

// 左边 Confess：黄粉色像素圣光，靠左时扩散到全屏

function drawPixelHolySymbols(x, y, size, power) {

  if (power <= 0.03) return;

  rectMode(CENTER);

  noStroke();

  textSize(size);

  let t = frameCount * 0.03;

  let spread = map(power, 0, 2.5, 0.4, 1);

  spread = constrain(spread, 0.4, 1);

  let textW = textWidth("Confess");

  let boxW = textW + size * 1.8;

  let boxH = size * 2.2;

  // 全屏黄粉漂浮像素光点

  for (let i = 0; i < 90 * power; i++) {

    let px = random(width);

    let py = random(height);

    px += sin(t * 2 + i) * 8;

    py += cos(t * 1.5 + i) * 8;

    let s = random([4, 5, 6, 8]);

    if (random() < 0.5) {

      fill(255, 225, 120, random(25, 75) * power);

    } else {

      fill(255, 150, 205, random(20, 65) * power);

    }

    rect(px, py, s, s);

  }

  // Confess 周围核心圣光

  for (let i = 0; i < 45 * power; i++) {

    let angle = random(TWO_PI);

    let radius = random(size * 0.8, size * 3.2 * power);

    let px = x + cos(angle) * radius;

    let py = y + sin(angle) * radius;

    let s = random([5, 7, 9]);

    if (random() < 0.55) {

      fill(255, 230, 130, random(70, 150) * power);

    } else {

      fill(255, 160, 210, random(55, 130) * power);

    }

    rect(px, py, s, s);

  }

  // 漂浮圣光符号

  let symbols = [

    { type: "eye", ox: -width * 0.23, oy: -height * 0.08, s: size * 0.55 },

    { type: "cross", ox: -width * 0.12, oy: -height * 0.28, s: size * 0.28 },

    { type: "spark", ox: -width * 0.04, oy: -height * 0.18, s: size * 0.24 },

    { type: "dots", ox: width * 0.08, oy: -height * 0.26, s: size * 0.22 },

    { type: "triangle", ox: width * 0.20, oy: -height * 0.12, s: size * 0.42 },

    { type: "cloud", ox: width * 0.25, oy: height * 0.08, s: size * 0.45 },

    { type: "smallBox", ox: width * 0.15, oy: -height * 0.34, s: size * 0.18 },

    { type: "line", ox: width * 0.12, oy: height * 0.02, s: size * 0.28 },

    { type: "person", ox: -width * 0.05, oy: height * 0.16, s: size * 0.42 }

  ];

  for (let i = 0; i < symbols.length; i++) {

    let sym = symbols[i];

    let floatX = sin(t * 2 + i * 1.7) * 10;

    let floatY = cos(t * 2 + i * 1.2) * 12;

    let px = x + sym.ox * spread + floatX;

    let py = y + sym.oy * spread + floatY;

    drawGlowPixelSymbol(sym.type, px, py, sym.s * power, power);

  }

  // 靠左时左半屏额外增强

  if (power > 1.1) {

    for (let i = 0; i < 80 * (power - 1); i++) {

      let px = random(0, width * 0.65);

      let py = random(height);

      let s = random([6, 8, 10, 12]);

      if (random() < 0.5) {

        fill(255, 225, 120, random(40, 100) * power);

      } else {

        fill(255, 145, 210, random(30, 90) * power);

      }

      rect(px, py, s, s);

    }

  }

}

// 黄粉色像素符号光晕

function drawGlowPixelSymbol(type, x, y, s, power) {

  push();

  if (random() < 0.5) {

    fill(255, 220, 120, 45 * power);

  } else {

    fill(255, 145, 210, 45 * power);

  }

  drawPixelSymbol(type, x, y, s * 1.25, true, power);

  fill(255, 238, 180, 230 * power);

  drawPixelSymbol(type, x, y, s, false, power);

  pop();

}

// 像素符号

function drawPixelSymbol(type, x, y, s, isGlow, power) {

  let unit = max(3, floor(s / 8));

  if (type === "cross") {

    rect(x, y, unit, s);

    rect(x, y, s, unit);

  }

  if (type === "smallBox") {

    rect(x, y, unit * 2.2, unit * 2.2);

  }

  if (type === "dots") {

    for (let i = -1; i <= 1; i++) {

      rect(x + i * unit * 3, y, unit, unit);

    }

  }

  if (type === "line") {

    rect(x, y, s, unit);

    rect(x - s * 0.65, y, unit, unit);

  }

  if (type === "triangle") {

    for (let i = 0; i < 7; i++) {

      let rowW = i * unit * 2;

      let py = y + i * unit - s * 0.35;

      rect(x - rowW / 2, py, unit, unit);

      rect(x + rowW / 2, py, unit, unit);

    }

    rect(x, y + s * 0.45, s * 0.9, unit);

  }

  if (type === "cloud") {

    rect(x - unit * 4, y, unit * 5, unit * 3);

    rect(x, y - unit, unit * 6, unit * 4);

    rect(x + unit * 4, y, unit * 5, unit * 3);

    rect(x, y + unit * 2, unit * 10, unit * 2);

  }

  if (type === "eye") {

    rect(x - unit * 5, y, unit * 2, unit * 2);

    rect(x - unit * 3, y - unit * 2, unit * 2, unit * 2);

    rect(x, y - unit * 3, unit * 5, unit * 2);

    rect(x + unit * 3, y - unit * 2, unit * 2, unit * 2);

    rect(x + unit * 5, y, unit * 2, unit * 2);

    rect(x + unit * 3, y + unit * 2, unit * 2, unit * 2);

    rect(x, y + unit * 3, unit * 5, unit * 2);

    rect(x - unit * 3, y + unit * 2, unit * 2, unit * 2);

    rect(x, y, unit * 3, unit * 3);

    if (!isGlow) {

      fill(20);

      rect(x, y, unit, unit);

      fill(255, 238, 180, 230 * power);

    }

  }

  if (type === "spark") {

    rect(x, y, unit * 3, unit * 3);

    rect(x, y - unit * 3, unit, unit * 2);

    rect(x, y + unit * 3, unit, unit * 2);

    rect(x - unit * 3, y, unit * 2, unit);

    rect(x + unit * 3, y, unit * 2, unit);

  }

  if (type === "person") {

    rect(x, y - unit * 4, unit * 3, unit * 3);

    rect(x, y, unit * 2, unit * 6);

    rect(x - unit * 3, y, unit * 2, unit);

    rect(x + unit * 3, y, unit * 2, unit);

    rect(x - unit, y + unit * 5, unit, unit * 2);

    rect(x + unit, y + unit * 5, unit, unit * 2);

  }

}

// 右边 Deceive：红色像素血液和裂痕

function drawBloodAroundText(x, y, size, power) {

  if (power <= 0.03) return;

  rectMode(CENTER);

  noStroke();

  textSize(size);

  let textW = textWidth("Deceive");

  let boxW = textW + size * 1.4;

  let boxH = size * 1.6;

  // 文字左右两侧红色像素裂痕

  for (let i = 0; i < 90 * power; i++) {

    let side = random() < 0.5 ? -1 : 1;

    let px = x + side * random(boxW * 0.45, boxW * 0.95);

    let py = y + random(-boxH * 0.7, boxH * 0.7);

    let s = random([4, 6, 8, 10]);

    fill(255, 0, 20, random(90, 220) * power);

    rect(px, py, s, s);

  }

  // 从文字旁边向下流的像素血柱

  for (let i = 0; i < 18 * power; i++) {

    let side = random() < 0.5 ? -1 : 1;

    let startX = x + side * random(boxW * 0.4, boxW * 0.75);

    let startY = y - boxH * 0.4 + random(-20, 25);

    let dripLength = random(50, 170) * power;

    let blockSize = random([5, 7, 9]);

    for (let j = 0; j < dripLength; j += blockSize * 1.4) {

      let offsetX = noise(i * 0.3, j * 0.05, frameCount * 0.01) * 35 - 17;

      let px = startX + offsetX;

      let py = startY + j;

      if (random() > 0.18) {

        fill(220, 0, 25, random(120, 255) * power);

        rect(px, py, blockSize, blockSize);

      }

    }

    fill(180, 0, 20, 220 * power);

    rect(startX + random(-12, 12), startY + dripLength, blockSize * 2, blockSize * 2);

  }

  // 横向红色 glitch 断线

  for (let i = 0; i < 25 * power; i++) {

    let side = random() < 0.5 ? -1 : 1;

    let px = x + side * random(boxW * 0.45, boxW * 1.05);

    let py = y + random(-boxH * 0.8, boxH * 1.0);

    let lineW = random(12, 45) * power;

    let lineH = random([3, 4, 5]);

    fill(255, 0, 20, random(80, 210) * power);

    rect(px, py, lineW, lineH);

  }

  // 周围红色点阵

  for (let i = 0; i < 120 * power; i++) {

    let px = x + random(-boxW * 1.1, boxW * 1.1);

    let py = y + random(-boxH * 1.1, boxH * 2.2);

    if (abs(px - x) < boxW * 0.42 && abs(py - y) < boxH * 0.35) continue;

    if (random() < 0.55) {

      fill(255, 0, 20, random(60, 170) * power);

      rect(px, py, random([3, 4, 5]), random([3, 4, 5]));

    }

  }

}

// 全屏故障闪动

function drawScreenGlitch(power) {

  if (power <= 0.15) return;

  rectMode(CORNER);

  noStroke();

  let glitchAmount = floor(8 * power);

  for (let i = 0; i < glitchAmount; i++) {

    if (random() < 0.18 * power) {

      let gy = random(height);

      let h = random(3, 12);

      let gx = random(width);

      let w = random(30, 160) * power;

      fill(255, 0, 20, 45 * power);

      rect(gx, gy, w, h);

    }

  }

  for (let i = 0; i < 35 * power; i++) {

    if (random() < 0.35) {

      fill(255, 0, 20, 60 * power);

      rect(random(width), random(height), random([3, 5, 7]), random([3, 5, 7]));

    }

  }

}

// 文字

function drawOption(label, x, y, size) {

  textAlign(CENTER, CENTER);

  textSize(size);

  fill(0);

  text(label, x + 5, y + 5);

  fill(255);

  text(label, x, y);

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

}

function drawPixelCursor() {

  rectMode(CENTER);

  noStroke();

  let leftZone = width / 3;

  let rightZone = width * 2 / 3;

  let yellowPower = 0;

  let redPower = 0;

  if (mouseX < leftZone) {

    yellowPower = map(mouseX, leftZone, 0, 0, 1);

  } else if (mouseX > rightZone) {

    redPower = map(mouseX, rightZone, width, 0, 1);

  }

  let neutralPower = 1 - max(yellowPower, redPower);

  // 像素光晕

  for (let i = 0; i < 28; i++) {

    let angle = random(TWO_PI);

    let radius = random(8, 45);

    let px = mouseX + cos(angle) * radius;

    let py = mouseY + sin(angle) * radius;

    let s = random([3, 4, 5, 6]);

    if (yellowPower > 0) {

      fill(255, 225, 90, random(30, 120) * yellowPower);

    } else if (redPower > 0) {

      fill(255, 0, 25, random(30, 120) * redPower);

    } else {

      fill(255, 255, 255, random(15, 60) * neutralPower);

    }

    rect(px, py, s, s);

  }

  // 红色状态：故障碎片

  if (redPower > 0.1) {

    for (let i = 0; i < 10 * redPower; i++) {

      fill(255, 0, 20, 150 * redPower);

      rect(

        mouseX + random(-45, 45),

        mouseY + random(-35, 35),

        random([8, 12, 18]),

        random([3, 4, 5])

      );

    }

  }

  // 黄色状态：小十字光

  if (yellowPower > 0.1) {

    fill(255, 235, 120, 180 * yellowPower);

    for (let i = 0; i < 5; i++) {

      let px = mouseX + random(-35, 35);

      let py = mouseY + random(-35, 35);

      let u2 = random([3, 4, 5]);

      rect(px, py, u2, u2 * 4);

      rect(px, py, u2 * 4, u2);

    }

  }

  // 像素单位

  let u = constrain(width * 0.007, 5, 9);

  push();

  translate(mouseX, mouseY);

  // 让剑斜着指向右上角

  rotate(-PI / 4);

  // 根据左右状态改变剑颜色

  let bladeMain;

  let bladeLight;

  let bladeShadow;

  let handleMain;

  let guardColor;

  if (yellowPower > redPower) {

    bladeMain = color(255, 240, 170);

    bladeLight = color(255, 255, 230);

    bladeShadow = color(255, 200, 80);

    handleMain = color(255, 210, 110);

    guardColor = color(255, 230, 120);

  } else if (redPower > yellowPower) {

    bladeMain = color(230, 40, 50);

    bladeLight = color(255, 120, 120);

    bladeShadow = color(120, 0, 20);

    handleMain = color(80, 0, 15);

    guardColor = color(180, 0, 30);

  } else {

    bladeMain = color(220);

    bladeLight = color(255);

    bladeShadow = color(130);

    handleMain = color(90);

    guardColor = color(160);

  }

  // 用像素格画剑：每个数字代表一个格子

  // 坐标以剑中心为参考，y 负数是剑尖方向

  // 黑色描边

  fill(0, 190);

  // 剑刃外轮廓

  pixelBlock(0, -8, u);

  pixelBlock(-1, -7, u);

  pixelBlock(0, -7, u);

  pixelBlock(1, -7, u);

  for (let gy = -6; gy <= 1; gy++) {

    pixelBlock(-1, gy, u);

    pixelBlock(0, gy, u);

    pixelBlock(1, gy, u);

  }

  // 护手外轮廓

  for (let gx = -4; gx <= 4; gx++) {

    pixelBlock(gx, 2, u);

  }

  // 剑柄外轮廓

  pixelBlock(-1, 3, u);

  pixelBlock(0, 3, u);

  pixelBlock(1, 3, u);

  pixelBlock(-1, 4, u);

  pixelBlock(0, 4, u);

  pixelBlock(1, 4, u);

  pixelBlock(-1, 5, u);

  pixelBlock(0, 5, u);

  pixelBlock(1, 5, u);

  for (let gx = -2; gx <= 2; gx++) {

    pixelBlock(gx, 6, u);

  }

  // 剑刃主体

  fill(bladeMain);

  pixelBlock(0, -8, u);

  pixelBlock(-1, -7, u);

  pixelBlock(0, -7, u);

  pixelBlock(1, -7, u);

  for (let gy = -6; gy <= 1; gy++) {

    pixelBlock(-1, gy, u);

    pixelBlock(0, gy, u);

    pixelBlock(1, gy, u);

  }

  // 剑刃高光

  fill(bladeLight);

  for (let gy = -6; gy <= 0; gy++) {

    pixelBlock(-1, gy, u);

  }

  pixelBlock(0, -7, u);

  // 剑刃阴影

  fill(bladeShadow);

  for (let gy = -6; gy <= 1; gy++) {

    pixelBlock(1, gy, u);

  }

  // 护手

  fill(guardColor);

  for (let gx = -4; gx <= 4; gx++) {

    pixelBlock(gx, 2, u);

  }

  fill(bladeLight);

  pixelBlock(-4, 2, u);

  pixelBlock(4, 2, u);

  // 剑柄

  fill(handleMain);

  pixelBlock(0, 3, u);

  pixelBlock(0, 4, u);

  pixelBlock(0, 5, u);

  fill(guardColor);

  pixelBlock(-1, 3, u);

  pixelBlock(1, 3, u);

  pixelBlock(-1, 5, u);

  pixelBlock(1, 5, u);

  // 剑柄底部

  fill(guardColor);

  for (let gx = -2; gx <= 2; gx++) {

    pixelBlock(gx, 6, u);

  }

  pop();

}

// 画一个像素格

function pixelBlock(gx, gy, u) {

  rect(gx * u, gy * u, u, u);

}