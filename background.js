const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let shapes = [];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// Create shapes
for (let i = 0; i < 50; i++) {
  shapes.push({
    x: random(0, canvas.width),
    y: random(0, canvas.height),
    size: random(20, 80),
    dx: random(-0.2, 0.2),
    dy: random(-0.2, 0.2),
    color: `rgba(255,255,255,${random(0.05,0.15)})`,
    angle: random(0, 360),
    dAngle: random(-0.2, 0.2)
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shapes.forEach(shape => {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.angle * Math.PI / 180);
    ctx.fillStyle = shape.color;
    ctx.beginPath();
    ctx.moveTo(0, -shape.size / 2);
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(shape.size/2 * Math.cos((i*144)*Math.PI/180), shape.size/2 * Math.sin((i*144)*Math.PI/180));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    shape.x += shape.dx;
    shape.y += shape.dy;
    shape.angle += shape.dAngle;

    if (shape.x < -100) shape.x = canvas.width + 100;
    if (shape.x > canvas.width + 100) shape.x = -100;
    if (shape.y < -100) shape.y = canvas.height + 100;
    if (shape.y > canvas.height + 100) shape.y = -100;
  });
  requestAnimationFrame(draw);
}

draw();

// Update canvas size on resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
