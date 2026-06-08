// shared pixel size system

let pixelInfo;
// ChatGPT helped calculate the proper pixel size based on the window in opening snene
function setupPixelInfo(pixelArt, cols) {
  let pw = pixelArt[0].length;
  let ph = pixelArt.length;

  let marginX = width * 0.03;
  let marginY = height * 0.04;

  let availW = width - marginX * 2;
  let availH = height - marginY * 2;

  let cellW = availW / cols;

  let winW = cellW * 0.78;
  let winH = availH * 0.90;

  let pixSize = min(winW / pw, winH / ph);

  pixelInfo = {
    pixSize: pixSize,
    marginX: marginX,
    marginY: marginY,
    availW: availW,
    availH: availH,
    cellW: cellW
  };
}

function getPixelSize() {
  return pixelInfo.pixSize;
}