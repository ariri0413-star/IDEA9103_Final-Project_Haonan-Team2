// 哥特式教堂彩色玻璃窗背景 - p5.js
// 像素数据从原图精确提取（21列 x 52行网格）

const pixelGrid = [
  "wwwwwwwwwwwwwwwwwwwww",
  "wwwwwwwwwwkwwwwwwwwww",
  "wwwwwwwwkkkkkwwwwwwww",
  "wwwwwwwkkkkkkkwwwwwww",
  "wwwwwwkkkk1kkkkwwwwww",
  "wwwwwkkkk312kkkkwwwww",
  "wwwwwkkk13121kkkwwwww",
  "wwwwkk2kk223kk1kkwwww",
  "wwwwkkkkkk2kkkkkkwwww",
  "wwwkkk3kkkkkkk1kkkwww",
  "wwwkk232kk3kk222kkwww",
  "wwkkk1133k1k2222kkkww",
  "wwkkkk1kkkkkkk2kkkkww",
  "wwk3kkkkkk1kkkkkk1kww",
  "wkkkkkkkk322kkkkkkkkw",
  "wkkk12kkk312kkk32kkkw",
  "wkk3312k23221k3311kkw",
  "wkk2221k12122k3331kkw",
  "wkk1333k21311k3112kkw",
  "wkk1133k11311k1312kkw",
  "wkk1123k13333k1113kkw",
  "wkk2221k13133k3313kkw",
  "wkk3122k12232k1333kkw",
  "wkk3311k22132k1213kkw",
  "wkk3321k23221k2232kkw",
  "wkk2213k11122k2322kkw",
  "wkk2221k31122k3321kkw",
  "wkk1123k21222k2113kkw",
  "wkk3123k23112k1113kkw",
  "wkk1322k22211k2213kkw",
  "wkk3333k23322k1233kkw",
  "wkk2313k22123k2221kkw",
  "wkk1123k32222k1232kkw",
  "wkk1132k23322k1333kkw",
  "wkk2233k22122k3333kkw",
  "wkk1122k13312k3121kkw",
  "wkk2212k11333k1211kkw",
  "wkk2321k11332k1213kkw",
  "wkk2221k11111k3231kkw",
  "wkk3311k31322k1231kkw",
  "wkk3231k22213k2333kkw",
  "wkk1233k13111k1113kkw",
  "wkk1k33k23313k11k1kkw",
  "wkk1kk3k33233k2kk1kkw",
  "wkkkkkkkkkkkkkkkkkkkw",
  "wkkkkkkkkk3kkkkkkkkkw",
  "wkk3k1kkk323kkk3k3kkw",
  "wkkk1kkk31213kkk3kkkw",
  "wkk2k3kkk323kkk2k1kkw",
  "wkkkkkkkkk3kkkkkkkkkw",
  "wkkkkkkkkkkkkkkkkkkkw",
  "wwwwwwwwwwwwwwwwwwwww",
];

// 颜色映射
// w = 白色背景（不绘制，显示石墙底色）
// k = 铅灰色铅条框架（比背景稍亮，可辨识窗户轮廓）
// 1 = 最深蓝  rgb(41,  60, 171)
// 2 = 中间蓝  rgb(45, 103, 168)
// 3 = 最浅蓝  rgb(143, 214, 240)
const colorMap = {
  w: null,
  k: [33, 31, 44],
  1: [41,  60, 171],
  2: [45, 103, 168],
  3: [143, 214, 240],
};

const PW = pixelGrid[0].length; // 21
const PH = pixelGrid.length;    // 52

// ── 可调参数 ──────────────────────────────────
const cols = 3; // 横向平铺列数
// ─────────────────────────────────────────────

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  noSmooth();
}

