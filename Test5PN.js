let particles = [];
let flowField = [];

let gridSize = 10;
let cols, rows;

let zoff = 0;
let zstep = 0.01;

let psNums = 800;
let maxSpeed = 4;

function setup() {
  createCanvas(1350, 600);

  cols = floor(width / gridSize);
  rows = floor(height / gridSize);

  for (let i = 0; i < psNums; i++) {
    particles.push(new Particle());
  }

  background(255);
}

function draw() {
  let yoff = 0;

  for (let y = 0; y < rows; y++) {
    let xoff = 0;

    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(0.3);

      flowField[index] = v;

      xoff += 0.05;
    }

    yoff += 0.05;
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
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.prevPos = this.pos.copy();
    this.maxSpeed = maxSpeed;
  }

  follow(vectors) {
    let x = floor(this.pos.x / gridSize);
    let y = floor(this.pos.y / gridSize);
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
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

show() {

  let t = noise(this.pos.x * 0.01, this.pos.y * 0.01);

  let r = lerp(255, 245, t);
  let g = lerp(220, 230, t);
  let b = lerp(230, 180, t);

  stroke(r, g, b, 25);

  strokeWeight(1.8);

  line(
    this.pos.x,
    this.pos.y,
    this.prevPos.x,
    this.prevPos.y
  );

  this.updatePrev();
}

  updatePrev() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }

    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }

    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }

    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  }
}