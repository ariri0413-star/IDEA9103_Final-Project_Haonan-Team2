// opening scene music
let openingSong;
// good ending music
let goodSong;
// bad ending music
let badSong;
// stores the currently playing music
let currentMusic;
// analyse music volume
let analyser;
// analyse music frequencies
let fft;
// play / pause button
let playButton;
// hover sound for buttons
let hoverSound;
// click sound for play / pause button
let playClickSound;
// click sound for good ending button
let goodClickSound;
// click sound for bad ending button
let badClickSound;


// initialise audio system
function initAudio() {
  // analyse music loudness
  analyser = new p5.Amplitude();
  // analyse music frequencies
  fft = new p5.FFT();
  // set default music
  currentMusic = openingSong;
  // connect analyser + fft to music
  analyser.setInput(currentMusic);
  fft.setInput(currentMusic);
}


// switch between different scene music
function switchMusic(newMusic) {
  // if this music is already active
  if (currentMusic === newMusic) {
    return;
  }
  // stop previous music
  if (currentMusic && currentMusic.isPlaying()) {
    currentMusic.stop();
  }
  // update current music
  currentMusic = newMusic;
  // reconnect analyser + fft
  analyser.setInput(currentMusic);
  fft.setInput(currentMusic);
  // start looping music
  currentMusic.loop();
  // update button text
  playButton.html("Pause");
}


// create play / pause button
function createAudioButton() {
  playButton = createButton("Play/Pause");
  // button position
  playButton.position(width * 0.02, height * 0.03);
  // button press function
  playButton.mousePressed(function() {
  playButtonClickSound("play");
  playPause();
 });
  // button hover function  
  playButton.mouseOver(function() {
  playHoverSound();
 });
}


// play or pause music
function playPause() {
  // safety check
  if (!currentMusic) {
    return;
  }
  // if music is currently playing
  if (currentMusic.isPlaying()) {
    currentMusic.pause();
    playButton.html("Play");
  } else {
    currentMusic.loop();
    playButton.html("Pause");
  }
}

// play hover sound
function playHoverSound() {
  if (hoverSound && !hoverSound.isPlaying()) {
    hoverSound.play();
  }
}

// play different click sounds
function playButtonClickSound(type) {
  if (type === "play" && playClickSound) {
    playClickSound.play();
  }

  if (type === "good" && goodClickSound) {
    goodClickSound.play();
  }

  if (type === "bad" && badClickSound) {
    badClickSound.play();
  }
}


// returns current music volume
function getMusicLevel() {
  return analyser.getLevel();
}


// returns high-mid frequency energy
function getHighMid() {
  fft.analyze();
  return fft.getEnergy("highMid");
}