
let Deceive2Timer = 0;

// deceive scene 2: the haunted church
let badCrosses = [];
let scaryTexts = [];
let eyes = [];

// custom Perlin noise object
let pns;

// thin blood mist effect
let mistLayer;
let mistParticles = [];
let mistFlowField = [];

let mistGridSize = 120;
let mistCols, mistRows;

let mistZoff = 0;
let mistZstep = 0.0001;

let mistCount = 1000;
let mistMaxSpeed = 0.25;

let textPool = [
  "God knows the truth",
  "GUILTY",
  "LIAR"
];


let Deceive2sceneTransitionAlpha = 255;

// invert flash effect variables
let invertFlashActive = false;
let invertFlashTimer = 0;
let invertFlashDuration = 8; // frames to stay inverted

// invert flash mode: 0 = single hold, 1 = strobe flicker
let invertFlashMode = 0;
let invertStrobeCount = 0;
let invertStrobeTotal = 0;
let invertStrobeOnFrames = 0;
let invertStrobeOffFrames = 0;
let invertStrobePhase = 0; // 0 = on, 1 = off


// trigger invert flash every 4–8 seconds randomly
// randomly picks between a single hold or a strobe flicker effect
function triggerInvertFlash() {
  invertFlashMode = floor(random(2));

  if (invertFlashMode === 0) {
    // single hold: lasts between 6 and 20 frames
    invertFlashActive = true;
    invertFlashTimer = floor(random(6, 21));
  } else {
    // strobe: flickers 2 to 5 times
    invertFlashActive = true;
    invertStrobeTotal = floor(random(2, 6));
    invertStrobeCount = 0;
    invertStrobeOnFrames = floor(random(3, 8));
    invertStrobeOffFrames = floor(random(2, 6));
    invertStrobePhase = 0;
    invertFlashTimer = invertStrobeOnFrames;
  }

  setTimeout(triggerInvertFlash, random(4000, 8000));
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

function perlinNoise(){
  this.permutation = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,
    247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,
    175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,
    109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,
    182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,
    98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,
    51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,
    236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];

  this.p = [];

  this.init = function(){
    this.p = [];
    for (let k = 0; k < 512; k++){
      this.p.push(this.permutation[k % this.permutation.length]);
    }
  }

  this.genNoise = function(x, y, z, times, persistence){
    let weight = 0;
    let frequency = 1;
    let amplitude = 1;
    let res = 0;

    for (let i = 0; i < times; i++){
      res += this.perlin(x * frequency, y * frequency, z * frequency) * amplitude;
      weight += amplitude;
      amplitude *= persistence;
      frequency *= 2;
    }

    return res / weight;
  }

  this.perlin = function(x, y, z){
    let xi = floor(x) & 255;
    let yi = floor(y) & 255;
    let zi = floor(z) & 255;

    let xf = x - floor(x);
    let yf = y - floor(y);
    let zf = z - floor(z);

    let u = this.fade(xf);
    let v = this.fade(yf);
    let w = this.fade(zf);

    let aaa = this.p[this.p[this.p[xi] + yi] + zi];
    let aba = this.p[this.p[this.p[xi] + this.inc(yi)] + zi];
    let aab = this.p[this.p[this.p[xi] + yi] + this.inc(zi)];
    let abb = this.p[this.p[this.p[xi] + this.inc(yi)] + this.inc(zi)];
    let baa = this.p[this.p[this.p[this.inc(xi)] + yi] + zi];
    let bba = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + zi];
    let bab = this.p[this.p[this.p[this.inc(xi)] + yi] + this.inc(zi)];
    let bbb = this.p[this.p[this.p[this.inc(xi)] + this.inc(yi)] + this.inc(zi)];

    let x1 = this.lerp(this.grad(aaa, xf, yf, zf), this.grad(baa, xf - 1, yf, zf), u);
    let x2 = this.lerp(this.grad(aba, xf, yf - 1, zf), this.grad(bba, xf - 1, yf - 1, zf), u);
    let y1 = this.lerp(x1, x2, v);

    x1 = this.lerp(this.grad(aab, xf, yf, zf - 1), this.grad(bab, xf - 1, yf, zf - 1), u);
    x2 = this.lerp(this.grad(abb, xf, yf - 1, zf - 1), this.grad(bbb, xf - 1, yf - 1, zf - 1), u);
    let y2 = this.lerp(x1, x2, v);

    return this.lerp(y1, y2, w) * 0.5 + 0.5;
  }

  this.inc = function(n){
    return n + 1;
  }

  this.grad = function(h, x, y, z){
    switch(h & 15) {
      case 0: return x + y;
      case 1: return -x + y;
      case 2: return x - y;
      case 3: return -x - y;
      case 4: return x + z;
      case 5: return -x + z;
      case 6: return x - z;
      case 7: return -x - z;
      case 8: return y + z;
      case 9: return -y + z;
      case 10: return y - z;
      case 11: return -y - z;
      case 12: return y + x;
      case 13: return -y + z;
      case 14: return y - x;
      case 15: return -y - z;
      default: return 0;
    }
  }

  this.fade = function(t){
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  this.lerp = function(a, b, f){
    return a * (1 - f) + b * f;
  }
}

