//opening scene: church

let choiceTransition = false;
let choiceTransitionType = ""; // "Confess" or "Deceive"
let choiceTransitionTimer = 0;
let choiceTransitionDuration = 60;
let buttonBar;

let scene = "main";
let hasChosen = false;

// glimmering crosses scattered across the background
let crosses = [];
// Opening music
let openingSong;
// Bad ending music
let badSong;
// Good eneding music
let goodSong;
// Analyse music volume
let analyser;

let fft;

// Play button
let playButton;

// Pause button
let pauseButton;

// restart button
let restartButton;
// to track if music has started for proper play/pause functionality
let musicStarted = false;

// images
let openingNun;
let goodNun;
let badNun;

let myFont;
let confessProgress = 0;
let deceiveProgress = 0;
let holyFloatItems = [];

// preload the music
function preload() {
  //sound
  openingSong = loadSound("assets/ES_The Haunted - Luella Gren.wav");
  badSong = loadSound("assets/ES_House of a Hundred Rooms - Dream Cave.wav");
  goodSong = loadSound("assets/ES_Ethos - Johannes Bornlof.wav");
  //images
  openingNun = loadImage("image/nun1.png");
  badNun = loadImage("image/nun2.png");
  goodNun = loadImage("image/angel.png");
  //font
  myFont = loadFont("font/Micro.otf");
  

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // set the frame rate to 30 FPS
  frameRate(30);
  noSmooth();
  // load pixel data for the nun images so we can do pixel-level manipulation later
  openingNun.loadPixels();
  goodNun.loadPixels();
  badNun.loadPixels();

  colorMode(RGB);

  // noCursor();
  textFont(myFont);

   // Main scene initialize
  initCrosses();
  initHolyFloatItems();

  // Confess1 initialize
  initFlowLayer();

  // Confess2 initialize
  initWings();

  // Deceive1 initialize
  initBloodOverlay();

  // Deceive2 initialize
  pns = new perlinNoise();
  pns.init();
  // initialize bad ending
  initBloodMist();
  randomiseCrosses();
  setInterval(randomiseCrosses, 2000);
  createEyes(7);

  // amplitude analyser for music-reactive elements
  analyser = new p5.Amplitude();
  analyser.setInput(openingSong);
  // fft setting for bad ending
  fft = new p5.FFT();
  fft.setInput(badSong);

  //chatgpt helped create the button bar to properly position the two buttons together and make it reponsive to window resizing 
  buttonBar = createDiv();
  buttonBar.position(width * 0.02, height * 0.03);
  buttonBar.style("display", "flex");
  buttonBar.style("gap", "8px");
  buttonBar.style("align-items", "center");
  buttonBar.style("cursor", "none");
  // play/pause button
  playButton = createButton("Play");
  playButton.parent(buttonBar);
  playButton.mousePressed(playPause);
  playButton.style("cursor", "none");

  // restart button
  restartButton = createButton("Restart");
  restartButton.parent(buttonBar);
  restartButton.mousePressed(resetGame);
  restartButton.style("cursor", "none");
  restartButton.hide();
  // randomly trigger the screen invert effect every 4-8 seconds to add visual interest
  setTimeout(triggerInvertFlash, random(4000, 8000));

}

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

// stained glass
// colour palette for the stained glass windows
const glassColour = {
  'n': null,
  'wf': [33, 31, 44],    // window frame: charcoal
  'b1': [41,  60, 171],  // deep blue
  'b2': [45, 103, 168],  // cerulean blue
  'b3': [143, 214, 240], // ice Blue
};

