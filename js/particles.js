export class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationFrame = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  init() {
    if (this.prefersReducedMotion) return;

    this.particles = [];
    const count = Math.min(Math.floor(window.innerWidth / 10), 60);

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * 0.02
      });
    }

    this.animate();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      p.alpha += Math.sin(Date.now() * 0.002) * p.pulse;
      const safeAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 126, 179, ${safeAlpha})`;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#ff758c';
      this.ctx.fill();
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  createExplosion(x, y) {
    if (this.prefersReducedMotion) return;

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({
        x: x,
        y: y,
        size: Math.random() * 3 + 2,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        alpha: 1,
        pulse: 0,
        temporary: true
      });
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}