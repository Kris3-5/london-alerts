const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

// Make canvas fill viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Utility
function random(min, max) { return Math.random() * (max - min) + min; }

// Create shapes
let shapes = [];
for (let i = 0; i < 120; i++) { // more shapes for visibility
  shapes.push({
    x: random(0, canvas.width),
    y: random(0, canvas.height),
    size: random(20, 80),
    dx: random(-0.3, 0.3),
    dy: random(-0.3, 0.3),
    color: `rgba(255,255,255,${random(0.08,0.15)})`, // slightly brighter
    angle: random(0, 360),
    dAngle: random(-0.3, 0.3)
  });
}

// Draw radial gradient background
function drawBackground() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  gradient.addColorStop(0, "#111111");
  gradient.addColorStop(1, "#0d0d0d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw all shapes and connecting lines
function draw() {
  drawBackground();

  // Draw connecting lines
  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const dx = shapes[i].x - shapes[j].x;
      const dy = shapes[i].y - shapes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(255,255,255,0.03)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(shapes[i].x, shapes[i].y);
        ctx.lineTo(shapes[j].x, shapes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw shapes
  shapes.forEach(shape => {
    ctx.save();
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.angle * Math.PI / 180);
    ctx.fillStyle = shape.color;
    ctx.beginPath();
    ctx.moveTo(0, -shape.size / 2);
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(
        (shape.size / 2) * Math.cos(i * 144 * Math.PI / 180),
        (shape.size / 2) * Math.sin(i * 144 * Math.PI / 180)
      );
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Move shapes
    shape.x += shape.dx;
    shape.y += shape.dy;
    shape.angle += shape.dAngle;

    // Wrap around edges
    if (shape.x < -100) shape.x = canvas.width + 100;
    if (shape.x > canvas.width + 100) shape.x = -100;
    if (shape.y < -100) shape.y = canvas.height + 100;
    if (shape.y > canvas.height + 100) shape.y = -100;
  });

  requestAnimationFrame(draw);
}

draw();
