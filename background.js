const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resize() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize', resize);
resize();

const POINTS = 90;
const points = Array.from({length: POINTS}, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  vx: (Math.random()-0.5)*0.25,
  vy: (Math.random()-0.5)*0.25
}));

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for (let i=0;i<POINTS;i++){
    const p=points[i];
    for (let j=i+1;j<POINTS;j++){
      const q=points[j];
      const dx=p.x-q.x, dy=p.y-q.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<160){
        ctx.strokeStyle=`rgba(255,255,255,${0.18*(1-dist/160)})`;
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(q.x,q.y);
        ctx.stroke();
      }
    }
  }

  for (const p of points){
    ctx.fillStyle='rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.arc(p.x,p.y,2,0,Math.PI*2);
    ctx.fill();
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<-50)p.x=canvas.width+50;
    if(p.x>canvas.width+50)p.x=-50;
    if(p.y<-50)p.y=canvas.height+50;
    if(p.y>canvas.height+50)p.y=-50;
  }

  requestAnimationFrame(draw);
}
draw();
