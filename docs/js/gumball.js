// -----------------------------------------------------
// global variables

let w = 270;
let h = 270;
let dots = [];
let fps = false;
let movingDot;
let blend = 5;
let circleTimer;

let img; // loadImage variable
let bgG; // createGraphics
let bgMode = false;
let ImageGray = false;
let busy = false;
let bgColor_r = 255,
  bgColor_g = 255,
  bgColor_b = 255;
let bgColorAlpha = 0;

// customizable variables

// size / radius ( 0 - inf )
let rad1 = 12;
let rad2 = 16;
let radd = 300;
let radp = 4;

// shift ( 0 - inf )
let sh1 = -30;
let sh2 = 25;
let shd = 300;
let shp = 2;

// roundoff ( 0 - 100% )
let rou1 = 20;
let rou2 = 100;
let roud = 300;
let roup = 0.4;

// hue ( 0 - 360 )
let hue1 = 20;
let hue2 = 20;
let hued = 300;
let huep = 2;
let hueLoop = 0;

// sat ( 0 - 100 )
let sat1 = 80;
let sat2 = 70;
let satd = 300;
let satp = 2;

// lum ( 0 - 100 )
let lum1 = 80;
let lum2 = 30;
let lumd = 300;
let lump = 2;

// alpha ( 0.0 - 1.0 )
let a1 = 1.0;
let a2 = 1.0;
let ad = 300;
let ap = 5;

// Corners ( 1 - inf )
let corn1 = 3;
let corn2 = 6;
let cornd = 300;
let cornp = 2;

// rotation ( 0 - inf )
let rot1 = 45;
let rot2 = 90;
let rotd = 300;
let rotp = 1;
let rotLoop = 0;

// ratio of squares, w/h ( > 0 )
let rt1 = 0;
let rt2 = 0;
let rat1 = 0;
let rat2 = 0;
let ratd = 0;
let ratp = 1;

let n = 19;
let hex = true;
let circleMask = 210.0;
let poly = true;
let mouseTurn = true;
let sinedot = false;
let sinedotShow = false;
let circleShow = false;
let mouseTrigger = true;
let amp = 85;
let freq = 1;
let speed = 6;
let delay = 120;
let maxDist = Math.max(radd, shd, roud, hued, satd, lumd, ad, cornd, rotd, ratd);

function calcMaxDist() {
  if (poly) {
    maxDist = Math.max(radd, shd, hued, satd, lumd, ad, cornd, rotd);
  } else {
    maxDist = Math.max(radd, shd, roud, hued, satd, lumd, ad, rotd, ratd);
  }
}

function updateRatio() {
  rat1 = rad1 * rt1 / 100;
  rat2 = rad2 * rt2 / 100;
}

// Sinedot class
class Sinedot {
  constructor(amp, freq, speed, delay) {
    this.amp = amp;
    this.freq = freq;
    this.speed = speed;
    this.delay = delay;
    this.timer = delay;
    this.v1 = createVector(w / 2 - maxDist - circleMask / 2, h / 2);
    this.phase = Math.random() * 360;
  }

  move() {
    if (this.timer > 0) {
      this.timer--;
    } else {
      this.v1.x += this.speed;
      this.v1.y = h / 2 + this.amp * sin(this.freq * this.v1.x + this.phase);
    }

    if (this.v1.x > w / 2 + maxDist + circleMask / 2) {
      this.v1.x = w / 2 - maxDist - circleMask / 2;
      this.phase = Math.random() * 360;
      this.timer = this.delay;
      sinedotShow = false;
    }

    // textSize(16);
    // fill(255, 255, 255);
    // text(maxDist + ' ' + roud, 10, 30);
  }

  show() {
    fill(255, 255, 255, 255);
    ellipse(this.v1.x, this.v1.y, 12, 12);
  }
}

// Dot class

class Dot {
  constructor(x, y) {
    this.v1 = createVector(x, y);
    this.anchDist = createVector(w / 2 - x, h / 2 - y).mag();
  }

