let particles = [];
let flowField = [];

let gridSize = 10;
let cols, rows;

let zoff = 0;
let zstep = 0.0008;

let psNums = 2200;
let maxSpeed = 1.2;

function setup() {
  createCanvas(1350, 600);

  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  for (let i = 0; i < psNums; i++) {
    particles.push(new Particle());
  }

  clear(); // 透明背景
}

function draw() {
  let yoff = 0;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      // 整体向下，同时带一点自然摆动
      let angle = HALF_PI + noise(xoff, yoff, zoff) * 1.1 - 0.55;

      let v = p5.Vector.fromAngle(angle);
v.setMag(0.18);

      flowField[index] = v;

      xoff += 0.03;
    }

    yoff += 0.03;
  }

  zoff += zstep;

  for (let p of particles) {
    p.follow(flowField);
    p.update();
    p.edges();
    p.show();
  }
}

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(firstTime = false) {
    this.pos = createVector(
      random(width),
      firstTime ? random(height) : random(-300, -20)
    );

    this.vel = createVector(
  random(-0.05, 0.05),
  random(0.3, 0.8)
  );

    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.maxSpeed = maxSpeed;
  }

  follow(vectors) {
    let x = floor(this.pos.x / gridSize);
    let y = floor(this.pos.y / gridSize);

    if (x < 0 || x >= cols || y < 0 || y >= rows) return;

    let index = x + y * cols;
    let force = vectors[index];

    if (force) {
      this.applyForce(force);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
  this.vel.add(this.acc);

  this.vel.limit(this.maxSpeed);

  // 极轻微下坠
  this.vel.y += 0.01;

  // 阻尼
  this.vel.mult(0.985);

  this.pos.add(this.vel);

  this.acc.mult(0);
}

  show() {
    if (this.pos.y < 0) {
      this.updatePrev();
      return;
    }

    // 暗红色血液感
    stroke(120, 0, 15, 95);
    strokeWeight(3.5);

    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

    this.updatePrev();
  }

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.y > height + 30) {
      this.reset(false);
    }

    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
  }
}