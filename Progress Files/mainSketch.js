// current scene
let scene = "opening";
// nun images
let openingNun;
let goodNun;
let badNun;


// preload assets
function preload() {
  // opening music
  openingSong = loadSound(
    "assets/ES_The Haunted - Luella Gren.wav"
  );
  // good ending music
  goodSong = loadSound(
    "assets/ES_Ethos - Johannes Bornlof.wav"
  );
  // bad ending music
  badSong = loadSound(
    "assets/ES_House of a Hundred Rooms - Dream Cave.wav"
  );
  // button sound effects
  hoverSound = loadSound(
    "assets/hover.wav"
  );
  playClickSound = loadSound(
    "assets/play-click.wav"
  );
  goodClickSound = loadSound(
    "assets/good-click.wav"
  );
  badClickSound = loadSound(
    "assets/bad-click.wav"
  );
  // nun images
  openingNun = loadImage(
    "image/nun1.png"
  );
  goodNun = loadImage(
    "image/nun2.png"
  );
  badNun = loadImage(
    "image/angel.png"
  );
}


// setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();
  frameRate(60);
  colorMode(RGB);
  // initialise audio system
  initAudio();
  // create play / pause button
  createAudioButton();
  // opening scene setup
  initCrosses();
  // good ending setup
  initWings();
  // set up pixel size system  
  setupPixelInfo(glass, 3);
}


// draw
function draw() {
  // opening scene
  if (scene === "opening") {
    switchMusic(openingSong);
    drawOpeningScene();
  }

  // good ending
  else if (scene === "good") {
    switchMusic(goodSong);
    drawGoodEnding();
  }

  // bad ending
  else if (scene === "bad") {
    switchMusic(badSong);
    drawBadEnding();
  }
}


// resize canvas when window changes
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // reposition button
  playButton.position(
    width * 0.02,
    height * 0.03
  );

  // refresh layouts
  initCrosses();
  initWings();
}