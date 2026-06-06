//hell

let openingSong;
let badSong;
let goodSong;

let badCrosses = [];
let scaryTexts = [];
let eyes = [];

let textPool = [
  "God knows the truth",
  "GUILTY",
  "LIAR"
];

let analyser;
let fft;
let playButton;
let badNun;

let sceneTransitionAlpha = 255;

function preload() {
  openingSong = loadSound("assets/ES_House of a Hundred Rooms - Dream Cave.wav");
  badSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  goodSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  badNun = loadImage("image/nun2.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  // create 10 random crosses
  randomiseCrosses();
  // refresh every 2 seconds
  setInterval(randomiseCrosses, 2000);

  createEyes(7);

  analyser = new p5.Amplitude();
  analyser.setInput(openingSong);
  fft = new p5.FFT();
  fft.setInput(openingSong);

  playButton = createButton("Play/Pause");
  playButton.position(width * 0.02, height * 0.03);
  playButton.mousePressed(playPause);
}

// ——————————————————————————————————————————————

// colour palette for cross
const crossColour = {
  'n': null,
  'g': [221, 221, 221],    
  'w': [255, 255, 255],   
  'r': [250, 5, 6],   
};

const cross = [
  ['n','n','n','n','n','n','n','n','w','w','n','n','n','n','n','n','n','n','n','n'], // row 1
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 2
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 3
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 4
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 5
  ['w','w','r','w','w','w','w','w','r','r','r','w','w','w','w','w','r','w','w','g'], // row 6
  ['w','w','r','r','r','w','w','w','r','r','r','w','w','w','r','r','r','w','w','g'], // row 7
  ['n','n','n','r','r','r','r','r','r','r','r','r','r','r','r','n','n','n','n','n'], // row 8
  ['n','n','n','n','n','n','n','r','r','r','r','r','r','n','n','n','n','n','n','n'], // row 9
  ['n','n','n','n','n','n','n','r','r','r','r','n','n','n','n','n','n','n','n','n'], // row 10
  ['n','n','n','n','n','n','n','n','r','r','r','n','n','n','n','n','n','n','n','n'], // row 11
  ['n','n','n','n','n','n','n','n','r','r','r','r','n','n','n','n','n','n','n','n'], // row 12
  ['n','n','n','n','n','n','n','n','r','r','r','r','n','n','n','n','n','n','n','n'], // row 13
  ['n','n','n','n','n','n','n','n','r','r','r','r','n','n','n','n','n','n','n','n'], // row 14
  ['n','n','n','n','n','n','n','r','r','r','r','r','n','n','n','n','n','n','n','n'], // row 15
  ['n','n','n','n','n','n','n','r','r','r','r','n','n','n','n','n','n','n','n','n'], // row 16
  ['n','n','n','n','n','n','n','r','r','r','g','n','n','n','n','n','n','n','n','n'], // row 17
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 18
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 19
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 20
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 21
  ['n','n','n','n','n','n','n','n','r','r','g','n','n','n','n','n','n','n','n','n'], // row 22
  ['n','n','n','n','n','n','n','n','w','r','g','n','n','n','n','n','n','n','n','n'], // row 23
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 24
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 25
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 26
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 27
  ['n','n','n','n','n','n','n','n','w','w','g','n','n','n','n','n','n','n','n','n'], // row 28
  ['n','n','n','n','n','n','n','n','g','g','g','n','n','n','n','n','n','n','n','n'], // row 29
];

const XW = cross[0].length;
const XH = cross.length;

// ——————————————————————————————————————————————————

// eye

const eyeColour = {
  'n': null,
  'f': [110, 4, 0],
  'p': [242, 178, 181],
  'r': [240, 113, 108],
  'w': [255, 255, 255],
  'b': [0, 0, 0],
  'd': [55, 123, 31],
  'g': [85, 180, 53],
};

const eyeWhiteTemplate = [
  [ 'n','n','n','n','n','n','f','f','f','f','f','n','n','n','n','n','n' ],
  [ 'n','n','n','n','f','f','p','p','r','p','p','f','f','n','n','n','n' ],
  [ 'n','n','n','f','p','p','w','r','w','w','w','p','p','f','n','n','n' ],
  [ 'n','n','f','p','w','w','w','r','w','w','w','w','w','r','f','n','n' ],
  [ 'n','f','p','w','w','w','w','w','r','w','w','w','r','p','p','f','n' ],
  [ 'n','f','p','w','w','w','w','w','w','w','w','r','w','w','r','f','n' ],
  [ 'f','r','w','w','w','w','w','w','w','w','w','w','w','w','w','p','f' ],
  [ 'f','p','r','w','w','w','w','w','w','w','w','w','w','w','w','p','f' ],
  [ 'f','p','w','r','r','r','w','w','w','w','w','w','w','r','r','p','f' ],
  [ 'f','p','w','w','w','w','w','w','w','w','w','w','r','w','w','r','f' ],
  [ 'f','r','w','w','w','w','r','w','w','w','w','w','w','w','w','p','f' ],
  [ 'n','f','p','w','w','r','w','w','w','w','w','r','w','w','p','f','n' ],
  [ 'n','f','p','w','r','w','w','w','r','w','w','w','r','w','p','f','n' ],
  [ 'n','n','f','r','w','w','w','w','r','w','w','w','w','r','f','n','n' ],
  [ 'n','n','n','f','p','p','w','r','w','w','w','p','p','f','n','n','n' ],
  [ 'n','n','n','n','f','f','r','p','p','p','p','f','f','n','n','n','n' ],
  [ 'n','n','n','n','n','n','f','f','f','f','f','n','n','n','n','n','n' ]
];

const pupilTemplate = [
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','b','b','b','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','b','d','d','d','b','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','b','d','g','g','g','d','b','n','n','n','n','n' ],
  [ 'n','n','n','n','b','d','g','b','w','w','g','d','b','n','n','n','n' ],
  [ 'n','n','n','n','b','d','g','b','b','w','g','d','b','n','n','n','n' ],
  [ 'n','n','n','n','b','d','g','b','b','b','g','d','b','n','n','n','n' ],
  [ 'n','n','n','n','n','b','d','g','g','g','d','b','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','b','d','d','d','b','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','b','b','b','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ],
  [ 'n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n','n' ]
];

const pupilColours = [
  { d: [55, 123, 31], g: [85, 180, 53] },
  { d: [35, 90, 160], g: [90, 170, 255] },
  { d: [120, 50, 150], g: [210, 130, 255] },
  { d: [130, 70, 20], g: [220, 140, 60] },
  { d: [120, 20, 40], g: [240, 80, 100] },
  { d: [90, 70, 160], g: [160, 150, 255] },
  { d: [20, 120, 120], g: [90, 230, 220] }
];

function drawCross(x, y, ps, rms) {
  noStroke();

  for (let r = 0; r < XH; r++) {
    for (let c = 0; c < XW; c++) {
      let key = cross[r][c];
      let colour = crossColour[key];

      if (!colour) continue;
      // louder music, brighter crosses
      // map the rms value to a brightness value between 40 and 255
      let brightness = map(rms, 0, 0.3, 40, 255);

      fill(
        colour[0],
        colour[1],
        colour[2],
        brightness
      );

      rect(x + c * ps, y + r * ps, ps + 0.5, ps + 0.5);
    }
  }
}

function randomiseCrosses() {

  badCrosses = [];

  for (let i = 0; i < 10; i++) {

    badCrosses.push({
      x: random(width * 0.05, width * 0.9),
      y: random(height * 0.05, height * 0.75)
    });
  }
}

// create random eyes with different sizes and non-overlapping positions
function createEyes(num) {
  eyes = [];

  let attempts = 0;
  const maxAttempts = 1000;

  while (eyes.length < num && attempts < maxAttempts) {
    attempts++;

    const minSize = max(3, min(width, height) * 0.012);
    const maxSize = max(5, min(width, height) * 0.022);
    const ps = random(minSize, maxSize);

    const eyeW = 17 * ps;
    const eyeH = 17 * ps;

    const newEye = {
      x: random(0, width - eyeW),
      y: random(0, height - eyeH),
      ps: ps,
      w: eyeW,
      h: eyeH,
      pupilOffsetX: 0,
      pupilOffsetY: 0,
      pupilColour: pupilColours[eyes.length]
    };

    let overlapping = false;

    for (let existingEye of eyes) {
      if (isOverlapping(newEye, existingEye)) {
        overlapping = true;
        break;
      }
    }

    if (!overlapping) {
      eyes.push(newEye);
    }
  }
}

// check whether two eyes overlap on the canvas
function isOverlapping(a, b) {
  const padding = max(2, min(width, height) * 0.01);

  return !(
    a.x + a.w + padding < b.x ||
    a.x > b.x + b.w + padding ||
    a.y + a.h + padding < b.y ||
    a.y > b.y + b.h + padding
  );
}

function drawPixelTemplate(template, x, y, ps, colourMap) {
  const s = ceil(ps);
  noStroke();

  for (let r = 0; r < template.length; r++) {
    for (let c = 0; c < template[r].length; c++) {
      const key = template[r][c];
      const col = colourMap[key];

      if (!col) continue;

      fill(col[0], col[1], col[2]);
      rect(
        floor(x + c * ps),
        floor(y + r * ps),
        s,
        s
      );
    }
  }
}

// ________________________________________________

// create floating scary texts
function createScaryTexts() {

  // random amonunt of text between 2 and 5
  let textCount = floor(random(2, 6));

  for (let i = 0; i < textCount; i++) {

    scaryTexts.push({

      text: random(textPool),

      // start from outside right screen
      x: width + random(width * 0.02, width * 0.3),

      // random vertical position
      y: random(height * 0.05, height * 0.95),

      // movement speed
      speed: random(width * 0.002, width * 0.015),

      //text size
      size: random(width * 0.015, width * 0.05),

      // random transparency
      alpha: random(120, 255)
    });
  }
}

function draw() {
  
    background(24, 18, 35);
    // canvas size
    const cw = width;
    const ch = height;

    // ————————————————————————————————-
    // old church window scaling system
    const cols = 3;

    const PW = 21;
    const PH = 52;

    const marginX = cw * 0.03;
    const marginY = ch * 0.04;

    const availW = cw - marginX * 2;
    const availH = ch - marginY * 2;

    const cellW = availW / cols;

    const winW = cellW * 0.78;
    const winH = availH * 0.90;

    const pixSize = min(winW / PW, winH / PH);

    // ————————————————————————————————-

    let rms = analyser.getLevel();

    // ————————————————————————————————————————————————
    fft.analyze();
    // get energy of hight mid frequencis, the value will be between 0 and 255
    let high = fft.getEnergy("highMid");

    let shakeX = 0;
    let shakeY = 0;

    // shake amount changes with screen size
    let shakeAmount = width * 0.01;

    if (high > 30) {
      shakeX = random(-shakeAmount, shakeAmount);
      shakeY = random(-shakeAmount, shakeAmount);
    }

    for (let eye of eyes) {
      if (frameCount % 40 === 0) {
        eye.pupilOffsetX = random(-1.5, 1.5) * eye.ps;
        eye.pupilOffsetY = random(-1.2, 1.2) * eye.ps;
      }

      drawPixelTemplate(eyeWhiteTemplate, eye.x + shakeX, eye.y + shakeY, eye.ps, eyeColour);

      // replace the default green colours with this eye's unique pupil colours
      const customPupilColour = {
        ...eyeColour,
        d: eye.pupilColour.d,
        g: eye.pupilColour.g
      };

      drawPixelTemplate(
        pupilTemplate,
        eye.x + eye.pupilOffsetX + shakeX,
        eye.y + eye.pupilOffsetY + shakeY,
        eye.ps,
        customPupilColour
      );
    }

    let crossSize = pixSize * 0.5;
    // draw 10 random crosses
    for (let i = 0; i < badCrosses.length; i++) {
    drawCross(
        badCrosses[i].x + shakeX,
        badCrosses[i].y + shakeY,
        crossSize,
        rms
    );
    }
    // ————————————————————————————————————————————————
    // create more texts during strong high frequency
    if (high > 60 && frameCount % 10 === 0) {
      createScaryTexts();
    }

    // draw scary texts
    // ChatGPT helped me writing the for loop below, which iterates through the scaryTexts array in reverse order
    for (let i = scaryTexts.length - 1; i >= 0; i--) {

      let t = scaryTexts[i];

      // move text to the left
      t.x -= t.speed;

      // adaptive glitch shake
      let textShake = width * 0.004;

      let textShakeX = random(-textShake, textShake);
      let textShakeY = random(-textShake, textShake);

      // glowing red text
      fill(255, 30, 30, t.alpha);

      textSize(t.size);

      text(
        t.text,
        t.x + textShakeX,
        t.y + textShakeY
      );

      // remove text after leaving screen
      if (t.x < -width * 0.5) {
        scaryTexts.splice(i, 1);
      }
    }

  // ——————————————————————————————————————————

  // glitch vertical lines
   if (high > 55) {

  // how many lines
  let lineCount = floor(random(5, 20));

  for (let i = 0; i < lineCount; i++) {

    // random x position
    let lineX = random(width);

    // random width
    let lineW = random(width * 0.0003, width * 0.004);

    // random alpha
    let lineAlpha = random(40, 180);

    let lineH = height;
    let lineY = 0;

    // random colour
    fill(
      random(180, 255),
      random(180, 255),
      random(180, 255),
      lineAlpha
    );

    noStroke();

    rect(
      lineX,
      lineY,
      lineW,
      lineH
    );
  }
}
// ─────────────────────────────
    // nun image

  let nunPixelSize = pixSize * 0.6;

  let displayH = height * 0.88;

  let displayW =
    displayH * (badNun.width / badNun.height);

  if (displayW > width * 0.88) {

    displayW = width * 0.88;

    displayH =
      displayW * (badNun.height / badNun.width);

  }

  // change size or keep
  displayW *= 1.1;
  displayH *= 1.1;

  // center position
  let startX = width / 2 - displayW / 2;

  let startY = height - displayH;

  badNun.loadPixels();

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

      let badNunX = floor(
        map(x, 0, displayW, 0, badNun.width)
      );

      let badNunY = floor(
        map(y, 0, displayH, 0, badNun.height)
      );

      let index =
        (badNunY * badNun.width + badNunX) * 4;

      let r = badNun.pixels[index];

      let g = badNun.pixels[index + 1];

      let b = badNun.pixels[index + 2];

      let a = badNun.pixels[index + 3];

      if (a < 10) continue;

      // random red glitch pixels
      if (random(1) < 0.002) {

      r = 255;
      g = 40;
      b = 40;
      }

      noStroke();

      fill(r*1.4, g*1.2, b*1.2, a);

      rect(
        startX + x - shakeX,
        startY + y - shakeY,
        nunPixelSize,
        nunPixelSize
      );

    }

  }
  // hell scene transition overlay

  if (sceneTransitionAlpha > 0) {

    noStroke();

    rectMode(CORNER);

    fill(
      121,
      0,
      15,
      sceneTransitionAlpha
    );

    rect(
      0,
      0,
      width,
      height
    );

    sceneTransitionAlpha -= 3; // 1.5 seconds fade out

  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  randomiseCrosses();
  createEyes(7);

  playButton.position(width * 0.02, height * 0.03);
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