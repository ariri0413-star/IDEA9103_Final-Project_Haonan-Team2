//opening scene: church

// glimmering crosses scattered across the background
let crosses = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noSmooth();
  initCrosses();
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
function draw() {
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

  // horizontal position of the left candles
  drawCandleGroup(marginX + cellW * 0.131, candleBaseY, pixSize, false);

  // right side mirroring
  drawCandleGroup(marginX + cellW * 2.869, candleBaseY, pixSize, true);

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
}

// resize and redraw when browser window changes size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}