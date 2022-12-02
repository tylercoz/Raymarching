let a = 0;

function SDF(p) {
  // mouse = map(mouseX, 0, 800, -400, 400);
  let sphere1 = new Sphere(-100, 0, 150, 50);
  let sphere2 = new Sphere(100, 0, 150, 50);

  a+=.000001;
  let r = sphere1.r * 2;
  let x = cos(a) * r;
  let y = sin(a) * r;
  sphere1.pos.x = x;
  sphere1.pos.y = y;

  r = sphere2.r * 2;
  x = cos(-a) * r;
  y = sin(-a) * r;
  sphere2.pos.x = x;
  sphere2.pos.y = y;

  let d1 = sdSphere(p, sphere1);
  let d2 = sdSphere(p, sphere2);
  return min(d1, d2);
}

function sdSphere(p, sphere) {
  let d = dist(p.x, p.y, p.z, sphere.pos.x, sphere.pos.y, sphere.pos.z);
  return d - sphere.r;
}

function setup() {
  createCanvas(800, 800);
  noStroke();

}

function draw() {
  background(0);

  //rays
  const FOV = new p5.Vector(150, 150);
  const RES = new p5.Vector(100, 100);
  const CELL = new p5.Vector(int(width/RES.x), int(height/RES.y));

  FOV.x = map(FOV.x, 1, 90, 0, 2);
  FOV.y = map(FOV.y, 1, 90, 0, 2);

  thetaDelta = FOV.x / RES.x;
  phiDelta = FOV.y / RES.y;

  let theta = FOV.x/2;
  for (let x = 0; x < RES.y; x++) {
    let phi = FOV.y/2;
    for (let y = 0; y < RES.x; y++) {
      let nRay = createVector(theta, phi, 1).normalize();
      let ray = rayMarch(nRay);
      
      // let normal = calcNormal(ray);
      // let light = new p5.Vector(1, 1, -1);
      // let brightness = p5.Vector.dot(light, normal);
      // brightness = map(brightness, 0, 1, 150, 255);

      // fill(brightness);
      rect(x * CELL.x, y * CELL.y, CELL.x, CELL.y);
      phi -= phiDelta
    }
    theta -= thetaDelta
  }
  // moveSphere(a);
  // a += .03;
}

function moveSphere(a) {
  let r = sphere1.r * 2;
  let x = cos(a) * r;
  let y = sin(a) * r;
  sphere1.pos.x = x;
  sphere1.pos.y = y;
}

function calcNormal(ray) {
  let EPS = .001;
  
  let v1 = createVector(
    SDF(p5.Vector.add(ray, new p5.Vector(EPS, 0, 0))), //x
    SDF(p5.Vector.add(ray, new p5.Vector(0, EPS, 0))), //y
    SDF(p5.Vector.add(ray, new p5.Vector(0, 0, EPS))), //z
  )

  let v2 = createVector(
    SDF(p5.Vector.sub(ray, new p5.Vector(EPS, 0, 0))), //x
    SDF(p5.Vector.sub(ray, new p5.Vector(0, EPS, 0))), //y
    SDF(p5.Vector.sub(ray, new p5.Vector(0, 0, EPS))), //z
  )
  
  return p5.Vector.normalize(v1.sub(v2));
}

function rayMarch(ray) {

  let MAX_STEPS = 50;
  let MAX_DISTANCE = 300;
  let MIN_DISTANCE = 1;

  for (let step = 0; step < MAX_STEPS; step++) {
    let distance = SDF(ray);
    if (distance < MIN_DISTANCE) {

      let normal = calcNormal(ray);
      let light = new p5.Vector(1, 1, -1);
      let brightness = p5.Vector.dot(light, normal);
      brightness = map(brightness, 0, 1, 150, 255);

      fill(brightness);
      return ray;   
    }
    if (distance > MAX_DISTANCE) {
      fill(0);
      return ray;
    }
    let t = ray.copy()
    t.setMag(distance);
    ray.add(t);
  }
  fill(0, 0, 0);
  return ray;
}