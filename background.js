window.addEventListener("load", () => {
  const canvas = document.getElementById("bg-canvas");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const points = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5
  }));

  function animate() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const q = points[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 150) {
          ctx.strokeStyle = `rgba(255,255,255,${0.15*(1-dist/150)})`;
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);
          ctx.lineTo(q.x,q.y);
          ctx.stroke();
        }
      }
    }

    points.forEach(p => {
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      ctx.arc(p.x,p.y,2,0,Math.PI*2);
      ctx.fill();
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
      if (p.y < -50) p.y = canvas.height + 50;
      if (p.y > canvas.height + 50) p.y = -50;
    });

    requestAnimationFrame(animate);
  }

  animate();
});
