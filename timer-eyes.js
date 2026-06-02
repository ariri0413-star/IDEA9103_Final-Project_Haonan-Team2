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

let eyes = [];

const pupilColours = [
  { d: [55, 123, 31], g: [85, 180, 53] },
  { d: [35, 90, 160], g: [90, 170, 255] },
  { d: [120, 50, 150], g: [210, 130, 255] },
  { d: [130, 70, 20], g: [220, 140, 60] },
  { d: [120, 20, 40], g: [240, 80, 100] },
  { d: [90, 70, 160], g: [160, 150, 255] },
  { d: [20, 120, 120], g: [90, 230, 220] }
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  createEyes(7);
}

function draw() {
  background(12, 10, 22);

  for (let eye of eyes) {
    if (frameCount % 40 === 0) {
      eye.pupilOffsetX = random(-1.5, 1.5) * eye.ps;
      eye.pupilOffsetY = random(-1.2, 1.2) * eye.ps;
    }

    drawPixelTemplate(eyeWhiteTemplate, eye.x, eye.y, eye.ps, eyeColour);

    const customPupilColour = {
      ...eyeColour,
      d: eye.pupilColour.d,
      g: eye.pupilColour.g
    };

    drawPixelTemplate(
      pupilTemplate,
      eye.x + eye.pupilOffsetX,
      eye.y + eye.pupilOffsetY,
      eye.ps,
      customPupilColour
    );
  }
}

function createEyes(num) {
  eyes = [];

  let attempts = 0;
  const maxAttempts = 1000;

  while (eyes.length < num && attempts < maxAttempts) {
    attempts++;

    const ps = random(8, 18);
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

function isOverlapping(a, b) {
  const padding = 10;

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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createEyes(7);
}