  showDuo() {
    let v2 = createVector(mouseX - this.v1.x, mouseY - this.v1.y);
    let d2 = v2.mag();
    let v3 = createVector(movingDot.v1.x - this.v1.x, movingDot.v1.y - this.v1.y);
    let d3 = v3.mag();
    let d = Math.min(d2, d3);
    v2.normalize();
    v3.normalize();
    let shiftMouse = sh1 * map(d2, 0, maxDist, 1.0, 0, true) + (sh2 - sh1) * pow(map(d2, 0, shd, 1.0, 0, true), shp);
    let shiftSine = sh1 * map(d3, 0, maxDist, 1.0, 0, true) + (sh2 - sh1) * pow(map(d3, 0, shd, 1.0, 0, true), shp);

    // shape
    let radius = Math.max(rad1 + (rad2 - rad1) * pow(map(d, 0, radd, 1.0, 0, true), radp), 0);
    let roundoff = Math.max((rou1 + (rou2 - rou1) * pow(map(d, 0, roud, 1.0, 0, true), roup)) * radius / 200, 0); // squares only
    let ratio = rat1 + (rat2 - rat1) * pow(map(d, 0, ratd, 1.0, 0, true), ratp); // squares only
    let corners = corn1 + (corn2 - corn1) * pow(map(d, 0, cornd, 1.0, 0, true), cornp); // poly only

    // orientation
    let rotation = (rot1 + rot2 * pow(map(d, 0, rotd, 1.0, 0, true), rotp) + rotLoop * frameCount) % 360;

    // color
    let hue = (((hue1 + (hue2 - hue1) * pow(map(d, 0, hued, 1.0, 0, true), huep) + hueLoop * frameCount) % 360) + 360) % 360;
    let sat = sat1 + (sat2 - sat1) * pow(map(d, 0, satd, 1.0, 0, true), satp);
    let lum = lum1 + (lum2 - lum1) * pow(map(d, 0, lumd, 1.0, 0, true), lump);
    let alpha = a1 + (a2 - a1) * pow(map(d, 0, ad, 1.0, 0, true), ap);

    noStroke();

    push();
    colorMode(HSB);
    setBlend();

    translate(this.v1.x - shiftMouse * (v2.x) - shiftSine * (v3.x), this.v1.y - shiftMouse * (v2.y) - shiftSine * (v3.y));
    rotate(rotation);
    if (mouseTurn) {
      rotate(315 + v2.heading());
    }

    fill(hue, sat, lum, alpha);
    if (poly) {
      polygon(0, 0, radius * 0.7, corners);
    } else {
      rect(0, 0, Math.max(radius + Math.ceil(ratio), 0), Math.max(radius - Math.floor(ratio), 0), roundoff);
    }

    pop();
  }

  showSine() {
    let v2 = createVector(movingDot.v1.x - this.v1.x, movingDot.v1.y - this.v1.y);
    let d = v2.mag();
    v2.normalize();
    let shift = sh1 * map(d, 0, maxDist, 1.0, 0, true) + (sh2 - sh1) * pow(map(d, 0, shd, 1.0, 0, true), shp);

    // shape
    let radius = Math.max(rad1 + (rad2 - rad1) * pow(map(d, 0, radd, 1.0, 0, true), radp), 0);
    let roundoff = Math.max((rou1 + (rou2 - rou1) * pow(map(d, 0, roud, 1.0, 0, true), roup)) * radius / 200, 0); // squares only
    let ratio = rat1 + (rat2 - rat1) * pow(map(d, 0, ratd, 1.0, 0, true), ratp); // squares only
    let corners = corn1 + (corn2 - corn1) * pow(map(d, 0, cornd, 1.0, 0, true), cornp); // poly only

    // orientation
    let rotation = (rot1 + rot2 * pow(map(d, 0, rotd, 1.0, 0, true), rotp) + rotLoop * frameCount) % 360;

    // color
    let hue = (((hue1 + (hue2 - hue1) * pow(map(d, 0, hued, 1.0, 0, true), huep) + hueLoop * frameCount) % 360) + 360) % 360;
    let sat = sat1 + (sat2 - sat1) * pow(map(d, 0, satd, 1.0, 0, true), satp);
    let lum = lum1 + (lum2 - lum1) * pow(map(d, 0, lumd, 1.0, 0, true), lump);
    let alpha = a1 + (a2 - a1) * pow(map(d, 0, ad, 1.0, 0, true), ap);

    noStroke();

    push();
    colorMode(HSB);
    setBlend();

    translate(this.v1.x - shift * (v2.x), this.v1.y - shift * (v2.y));
    rotate(rotation);
    if (mouseTurn) {
      rotate(315 + v2.heading());
    }

    fill(hue, sat, lum, alpha);

    if (poly) {
      polygon(0, 0, radius * 0.7, corners);
    } else {
      rect(0, 0, Math.max(radius + Math.ceil(ratio), 0), Math.max(radius - Math.floor(ratio), 0), roundoff);
    }

    pop();
  }