// 绘制立体哥特石柱
// pillarX : 柱子中心 x 坐标
// floorY  : 画布底部 y（通常为 ch）
function drawPillar(pillarX, floorY, cellW) {
  const pw  = cellW * 0.18;  // 柱身宽
  const bw  = cellW * 0.26;  // 基座宽
  const bh  = floorY * 0.12; // 基座高
  const bodyH = floorY - bh; // 柱身高度（从顶到基座）

  noStroke();

  // ── 柱身主体 ──
  fill(38, 36, 54);
  rect(pillarX - pw / 2, 0, pw, bodyH);

  // 左侧高光（亮面）
  fill(68, 64, 88);
  rect(pillarX - pw / 2, 0, pw * 0.25, bodyH);

  // 右侧阴影（暗面）
  fill(20, 18, 30);
  rect(pillarX + pw / 2 - pw * 0.2, 0, pw * 0.2, bodyH);

  // ── 基座 ──
  fill(35, 33, 50);
  rect(pillarX - bw / 2, bodyH, bw, bh);

  // 基座顶面高光线
  fill(62, 58, 82);
  rect(pillarX - bw / 2, bodyH, bw, bh * 0.1);

  // 基座左侧高光
  fill(52, 49, 70);
  rect(pillarX - bw / 2, bodyH, bw * 0.1, bh);

  // 基座右侧阴影
  fill(18, 16, 26);
  rect(pillarX + bw / 2 - bw * 0.1, bodyH, bw * 0.1, bh);

  // ── 柱顶哥特尖拱收口 ──
  // 主体三角
  fill(38, 36, 54);
  triangle(
    pillarX - pw / 2, 0,
    pillarX + pw / 2, 0,
    pillarX,          -pw * 0.7
  );
  // 尖拱左侧高光
  fill(68, 64, 88);
  triangle(
    pillarX - pw / 2, 0,
    pillarX,          0,
    pillarX,          -pw * 0.7
  );
}

function draw() {
  const cw = width;
  const ch = height;

  // 暗黑石墙底色
  background(12, 10, 22);

  // 石墙横纹纹理
  noStroke();
  for (let y = 0; y < ch; y += 18) {
    const shade = (Math.floor(y / 18) % 2 === 0) ? 18 : 22;
    fill(shade, shade - 2, shade + 4, 120);
    rect(0, y, cw, 18);
  }

  const marginX = cw * 0.03;
  const marginY = ch * 0.04;
  const availW  = cw - marginX * 2;
  const availH  = ch - marginY * 2;
  const cellW   = availW / cols;

  // 窗户尺寸自适应格子
  const winW    = cellW * 0.78;
  const winH    = availH * 0.90;
  const pixSize = min(winW / PW, winH / PH);
  const actualW = pixSize * PW;
  const actualH = pixSize * PH;
  const cy      = marginY + availH / 2;

  // ── 先画石柱（在窗户下方）──
  noStroke();
  for (let col = 0; col <= cols; col++) {
    const px = marginX + col * cellW;
    drawPillar(px, ch, cellW);
  }

  // ── 再画彩色玻璃窗（叠在石柱上方）──
  for (let col = 0; col < cols; col++) {
    const cx     = marginX + col * cellW + cellW / 2;
    const startX = floor(cx - actualW / 2);
    const startY = floor(cy - actualH / 2);

    noStroke();
    for (let py = 0; py < PH; py++) {
      for (let px = 0; px < PW; px++) {
        const key   = pixelGrid[py][px];
        const color = colorMap[key];
        if (!color) continue;
        const x = startX + px * pixSize;
        const y = startY + py * pixSize;
        fill(color[0], color[1], color[2]);
        rect(x, y, pixSize + 0.5, pixSize + 0.5);
      }
    }
  }

  // 顶部 / 底部阴影遮罩
  noStroke();
  fill(12, 10, 22, 200);
  rect(0, 0, cw, marginY * 0.6);
  rect(0, ch - marginY * 0.6, cw, marginY * 0.6);
}

// 窗口缩放时重绘
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}