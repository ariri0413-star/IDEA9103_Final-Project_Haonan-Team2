let myFont;

let confessProgress = 0;

let deceiveProgress = 0;

let holyFloatItems = [];

function preload() {

  myFont = loadFont("font/Micro.otf");

}

function setup() {

  createCanvas(windowWidth, windowHeight);

  textFont(myFont);

  noSmooth();

  noCursor();

  initHolyFloatItems();

}

function draw() {

  clear();

  let titleSize = constrain(width * 0.06, 32, 90);

  let confessX = width * 0.28;

  let deceiveX = width * 0.72;

  let optionY = height * 0.5;

  updateHoverProgress(confessX, deceiveX, optionY, titleSize);

  drawOptionEffect(

    "Confess",

    confessX,

    optionY,

    titleSize,

    confessProgress,

    "holy"

  );

  drawOptionEffect(

    "Deceive",

    deceiveX,

    optionY,

    titleSize,

    deceiveProgress,

    "blood"

  );

  drawPixelCursor();

}

// 鼠标停留进度控制

function updateHoverProgress(confessX, deceiveX, optionY, titleSize) {

  textSize(titleSize);

  let confessW = textWidth("Confess");

  let deceiveW = textWidth("Deceive");

  let hoverConfess =

    mouseX > confessX - confessW / 2 - 30 &&

    mouseX < confessX + confessW / 2 + 30 &&

    mouseY > optionY - titleSize / 2 - 25 &&

    mouseY < optionY + titleSize / 2 + 25;

  let hoverDeceive =

    mouseX > deceiveX - deceiveW / 2 - 30 &&

    mouseX < deceiveX + deceiveW / 2 + 30 &&

    mouseY > optionY - titleSize / 2 - 25 &&

    mouseY < optionY + titleSize / 2 + 25;

  if (hoverConfess) {

    confessProgress += 0.015;

  } else {

    confessProgress -= 0.025;

  }

  if (hoverDeceive) {

    deceiveProgress += 0.015;

  } else {

    deceiveProgress -= 0.025;

  }

  confessProgress = constrain(confessProgress, 0, 1);

  deceiveProgress = constrain(deceiveProgress, 0, 1);

}

// 选项整体

function drawOptionEffect(label, x, y, size, progress, type) {

  if (type === "holy") {

    drawHolyHoverEffect(x, y, size, progress);

  } else {

    drawBloodHoverEffect(x, y, size, progress);

  }

  drawOptionTextFill(label, x, y, size, progress, type);

}

// 文字内部进度条效果

function drawOptionTextFill(label, x, y, size, progress, type) {

  push();

  textFont(myFont);

  textAlign(CENTER, CENTER);

  textSize(size);

  let textW = textWidth(label);

  let textH = size * 1.1;

  // 文字阴影

  fill(0, 180);

  text(label, x + 5, y + 5);

  // 底层白色文字

  fill(255);

  text(label, x, y);

  // 彩色进度只出现在文字内部

  drawingContext.save();

  let clipX = x - textW / 2;

  let clipY = y - textH / 2;

  let clipW = textW * progress;

  let clipH = textH;

  drawingContext.beginPath();

  drawingContext.rect(clipX, clipY, clipW, clipH);

  drawingContext.clip();

  if (type === "holy") {

    fill(255, 230, 120);

  } else {

    fill(255, 30, 45);

  }

  text(label, x, y);

  drawingContext.restore();

  // 快满时文字轻微发光

  if (progress > 0.7) {

    let glowAlpha = map(progress, 0.7, 1, 0, 160);

    if (type === "holy") {

      fill(255, 240, 150, glowAlpha);

    } else {

      fill(255, 0, 30, glowAlpha);

    }

    text(label, x + random(-1.5, 1.5), y + random(-1.5, 1.5));

  }

  pop();

}

// Confess 特效：没满时在文字附近，满了之后变成漂浮小元素

function drawHolyHoverEffect(x, y, size, progress) {

  if (progress <= 0.02) return;

  rectMode(CENTER);

  noStroke();

  // 还没充满时：文字附近的温柔光点

  if (progress < 1) {

    let amount = 8 + progress * 35;

    for (let i = 0; i < amount; i++) {

      let px = x + random(-size * 1.8, size * 1.8);

      let py = y + random(-size * 0.9, size * 0.9);

      let s = random([4, 5, 6]);

      if (random() < 0.55) {

        fill(255, 225, 120, random(30, 90) * progress);

      } else {

        fill(255, 150, 210, random(25, 80) * progress);

      }

      rect(px, py, s, s);

    }

    // 文字附近的小十字

    for (let i = 0; i < 3; i++) {

      let px = x + random(-size * 1.7, size * 1.7);

      let py = y + random(-size * 0.9, size * 0.9);

      let u = size * 0.05 * (1 + progress);

      fill(255, 235, 140, 120 * progress);

      rect(px, py, u, u * 4);

      rect(px, py, u * 4, u);

    }

  } else {

    // 充满后：全屏漂浮小元素

    drawHolyFloatingItems();

  }

}

// Deceive 特效：保持简单红色扩散

