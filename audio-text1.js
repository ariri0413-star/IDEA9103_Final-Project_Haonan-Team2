let openingSong;
let badSong;
let goodSong;

let badCrosses = [];
let scaryTexts = [];
let textPool = [
  "God knows the truth",
  "GUILTY",
  "LIAR"
];

let analyser;
let fft;
let playButton;

function preload() {
  openingSong = loadSound("assets/ES_House of a Hundred Rooms - Dream Cave.wav");
  badSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  goodSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // create 10 random crosses
  randomiseCrosses();
  // refresh every 2 seconds
  setInterval(randomiseCrosses, 2000);

  analyser = new p5.Amplitude();
  analyser.setInput(openingSong);
  fft = new p5.FFT();
  fft.setInput(openingSong);

  playButton = createButton("Play/Pause");
  playButton.position(width * 0.02, height * 0.03);
  playButton.mousePressed(playPause);
}

// colour palette for heart
const heartColour = {
  'n': null,
  'y1': [252, 218, 123],    // ring
  'y2': [254, 182, 5],  // ring
  'y3': [248, 168, 18],  // ring
  'r1': [250, 5, 6], // heart
  'r2': [252, 124, 124], // heart
  'r3':[253, 197, 200], //heart
  'r4':[254, 118, 119], //heart
  'r5':[255, 22, 21], //heart
  'r6':[197, 6, 6], //heart
};

const heart = [
  ['n','n','n','y1','y2','y3','n','n','n'], // row 1
  ['n','n','n','n','n','n','n','n','n'],    // row 2
  ['n','r1','r1','n','n','n','r1','r6','n'], // row 3
  ['r1','r2','r2','r1','n','r1','r1','r1','r6'], // row 4
  ['r1','r2','r3','r3','r1','r1','r1','r1','r6'], // row 5
  ['n','r1','r3','r4','r1','r1','r1','r6','n'], // row 6
  ['n','n','r1','r1','r1','r1','r6','n','n'], // row 7
  ['n','n','n','r1','r1','r6','n','n','n'], // row 8
  ['n','n','n','n','r6','n','n','n','n'], // row 9
];

const HW = heart[0].length;
const HH = heart.length;

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

// ——————————————————————————————————————————————
// Chatgpt helped me with the code below, generating a mirror heart.

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

// ——————————————————————————————————————————————————

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
  
    background(10, 10, 10);
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
// ————————————————————————————————————————————————————
    let rms = analyser.getLevel();

    
    let heartMove = rms * 200;

    let heartSize = pixSize;

    let leftHeartX = width * 0.03;
    // ChatGPT helped calculated the position of the right heart, making it mirror the left one.
    let rightHeartX = width - leftHeartX - HW * heartSize;

    let heartY = height * 0.45 - heartMove;

    drawHeart(leftHeartX, heartY, heartSize, false);
    drawHeart(rightHeartX, heartY, heartSize, true);
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
   if (high > 80) {

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
      random(0, 50),
      random(0, 50),
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
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

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