const glass = [
  [  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 1
  [  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n', 'wf',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 2
  [  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 3
  [  'n',  'n',  'n',  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 4
  [  'n',  'n',  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'b1', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 5
  [  'n',  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'b3', 'b1', 'b2', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n',  'n' ], // row 6
  [  'n',  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'b1', 'b3', 'b1', 'b2', 'b1', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n',  'n' ], // row 7
  [  'n',  'n',  'n',  'n', 'wf', 'wf', 'b2', 'wf', 'wf', 'b2', 'b2', 'b3', 'wf', 'wf', 'b1', 'wf', 'wf',  'n',  'n',  'n',  'n' ], // row 8
  [  'n',  'n',  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b2', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n',  'n' ], // row 9
  [  'n',  'n',  'n', 'wf', 'wf', 'wf', 'b3', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b2', 'wf', 'wf', 'wf', 'wf',  'n',  'n',  'n' ], // row 10
  [  'n',  'n',  'n', 'wf', 'wf', 'b2', 'b3', 'b2', 'wf', 'wf', 'b3', 'wf', 'wf', 'b1', 'b1', 'b2', 'wf', 'wf',  'n',  'n',  'n' ], // row 11
  [  'n',  'n', 'wf', 'wf', 'wf', 'b1', 'b1', 'b3', 'b3', 'wf', 'b1', 'wf', 'b2', 'b3', 'b3', 'b2', 'wf', 'wf', 'wf',  'n',  'n' ], // row 12
  [  'n',  'n', 'wf', 'wf', 'wf', 'wf', 'b1', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b3', 'wf', 'wf', 'wf', 'wf',  'n',  'n' ], // row 13
  [  'n',  'n', 'wf', 'b3', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b1', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b1', 'wf',  'n',  'n' ], // row 14
  [  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b3', 'b2', 'b2', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n' ], // row 15
  [  'n', 'wf', 'wf', 'wf', 'b1', 'b2', 'wf', 'wf', 'wf', 'b3', 'b1', 'b2', 'wf', 'wf', 'wf', 'b3', 'b2', 'wf', 'wf', 'wf',  'n' ], // row 16
  [  'n', 'wf', 'wf', 'b3', 'b3', 'b1', 'b2', 'wf', 'b2', 'b3', 'b2', 'b2', 'b1', 'wf', 'b3', 'b3', 'b1', 'b1', 'wf', 'wf',  'n' ], // row 17
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b2', 'b1', 'wf', 'b1', 'b2', 'b1', 'b2', 'b2', 'wf', 'b3', 'b3', 'b3', 'b1', 'wf', 'wf',  'n' ], // row 18
  [  'n', 'wf', 'wf', 'b1', 'b3', 'b3', 'b3', 'wf', 'b2', 'b1', 'b3', 'b1', 'b1', 'wf', 'b3', 'b1', 'b1', 'b2', 'wf', 'wf',  'n' ], // row 19
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b3', 'b3', 'wf', 'b1', 'b1', 'b3', 'b1', 'b1', 'wf', 'b1', 'b3', 'b1', 'b2', 'wf', 'wf',  'n' ], // row 20
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b2', 'b3', 'wf', 'b1', 'b3', 'b3', 'b3', 'b3', 'wf', 'b1', 'b1', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 21
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b2', 'b1', 'wf', 'b1', 'b3', 'b1', 'b3', 'b3', 'wf', 'b3', 'b3', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 22
  [  'n', 'wf', 'wf', 'b3', 'b1', 'b2', 'b2', 'wf', 'b1', 'b2', 'b2', 'b3', 'b2', 'wf', 'b1', 'b3', 'b3', 'b3', 'wf', 'wf',  'n' ], // row 23
  [  'n', 'wf', 'wf', 'b3', 'b3', 'b1', 'b1', 'wf', 'b2', 'b2', 'b1', 'b3', 'b2', 'wf', 'b1', 'b2', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 24
  [  'n', 'wf', 'wf', 'b3', 'b3', 'b2', 'b1', 'wf', 'b2', 'b3', 'b2', 'b2', 'b1', 'wf', 'b2', 'b2', 'b3', 'b2', 'wf', 'wf',  'n' ], // row 25
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b1', 'b3', 'wf', 'b1', 'b1', 'b1', 'b2', 'b2', 'wf', 'b2', 'b3', 'b2', 'b2', 'wf', 'wf',  'n' ], // row 26
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b2', 'b1', 'wf', 'b3', 'b1', 'b1', 'b2', 'b2', 'wf', 'b3', 'b3', 'b2', 'b1', 'wf', 'wf',  'n' ], // row 27
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b2', 'b3', 'wf', 'b2', 'b1', 'b2', 'b2', 'b2', 'wf', 'b2', 'b1', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 28
  [  'n', 'wf', 'wf', 'b3', 'b1', 'b2', 'b3', 'wf', 'b2', 'b3', 'b1', 'b1', 'b2', 'wf', 'b1', 'b1', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 29
  [  'n', 'wf', 'wf', 'b1', 'b3', 'b2', 'b2', 'wf', 'b2', 'b2', 'b2', 'b1', 'b1', 'wf', 'b2', 'b2', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 30
  [  'n', 'wf', 'wf', 'b3', 'b3', 'b3', 'b3', 'wf', 'b2', 'b3', 'b3', 'b2', 'b2', 'wf', 'b1', 'b2', 'b3', 'b3', 'wf', 'wf',  'n' ], // row 31
  [  'n', 'wf', 'wf', 'b2', 'b3', 'b1', 'b3', 'wf', 'b2', 'b2', 'b1', 'b2', 'b3', 'wf', 'b2', 'b2', 'b2', 'b1', 'wf', 'wf',  'n' ], // row 32
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b2', 'b3', 'wf', 'b3', 'b2', 'b2', 'b2', 'b2', 'wf', 'b1', 'b2', 'b3', 'b2', 'wf', 'wf',  'n' ], // row 33
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b3', 'b2', 'wf', 'b2', 'b3', 'b3', 'b2', 'b2', 'wf', 'b1', 'b3', 'b3', 'b3', 'wf', 'wf',  'n' ], // row 34
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b3', 'b3', 'wf', 'b2', 'b2', 'b1', 'b2', 'b2', 'wf', 'b3', 'b3', 'b3', 'b3', 'wf', 'wf',  'n' ], // row 35
  [  'n', 'wf', 'wf', 'b1', 'b1', 'b2', 'b2', 'wf', 'b1', 'b3', 'b3', 'b1', 'b2', 'wf', 'b3', 'b1', 'b2', 'b1', 'wf', 'wf',  'n' ], // row 36
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b1', 'b2', 'wf', 'b1', 'b1', 'b3', 'b3', 'b3', 'wf', 'b1', 'b2', 'b1', 'b1', 'wf', 'wf',  'n' ], // row 37
  [  'n', 'wf', 'wf', 'b2', 'b3', 'b2', 'b1', 'wf', 'b1', 'b1', 'b3', 'b3', 'b2', 'wf', 'b1', 'b2', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 38
  [  'n', 'wf', 'wf', 'b2', 'b2', 'b2', 'b1', 'wf', 'b1', 'b1', 'b1', 'b1', 'b1', 'wf', 'b3', 'b2', 'b3', 'b1', 'wf', 'wf',  'n' ], // row 39
  [  'n', 'wf', 'wf', 'b3', 'b3', 'b1', 'b1', 'wf', 'b3', 'b1', 'b3', 'b2', 'b2', 'wf', 'b1', 'b2', 'b3', 'b1', 'wf', 'wf',  'n' ], // row 40
  [  'n', 'wf', 'wf', 'b3', 'b2', 'b3', 'b1', 'wf', 'b2', 'b2', 'b2', 'b1', 'b3', 'wf', 'b2', 'b3', 'b3', 'b3', 'wf', 'wf',  'n' ], // row 41
  [  'n', 'wf', 'wf', 'b1', 'b2', 'b3', 'b3', 'wf', 'b1', 'b3', 'b1', 'b1', 'b1', 'wf', 'b1', 'b1', 'b1', 'b3', 'wf', 'wf',  'n' ], // row 42
  [  'n', 'wf', 'wf', 'b1', 'wf', 'b3', 'b3', 'wf', 'b2', 'b3', 'b3', 'b1', 'b3', 'wf', 'b1', 'b1', 'wf', 'b1', 'wf', 'wf',  'n' ], // row 43
  [  'n', 'wf', 'wf', 'b1', 'wf', 'wf', 'b3', 'wf', 'b3', 'b3', 'b2', 'b3', 'b3', 'wf', 'b2', 'wf', 'wf', 'b1', 'wf', 'wf',  'n' ], // row 44
  [  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n' ], // row 45
  [  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b3', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n' ], // row 46
  [  'n', 'wf', 'wf', 'b3', 'wf', 'b1', 'wf', 'wf', 'wf', 'b3', 'b2', 'b3', 'wf', 'wf', 'wf', 'b1', 'wf', 'b3', 'wf', 'wf',  'n' ], // row 47
  [  'n', 'wf', 'wf', 'wf', 'b1', 'wf', 'wf', 'wf', 'b3', 'b1', 'b2', 'b1', 'b3', 'wf', 'wf', 'wf', 'b1', 'wf', 'wf', 'wf',  'n' ], // row 48
  [  'n', 'wf', 'wf', 'b2', 'wf', 'b3', 'wf', 'wf', 'wf', 'b3', 'b2', 'b3', 'wf', 'wf', 'wf', 'b3', 'wf', 'b2', 'wf', 'wf',  'n' ], // row 49
  [  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'b3', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n' ], // row 50
  [  'n', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf', 'wf',  'n' ], // row 51
  [  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n' ], // row 52
];

// get the window's width and height, then set it to display 3 on the wall
const PW = glass[0].length;
const PH = glass.length;
const cols = 3;

// ─────────────────────────────────────────────

// candles in the foreground
// colour palette for the candles
const candlesColour = {
  'n':  null,
  'cw': [88, 88, 88],    // candlewick 
  // flame
  'f0': [252, 240, 158], // light yellow
  'f1': [252, 223, 37],  // golden yellow
  'f2': [247, 197, 0],   // gold
  'f3': [251, 147, 2],   // orange
  // grey candle
  'g1': [234, 234, 234], // off white
  'g2': [224, 217, 219], // light grey
  'g3': [181, 164, 167], // ash mauve
  'g4': [169, 143, 146], // smoky mauve
  'g5': [161, 130, 135], // dark mauve
  'g6': [131,  97, 102], // muted plum
  // beige candle
  'b1': [254, 254, 204], // pale ivory
  'b2': [255, 238, 161], // pale gold
  'b3': [245, 195, 4],   // amber
  'b4': [247, 158, 35],  // orange
  // candleholder
  'h1': [247, 158, 35],  // dark amber
  'h2': [173, 111, 0],   // matallic bronze
  'h3': [164, 101, 0],   // cider
  'h4': [119,  71, 3],   // clay
  'h5': [ 80,  58, 1],   // espresso brown
  'h6': [ 62,  43, 1],   // wood brown
  'h7': [ 36,  22, 0],   // chocolate brown
};

const candles = [
  [ 'n',  'n',  'n',  'n',  'n',  'f2', 'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n'  ], // row 1
  [ 'n',  'n',  'n',  'n',  'f2', 'f1', 'f2', 'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n',  'n'  ], // row 2
  [ 'n',  'n',  'n',  'n',  'f3', 'f1', 'f2', 'n',  'n',  'n',  'n',  'f2', 'n',  'n',  'n',  'n',  'n'  ], // row 3
  [ 'n',  'n',  'n',  'n',  'f3', 'f0', 'f3', 'n',  'n',  'n',  'f2', 'f1', 'f2', 'n',  'n',  'n',  'n'  ], // row 4
  [ 'n',  'n',  'n',  'n',  'n',  'cw', 'n',  'n',  'n',  'n',  'f3', 'f1', 'f2', 'n',  'n',  'n',  'n'  ], // row 5
  [ 'n',  'n',  'n',  'g1', 'g1', 'g2', 'g2', 'g2', 'n',  'n',  'f3', 'f0', 'f3', 'n',  'n',  'n',  'n'  ], // row 6
  [ 'n',  'n',  'g1', 'g2', 'g6', 'g1', 'g2', 'g6', 'g2', 'n',  'n',  'cw', 'n',  'n',  'n',  'n',  'n'  ], // row 7
  [ 'n',  'n',  'g2', 'g2', 'g6', 'g1', 'g6', 'g6', 'b1', 'b1', 'b1', 'b2', 'b2', 'b2', 'b2', 'n',  'n'  ], // row 8
  [ 'n',  'n',  'g2', 'g6', 'g5', 'g1', 'g6', 'b1', 'b1', 'b2', 'b2', 'b2', 'b4', 'b1', 'b2', 'b2', 'n'  ], // row 9
  [ 'n',  'n',  'g2', 'g4', 'g4', 'g5', 'g6', 'b1', 'b2', 'b3', 'b3', 'b3', 'b4', 'b4', 'b1', 'b2', 'n'  ], // row 10
  [ 'n',  'n',  'g2', 'g3', 'g4', 'g5', 'g6', 'b2', 'b3', 'b2', 'b2', 'b3', 'b3', 'b4', 'b4', 'b1', 'n'  ], // row 11
  [ 'n',  'n',  'n',  'g3', 'g4', 'g5', 'g6', 'g6', 'b3', 'b1', 'b2', 'b3', 'b3', 'b4', 'b4', 'b1', 'n'  ], // row 12
  [ 'n',  'n',  'n',  'g3', 'g4', 'g5', 'g6', 'g6', 'b3', 'b1', 'b2', 'b3', 'b3', 'b4', 'b4', 'n',  'n'  ], // row 13
  [ 'n',  'n',  'n',  'g3', 'g4', 'g5', 'g6', 'g6', 'b3', 'b1', 'b2', 'b3', 'b3', 'b4', 'b4', 'n',  'n'  ], // row 14
  [ 'n',  'n',  'g2', 'g3', 'g4', 'g5', 'g6', 'b1', 'b3', 'b2', 'b3', 'b3', 'b3', 'b4', 'b4', 'b2', 'n'  ], // row 15
  [ 'n',  'g2', 'g2', 'g3', 'g4', 'g5', 'g6', 'b2', 'b3', 'b3', 'b3', 'b3', 'b3', 'b4', 'b1', 'b1', 'b2' ], // row 16
  [ 'h4', 'h2', 'h1', 'h1', 'h1', 'h1', 'h2', 'h1', 'h2', 'h3', 'h3', 'h3', 'h3', 'h4', 'h4', 'h3', 'h4' ], // row 17
  [ 'n',  'h5', 'h5', 'h5', 'h5', 'h5', 'h6', 'h6', 'h6', 'h6', 'h6', 'h7', 'h7', 'h7', 'h7', 'h7', 'n'  ], // row 18
  [ 'n',  'h2', 'h2', 'h2', 'h2', 'h2', 'h3', 'h3', 'h3', 'h3', 'h3', 'h4', 'h4', 'h4', 'h4', 'h4', 'n'  ], // row 19
];

const CW = candles[0].length; 
const CH = candles.length;


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
      const col   = mirror ? (CW - 1 - c) : c;
      const color = candlesColour[candles[r][col]];
      if (!color) continue;
      fill(color[0], color[1], color[2]);
      rect(x0 + c * ps, y0 + r * ps, ps + 0.5, ps + 0.5);
    }
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

// spiderweb in the top-left corner
// colour palette for the spiderweb
const webColour = {
  'n': null,
  'w': [220, 220, 220], // off white
};

const web = [
  [ 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w' ], // row 1
  [ 'w', 'w', 'n', 'w', 'w', 'n', 'n', 'w', 'n', 'n', 'w', 'n', 'n', 'w', 'n', 'n', 'n' ], // row 2
  [ 'w', 'n', 'w', 'n', 'w', 'w', 'w', 'n', 'n', 'w', 'n', 'n', 'w', 'n', 'n', 'n', 'n' ], // row 3
  [ 'w', 'w', 'n', 'w', 'n', 'n', 'n', 'w', 'w', 'w', 'n', 'n', 'n', 'w', 'n', 'n', 'n' ], // row 4
  [ 'w', 'n', 'w', 'n', 'w', 'w', 'n', 'w', 'n', 'n', 'w', 'w', 'n', 'w', 'n', 'n', 'n' ], // row 5
  [ 'w', 'n', 'n', 'w', 'n', 'w', 'w', 'n', 'n', 'n', 'w', 'n', 'w', 'w', 'w', 'n', 'n' ], // row 6
  [ 'w', 'n', 'w', 'w', 'n', 'n', 'w', 'w', 'n', 'w', 'n', 'n', 'n', 'n', 'w', 'w', 'n' ], // row 7
  [ 'w', 'w', 'n', 'n', 'w', 'w', 'n', 'n', 'w', 'w', 'n', 'n', 'n', 'w', 'n', 'n', 'n' ], // row 8
  [ 'w', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'w', 'n', 'n', 'n', 'n' ], // row 9
  [ 'w', 'n', 'w', 'n', 'w', 'n', 'n', 'w', 'w', 'n', 'w', 'n', 'w', 'n', 'n', 'n', 'n' ], // row 10
  [ 'w', 'w', 'n', 'w', 'w', 'n', 'w', 'n', 'n', 'n', 'w', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 11
  [ 'w', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'w', 'n', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 12
  [ 'w', 'n', 'n', 'w', 'n', 'n', 'w', 'n', 'w', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n' ], // row 13
  [ 'w', 'n', 'w', 'n', 'w', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n' ], // row 14
  [ 'w', 'w', 'n', 'n', 'n', 'w', 'w', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n' ], // row 15
  [ 'w', 'n', 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n' ], // row 16
  [ 'w', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n' ], // row 17
];

const WW = web[0].length; 
const WH = web.length;


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

// spider in the top-right corner
// colour palette
const spiderColour = {
  'n': null,
  'w': [220, 220, 220], // spiderweb
  's': [ 40,  25,  98], // body
  'e': [176,  12,  12], // eyes
};

const spider = [
  [ 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 1
  [ 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 2
  [ 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 3
  [ 'n', 'n', 'n', 'n', 'n', 'w', 'n', 'n', 'n', 'n', 'n' ], // row 4
  [ 'n', 's', 's', 'n', 'n', 'w', 'n', 'n', 's', 's', 'n' ], // row 5
  [ 'n', 'n', 'n', 's', 'n', 'w', 'n', 's', 'n', 'n', 'n' ], // row 6
  [ 'n', 's', 's', 's', 's', 's', 's', 's', 's', 's', 'n' ], // row 7
  [ 's', 'n', 'n', 's', 'e', 's', 'e', 's', 'n', 'n', 's' ], // row 8
  [ 'n', 'n', 's', 'n', 's', 'n', 's', 'n', 's', 'n', 'n' ], // row 9
  [ 'n', 's', 'n', 'n', 's', 'n', 's', 'n', 'n', 's', 'n' ], // row 10
  [ 'n', 's', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 's', 'n' ], // row 11
];

const SW = spider[0].length; 
const SH = spider.length;


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
function drawMainScene() {

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

  openingNun.loadPixels();

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
  drawChoiceLayer();
}

function draw() {

if (
    scene === "Confess2" ||
    scene === "Deceive2"
  ) {

    cursor();

    buttonBar.style("cursor", "default");
    playButton.style("cursor", "default");
    restartButton.style("cursor", "default");

  } else {

    noCursor();

    buttonBar.style("cursor", "none");
    playButton.style("cursor", "none");
    restartButton.style("cursor", "none");

  }

  if (scene === "main") {

    switchMusic(openingSong);
    drawMainScene();

  } else if (scene === "Confess1") {

    drawConfess1();

  } else if (scene === "Confess2") {

    switchMusic(goodSong);
    drawConfess2();

  } else if (scene === "Deceive1") {

    drawDeceive1();

  } else if (scene === "Deceive2") {

    switchMusic(badSong);
    drawDeceive2();

  }

  if (
    scene === "Confess2" ||
    scene === "Deceive2"
  ) {

    restartButton.show();

  } else {

    restartButton.hide();

  }

}

let currentSong = null;

function switchMusic(song) {

  if (currentSong !== song) {

    if (currentSong && currentSong.isPlaying()) {

      currentSong.stop();

    }

    currentSong = song;

    analyser.setInput(currentSong);

    if (fft) {

      fft.setInput(currentSong);

    }

    // Only play music if the user has already started it
    if (musicStarted) {

      currentSong.loop();

    }

  }

}

// resize and redraw when browser window changes size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // button position
  if (buttonBar) {
    buttonBar.position(width * 0.02, height * 0.03);
  }
  // restartButton.position(width * 0.11, height * 0.03);

  // Main scene / Confess1 / Deceive1 use crosses
  initCrosses();
  // Confess1 Perlin overlay
  initFlowLayer();
  // Confess2 wings
  initWings();
  // Deceive1 blood overlay
  initBloodOverlay();

  // Deceive2 random crosses and eyes
  randomiseCrosses();
  createEyes(7);
  initBloodMist();
}

// Play or pause background music
// Play or pause the current background music
function playPause() {

  // Start audio on the first click
  if (!musicStarted) {

    userStartAudio();

    if (!currentSong) {

      currentSong = openingSong;

      analyser.setInput(currentSong);

      if (fft) {

        fft.setInput(currentSong);

      }

    }

    currentSong.loop();

    musicStarted = true;

    playButton.html("Pause");

    return;

  }

  // Pause music
  if (currentSong && currentSong.isPlaying()) {

    currentSong.pause();

    playButton.html("Play");

  } 
  
  // Resume music
  else if (currentSong) {

    currentSong.loop();

    playButton.html("Pause");

  }

}

// ─────────────────────────────────────────────

// Mouse choice layer

// ─────────────────────────────────────────────

function drawChoiceLayer() {

  let titleSize = constrain(width * 0.06, 32, 90);

  let confessX = width * 0.28;
  let deceiveX = width * 0.72;
  let optionY = height * 0.5;

  // only check hover progress before the transition starts
  if (!choiceTransition) {
    updateHoverProgress(confessX, deceiveX, optionY, titleSize);
  }

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

  // trigger the full-screen transition when the charge bar is full
  if (choiceTransition) {

    drawChoiceTransitionEffect();

    choiceTransitionTimer++;

    if (choiceTransitionTimer > choiceTransitionDuration) {

      choiceTransition = false;
      choiceTransitionTimer = 0;

      if (choiceTransitionType === "Confess1") {
        Confess1Timer = 0;
        initFlowLayer();
        scene = "Confess1";
      }

      if (choiceTransitionType === "Deceive1") {
        Deceive1Timer = 0;
        scene = "Deceive1";
      }

      confessProgress = 0;
      deceiveProgress = 0;
    }
  }

  drawPixelCursor();
}

function drawChoiceTransitionEffect() {
  noStroke();
  rectMode(CENTER);

  let progress = choiceTransitionTimer / choiceTransitionDuration;

  if (choiceTransitionType === "Confess") {

    // expand holy light across the entire screen
    for (let i = 0; i < 180; i++) {
      let px = random(width);
      let py = random(height);
      let s = random(4, 14) * (1 + progress);

      if (random() < 0.6) {
        fill(255, 230, 120, random(40, 130));
      } else {
        fill(255, 160, 210, random(30, 100));
      }

      rect(px, py, s, s);
    }

    // central white glow
    fill(255, 245, 210, 120 * progress);
    ellipse(width / 2, height / 2, width * progress * 1.4, height * progress * 1.4);
  }

  if (choiceTransitionType === "Deceive") {

    // blood-red pixels fill the entire screen
    for (let i = 0; i < 220; i++) {
      let px = random(width);
      let py = random(height);
      let s = random(4, 18) * (1 + progress);

      fill(255, 0, 25, random(40, 140));
      rect(px, py, s, s);
    }

    // red flah
    fill(120, 0, 15, 90 * progress);
    rect(width / 2, height / 2, width, height);
  }

  rectMode(CORNER);
}

// control hover charge progress

function updateHoverProgress(confessX, deceiveX, optionY, titleSize) {

  textFont(myFont);

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

  if (!hasChosen && confessProgress >= 1) {

  hasChosen = true;

  choiceTransition = true;
  choiceTransitionType = "Confess1";
  choiceTransitionTimer = 0;
  
  confessProgress = 1;
  deceiveProgress = 0;

  }

  if (!hasChosen && deceiveProgress >= 1) {

  hasChosen = true;

  choiceTransition = true;
  choiceTransitionType = "Deceive1";
  choiceTransitionTimer = 0;

  confessProgress = 0;
  deceiveProgress = 1;

  }

}

function drawOptionEffect(label, x, y, size, progress, type) {

  if (type === "holy") {

    drawHolyHoverEffect(x, y, size, progress);

  } else {

    drawBloodHoverEffect(x, y, size, progress);

  }

  drawOptionTextFill(label, x, y, size, progress, type);

}

// text charge fill effect

function drawOptionTextFill(label, x, y, size, progress, type) {

  push();

  textFont(myFont);

  textAlign(CENTER, CENTER);

  textSize(size);

  let textW = textWidth(label);

  let textH = size * 1.1;

  fill(0, 180);

  text(label, x + 5, y + 5);

  fill(255);

  text(label, x, y);

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

// Confess: show holy light near the text while charging, then float small elements across the screen when fully charged

function drawHolyHoverEffect(x, y, size, progress) {

  if (progress <= 0.02) return;

  rectMode(CENTER);

  noStroke();

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

    for (let i = 0; i < 3; i++) {

      let px = x + random(-size * 1.7, size * 1.7);

      let py = y + random(-size * 0.9, size * 0.9);

      let u = size * 0.05 * (1 + progress);

      fill(255, 235, 140, 120 * progress);

      rect(px, py, u, u * 4);

      rect(px, py, u * 4, u);

    }

  } else {

    drawHolyFloatingItems();

  }

  rectMode(CORNER);

}

// Deceive: spread red pixels

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

  rectMode(CORNER);

}

// initialise floating elements after Confess is fully charged

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

// floating elements after Confess is fully charged

function drawHolyFloatingItems() {

  rectMode(CORNER);

  noStroke();

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

  rectMode(CORNER);

}

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

// pixel sword cursor

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

  // move the sword body down so the cursor point is on the sword tip
  translate(0, 8 * u);

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

  fill(bladeLight);

  for (let gy = -6; gy <= 0; gy++) {

    pixelBlock(-1, gy, u);

  }

  pixelBlock(0, -7, u);

  fill(bladeShadow);

  for (let gy = -6; gy <= 1; gy++) {

    pixelBlock(1, gy, u);

  }

  fill(guardColor);

  for (let gx = -4; gx <= 4; gx++) {

    pixelBlock(gx, 2, u);

  }

  fill(bladeLight);

  pixelBlock(-4, 2, u);

  pixelBlock(4, 2, u);

  fill(handleMain);

  pixelBlock(0, 3, u);

  pixelBlock(0, 4, u);

  pixelBlock(0, 5, u);

  fill(guardColor);

  pixelBlock(-1, 3, u);

  pixelBlock(1, 3, u);

  pixelBlock(-1, 5, u);

  pixelBlock(1, 5, u);

  fill(guardColor);

  for (let gx = -2; gx <= 2; gx++) {

    pixelBlock(gx, 6, u);

  }

  pop();

  rectMode(CORNER);

}

function pixelBlock(gx, gy, u) {

  rect(gx * u, gy * u, u, u);

}

// -————————RESET！！！！！！AND RESTART！！！！！！！！————————————————————————
// ————————————————————————————————————————————————————————————————————————

function resetGame() {

  scene = "main";
  hasChosen = false;

  confessProgress = 0;
  deceiveProgress = 0;

  choiceTransition = false;
  choiceTransitionType = "";
  choiceTransitionTimer = 0;

  Confess1Timer = 0;
  Deceive1Timer = 0;
  Confess2Timer = 0;
  Deceive2Timer = 0;

  Confess2sceneTransitionAlpha = 255;
  Deceive2sceneTransitionAlpha = 255;

  // reset opening / choice scene
  initCrosses();
  initHolyFloatItems();

  // reset Confess1
  initFlowLayer();

  // reset Confess2
  initWings();

  // reset Deceive1
  initBloodOverlay();

  // reset Deceive2
  scaryTexts = [];
  badCrosses = [];
  eyes = [];

  randomiseCrosses();
  createEyes(7);
  initBloodMist();

  if (pns) {
    pns = new perlinNoise();
    pns.init();
  }

  invertFlashActive = false;
  invertFlashTimer = 0;

  // reset music to opening song
  if (currentSong) {
    currentSong.stop();
  }

  openingSong.stop();
  goodSong.stop();
  badSong.stop();

  currentSong = openingSong;

  analyser.setInput(currentSong);

  if (fft) {
    fft.setInput(currentSong);
  }

  if (musicStarted) {
    currentSong.loop();
  }

  playButton.html("Pause");

}