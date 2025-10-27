const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

const lines = Array.from({ length: 40 }, () => ({
  x: random(0, canvas.width),
  y: random(0, canvas.height),
  dx: random(-0.5, 0.5),
  dy: random(-0.5, 0.5),
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  lines.forEach((l) => {
    ctx.beginPath();
    ctx.moveTo(l.x, l.y);
    ctx.lineTo(l.x + 10, l.y + 10);
    ctx.stroke();
    l.x += l.dx;
    l.y += l.dy;
    if (l.x < 0 || l.x > canvas.width) l.dx *= -1;
    if (l.y < 0 || l.y > canvas.height) l.dy *= -1;
  });
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