function drawDeceive2() {
  
    background(24, 18, 35);
    
    drawBloodMist();

    // canvas size
    const cw = width
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

  // nun image

  let nunPixelSize = pixSize * 0.6;

  let displayH = height * 0.88;

  let displayW = displayH * (badNun.width / badNun.height);

  if (displayW > width * 0.88) {

    displayW = width * 0.88;

    displayH = displayW * (badNun.height / badNun.width);

  }

  displayW *= 1.1;

  displayH *= 1.1;

  let startX = width / 2 - displayW / 2;

  let startY = height - displayH;

  for (let y = 0; y < displayH; y += nunPixelSize) {

    for (let x = 0; x < displayW; x += nunPixelSize) {

      let badNunX = floor(map(x, 0, displayW, 0, badNun.width));

      let badNunY = floor(map(y, 0, displayH, 0, badNun.height));

      let index = (badNunY * badNun.width + badNunX) * 4;

      let r = badNun.pixels[index];

      let g = badNun.pixels[index + 1];

      let b = badNun.pixels[index + 2];

      let a = badNun.pixels[index + 3];

      if (a < 10) continue;

      if (random(1) < 0.002) {

        r = 255;

        g = 40;

        b = 40;

      }

      noStroke();

      fill(r * 1.4, g * 1.2, b * 1.2, a);

      rect(

        startX + x - shakeX,

        startY + y - shakeY,

        nunPixelSize,

        nunPixelSize

      );

    }

  }

  // red transition

  if (Deceive2sceneTransitionAlpha > 0) {

    noStroke();

    rectMode(CORNER);

    fill(121, 0, 15, Deceive2sceneTransitionAlpha);

    rect(0, 0, width, height);

    Deceive2sceneTransitionAlpha -= 3;

  }

  // ——————————————————————————————————————————
  // screen invert flash effect
  // draws a white difference-blend overlay to simulate colour inversion

  if (invertFlashActive) {

    if (invertFlashMode === 0) {

      // single hold mode: stay inverted for invertFlashTimer frames
      drawingContext.save();

      // DIFFERENCE blend: white overlay inverts every pixel beneath it
      drawingContext.globalCompositeOperation = "difference";

      noStroke();
      fill(255, 255, 255, 255);

      rect(0, 0, width, height);

      drawingContext.restore();

      invertFlashTimer--;

      if (invertFlashTimer <= 0) {
        invertFlashActive = false;
      }

    } else {

      // strobe mode: flicker on and off multiple times
      if (invertStrobePhase === 0) {

        // on phase: draw invert overlay
        drawingContext.save();

        // DIFFERENCE blend: white overlay inverts every pixel beneath it
        drawingContext.globalCompositeOperation = "difference";

        noStroke();
        fill(255, 255, 255, 255);

        rect(0, 0, width, height);

        drawingContext.restore();

      }

      invertFlashTimer--;

      if (invertFlashTimer <= 0) {

        if (invertStrobePhase === 0) {
          // switch to off phase
          invertStrobePhase = 1;
          invertFlashTimer = invertStrobeOffFrames;
          invertStrobeCount++;
        } else {
          // switch back to on phase, or end if done
          if (invertStrobeCount >= invertStrobeTotal) {
            invertFlashActive = false;
          } else {
            invertStrobePhase = 0;
            invertFlashTimer = invertStrobeOnFrames;
          }
        }
      }
    }
  }
}





function initBloodMist() {
  mistLayer = createGraphics(width, height);
  mistLayer.clear();
  mistLayer.noSmooth();

  mistCols = floor(width / mistGridSize);
  mistRows = floor(height / mistGridSize);

  mistParticles = [];
  mistFlowField = [];

  for (let i = 0; i < mistCount; i++) {
    mistParticles.push(new MistParticle());
  }
}

function drawBloodMist() {
  if (!mistLayer || !pns) return;

  mistLayer.noStroke();

  // slowly erase old trails with a transparent background
  mistLayer.fill(24, 18, 35, 10);
  mistLayer.rect(0, 0, width, height);

  let yoff = 0;

  for (let y = 0; y < mistRows; y++) {
    let xoff = 0;

    for (let x = 0; x < mistCols; x++) {
      let index = x + y * mistCols;

      let n = pns.genNoise(xoff, yoff, mistZoff, 4, 0.5);
      let angle = n * TWO_PI * 2;

      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.12);

      mistFlowField[index] = v;

      xoff += 0.045;
    }

    yoff += 0.045;
  }

  mistZoff += mistZstep;

  for (let p of mistParticles) {
    p.follow(mistFlowField);
    p.update();
    p.edges();
    p.show();
  }

  image(mistLayer, 0, 0);
}

class MistParticle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
  }

  follow(vectors) {
    let x = floor(this.pos.x / mistGridSize);
    let y = floor(this.pos.y / mistGridSize);

    if (x < 0 || x >= mistCols || y < 0 || y >= mistRows) return;

    let index = x + y * mistCols;
    let force = vectors[index];

    if (force) {
      this.acc.add(force);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(mistMaxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    mistLayer.stroke(120, 0, 15, 18);
    mistLayer.strokeWeight(2);

    mistLayer.line(
      this.prevPos.x,
      this.prevPos.y,
      this.pos.x,
      this.pos.y
    );

    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    let wrapped = false;

    if (this.pos.x > width) {
      this.pos.x = 0;
      wrapped = true;
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      wrapped = true;
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      wrapped = true;
    }

    if (this.pos.y < 0) {
      this.pos.y = height;
      wrapped = true;
    }

    if (wrapped) {
      this.updatePrev();
    }
  }
}