function drawBloodHoverEffect(x, y, size, progress) {

  if (progress <= 0.02) return;

  rectMode(CENTER);

  noStroke();

  let fullScreen = progress >= 1;

  let amount = fullScreen ? 180 : 10 + progress * 55;

  for (let i = 0; i < amount; i++) {

    let px;

    let py;

    if (fullScreen) {

      px = random(width);

      py = random(height);

    } else {

      px = x + random(-size * (1.4 + progress), size * (1.4 + progress));

      py = y + random(-size * (0.8 + progress), size * (0.8 + progress));

    }

    let s = random([4, 5, 6, 8]);

    if (fullScreen) {

      s *= random(1, 2.2);

    } else {

      s *= 1 + progress * 0.4;

    }

    fill(255, 0, 25, random(35, 120) * progress);

    rect(px, py, s, s);

  }

  // 红色短线

  let lineCount = fullScreen ? 35 : 6 * progress;

  for (let i = 0; i < lineCount; i++) {

    let px;

    let py;

    if (fullScreen) {

      px = random(width);

      py = random(height);

    } else {

      px = x + random(-size * 2, size * 2);

      py = y + random(-size, size);

    }

    fill(255, 0, 25, 110 * progress);

    rect(px, py, random(14, 40), random([3, 4, 5]));

  }

}

// 初始化 Confess 满格后的漂浮元素

function initHolyFloatItems() {

  holyFloatItems = [];

  let types = ["cross", "spark", "dot", "box", "line", "eye"];

  for (let i = 0; i < 55; i++) {

    holyFloatItems.push({

      x: random(width),

      y: random(height),

      size: random(10, 34),

      type: random(types),

      speedX: random(-0.25, 0.25),

      speedY: random(-0.45, -0.12),

      phase: random(TWO_PI),

      alpha: random(80, 170)

    });

  }

}

// Confess 满格后的全屏漂浮元素

function drawHolyFloatingItems() {

  rectMode(CENTER);

  noStroke();

  // 淡淡的暖色覆盖

  rectMode(CORNER);

  fill(255, 220, 170, 10);

  rect(0, 0, width, height);

  rectMode(CENTER);

  for (let item of holyFloatItems) {

    item.x += item.speedX;

    item.y += item.speedY;

    let floatOffset = sin(frameCount * 0.035 + item.phase) * 4;

    if (item.y < -60) {

      item.y = height + 60;

      item.x = random(width);

    }

    if (item.x < -60) item.x = width + 60;

    if (item.x > width + 60) item.x = -60;

    let pulse = 1 + sin(frameCount * 0.025 + item.phase) * 0.12;

    let s = item.size * pulse;

    if (random() < 0.55) {

      fill(255, 230, 120, item.alpha);

    } else {

      fill(255, 160, 210, item.alpha);

    }

    drawHolySmallSymbol(item.type, item.x, item.y + floatOffset, s);

  }

}

// 小元素图案

function drawHolySmallSymbol(type, x, y, s) {

  let u = max(3, floor(s / 6));

  if (type === "cross") {

    rect(x, y, u, s);

    rect(x, y, s, u);

  }

  if (type === "spark") {

    rect(x, y, u * 2, u * 2);

    rect(x, y - u * 3, u, u * 2);

    rect(x, y + u * 3, u, u * 2);

    rect(x - u * 3, y, u * 2, u);

    rect(x + u * 3, y, u * 2, u);

  }

  if (type === "dot") {

    rect(x, y, u * 1.5, u * 1.5);

  }

  if (type === "box") {

    rect(x, y, u * 3, u * 3);

  }

  if (type === "line") {

    rect(x, y, s, u);

  }

  if (type === "eye") {

    rect(x - u * 3, y, u * 2, u);

    rect(x + u * 3, y, u * 2, u);

    rect(x, y - u * 2, u * 4, u);

    rect(x, y + u * 2, u * 4, u);

    rect(x, y, u * 2, u * 2);

  }

}

// 像素剑鼠标

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

  // 鼠标附近轻微光点

  for (let i = 0; i < 12; i++) {

    let angle = random(TWO_PI);

    let radius = random(8, 28);

    let px = mouseX + cos(angle) * radius;

    let py = mouseY + sin(angle) * radius;

    let s = random([3, 4, 5]);

    if (yellowPower > redPower) {

      fill(255, 225, 90, random(30, 80) * yellowPower);

    } else if (redPower > yellowPower) {

      fill(255, 0, 25, random(30, 80) * redPower);

    } else {

      fill(255, 255, 255, random(15, 45));

    }

    rect(px, py, s, s);

  }

  let u = constrain(width * 0.007, 5, 9);

  push();

  translate(mouseX, mouseY);

  rotate(-PI / 4);

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

  // 黑色描边

  fill(0, 190);

  pixelBlock(0, -8, u);

  pixelBlock(-1, -7, u);

  pixelBlock(0, -7, u);

  pixelBlock(1, -7, u);

  for (let gy = -6; gy <= 1; gy++) {

    pixelBlock(-1, gy, u);

    pixelBlock(0, gy, u);

    pixelBlock(1, gy, u);

  }

  for (let gx = -4; gx <= 4; gx++) {

    pixelBlock(gx, 2, u);

  }

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

  // 高光

  fill(bladeLight);

  for (let gy = -6; gy <= 0; gy++) {

    pixelBlock(-1, gy, u);

  }

  pixelBlock(0, -7, u);

  // 阴影

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

  // 底部

  fill(guardColor);

  for (let gx = -2; gx <= 2; gx++) {

    pixelBlock(gx, 6, u);

  }

  pop();

}

function pixelBlock(gx, gy, u) {

  rect(gx * u, gy * u, u, u);

}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);

  initHolyFloatItems();

}