  showMouse() {
    let v2 = createVector(mouseX - this.v1.x, mouseY - this.v1.y);
    let d = v2.mag();
    v2.normalize();
    let shift = sh1 * map(d, 0, maxDist, 1.0, 0, true) + (sh2 - sh1) * pow(map(d, 0, shd, 1.0, 0, true), shp);

    // shape
    let radius = Math.max(rad1 + (rad2 - rad1) * pow(map(d, 0, radd, 1.0, 0, true), radp), 0);
    let roundoff = Math.max((rou1 + (rou2 - rou1) * pow(map(d, 0, roud, 1.0, 0, true), roup)) * radius / 200, 0); // squares only
    let ratio = rat1 + (rat2 - rat1) * pow(map(d, 0, ratd, 1.0, 0, true), ratp); // squares only
    let corners = corn1 + (corn2 - corn1) * pow(map(d, 0, cornd, 1.0, 0, true), cornp); // poly only

    // orientation
    let rotation = (rot1 + rot2 * pow(map(d, 0, rotd, 1.0, 0, true), rotp) + rotLoop * frameCount) % 360;

    // color
    let hue = (((hue1 + (hue2 - hue1) * pow(map(d, 0, hued, 1.0, 0, true), huep) + hueLoop * frameCount) % 360) + 360) % 360;
    let sat = sat1 + (sat2 - sat1) * pow(map(d, 0, satd, 1.0, 0, true), satp);
    let lum = lum1 + (lum2 - lum1) * pow(map(d, 0, lumd, 1.0, 0, true), lump);
    let alpha = a1 + (a2 - a1) * pow(map(d, 0, ad, 1.0, 0, true), ap);

    noStroke();

    push();
    colorMode(HSB);
    setBlend();

    translate(this.v1.x - shift * (v2.x), this.v1.y - shift * (v2.y));
    rotate(rotation);
    if (mouseTurn) {
      rotate(315 + v2.heading());
    }

    fill(hue, sat, lum, alpha);

    if (poly) {
      polygon(0, 0, radius * 0.7, corners);
    } else {
      rect(0, 0, Math.max(radius + Math.ceil(ratio), 0), Math.max(radius - Math.floor(ratio), 0), roundoff);
    }

    pop();
  }

  show() {
    // shape
    let radius = Math.max(rad1, 0);
    let roundoff = Math.max(rou1 * radius / 200, 0); // squares only
    let ratio = rat1; // squares only
    let corners = corn1; // poly only

    // orientation
    let rotation = (rot1 + rotLoop * frameCount) % 360;

    // color
    let hue = (((hue1 + hueLoop * frameCount) % 360) + 360) % 360;
    let sat = sat1;
    let lum = lum1;
    let alpha = a1;

    noStroke();

    push();
    colorMode(HSB);
    translate(this.v1.x, this.v1.y);
    rotate(rotation);
    fill(hue, sat, lum, alpha);

    if (poly) {
      polygon(0, 0, radius * 0.7, corners);
    } else {
      rect(0, 0, Math.max(radius + Math.ceil(ratio), 0), Math.max(radius - Math.floor(ratio), 0), roundoff);
    }

    pop();
  }
};

// p5 setup() and draw()
function setup() {
  frameRate(30);
  let canvas = createCanvas(w, h);
  // Move the canvas so it’s inside our <div id="sketch-holder">.
  canvas.parent('gumball');
  angleMode(DEGREES);
  rectMode(CENTER);

  let shfBound = -Math.min(sh1, sh2);
  let xAlt = 0;
  if (hex) {
    let yAlt = n * sin(60);
    for (let y = h / 2 - Math.ceil((h / 2 + shfBound) / yAlt) * yAlt; y < h + shfBound + yAlt; y += yAlt) {
      for (let x = w / 2 - Math.ceil((w / 2 + shfBound) / n) * n - xAlt; x < w + shfBound + n; x += n) {
        dots.push(new Dot(x, y));
      }
      if (xAlt == 0) {
        xAlt = n / 2;
      } else {
        xAlt = 0;
      }
    }
  } else {
    let yAlt = n;
    for (let y = h / 2 - Math.ceil((h / 2 + shfBound) / yAlt) * yAlt; y < h + shfBound + yAlt; y += yAlt) {
      for (let x = w / 2 - Math.ceil((w / 2 + shfBound) / n) * n - xAlt; x < w + shfBound + n; x += n) {
        dots.push(new Dot(x, y));
      }
    }
  }

  movingDot = new Sinedot(amp, freq, speed, delay);
  // middle dot for debugging
  //dots.push(new Dot(w/2, h/2));
}

function draw() {
  // Background
  push();
  colorMode(RGB);
  if (bgMode && !busy) {
    if (bgG) {
      image(bgG, 0, 0);
    }
    background(bgColor_r, bgColor_g, bgColor_b, bgColorAlpha);
    // ^ color on top of bg (with alpha)
  } else {
    background(bgColor_r, bgColor_g, bgColor_b);
  }
  pop();

  for (let i = 0; i < dots.length; i++) {
    if (dots[i].anchDist > circleMask / 2) {
      dots.splice(i, 1);
    } else if (sinedot && mouseTrigger) {
      dots[i].showDuo();
    } else if (mouseTrigger) {
      dots[i].showMouse();
    } else if (sinedot) {
      dots[i].showSine();
    } else {
      dots[i].show();
    }
  }

  if (sinedot && sinedotShow) {
    movingDot.move();
    movingDot.show();
  } else if (sinedot) {
    movingDot.move();
  }

  if (circleShow) {
    showCircle();
  }

  if (fps) {
    textSize(12);
    fill(255, 0, 0);
    text(Math.floor(frameRate()), 20, 20);
  }
}

function setBlend() {
  switch (blend) {
    case 1:
      blendMode(BLEND);
      break;
    case 2:
      blendMode(ADD);
      break;
    case 3:
      blendMode(DARKEST);
      break;
    case 4:
      blendMode(LIGHTEST);
      break;
    case 5:
      blendMode(DIFFERENCE);
      break;
    case 6:
      blendMode(EXCLUSION);
      break;
    case 7:
      blendMode(MULTIPLY);
      break;
    case 8:
      blendMode(SCREEN);
      break;
    case 9:
      blendMode(OVERLAY);
      break;
    case 10:
      blendMode(HARD_LIGHT);
      break;
    case 11:
      blendMode(SOFT_LIGHT);
      break;
    case 12:
      blendMode(DODGE);
      break;
    case 13:
      blendMode(BURN);
      break;
    default:
      blendMode(BLEND);
  }
}

function showCircle() {
  stroke(255);
  strokeWeight(4);
  noFill();
  ellipse(w / 2, h / 2, circleMask, circleMask);
}

// polygon function

function polygon(x, y, pRadius, npoints) {
  let angle = 360 / npoints;
  beginShape();
  for (let ang = 0; ang < 360; ang += angle) {
    let sx = x + cos(ang) * pRadius;
    let sy = y + sin(ang) * pRadius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// resize function

window.addEventListener('resize', function () {
  // w = canvas.width = window.innerWidth;
  // h = canvas.height = window.innerHeight;
  dots = [];
  setup();
})
