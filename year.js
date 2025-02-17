class Progress {
    constructor(param = {}) {
      this.timestamp        = null;
      this.duration         = param.duration || Progress.CONST.DURATION;
      this.progress         = 0;
      this.delta            = 0;
      this.progress         = 0;
      this.isLoop           = !!param.isLoop;
  
      this.reset();
    }
  
    static get CONST() {
      return {
        DURATION : 1000
      };
    }
  
    reset() {
      this.timestamp = null;
    }
  
    start(now) {
      this.timestamp = now;
    }
  
    tick(now) {
      if (this.timestamp) {
        this.delta    = now - this.timestamp;
        this.progress = Math.min(this.delta / this.duration, 1);
  
        if (this.progress >= 1 && this.isLoop) {
          this.start(now);
        }
  
        return this.progress;
      } else {
        return 0;
      }
    }
  }
  
  class Confetti {
    constructor(param) {
      this.parent         = param.elm || document.body;
      this.canvas         = document.createElement("canvas");
      this.ctx            = this.canvas.getContext("2d");
      this.width          = param.width  || this.parent.offsetWidth;
      this.height         = param.height || this.parent.offsetHeight;
      this.length         = param.length || Confetti.CONST.PAPER_LENGTH;
      this.yRange         = param.yRange || this.height * 2;
      this.progress       = new Progress({
        duration : param.duration,
        isLoop   : true
      });
      this.rotationRange  = typeof param.rotationLength === "number" ? param.rotationRange
                                                                     : 10;
      this.speedRange     = typeof param.speedRange     === "number" ? param.speedRange
                                                                     : 10;
      this.sprites        = [];
  
      this.canvas.style.cssText = [
        "display: block",
        "position: absolute",
        "top: 0",
        "left: 0",
        "pointer-events: none"
      ].join(";");
  
      this.render = this.render.bind(this);
  
      this.build();
  
      this.parent.appendChild(this.canvas);
      this.progress.start(performance.now());
  
      requestAnimationFrame(this.render);
    }
  
    static get CONST() {
      return {
          SPRITE_WIDTH  : 9,
          SPRITE_HEIGHT : 10,
          PAPER_LENGTH  : 100,
          DURATION      : 8000,
          ROTATION_RATE : 50,
          COLORS        : [
            "#FD0E35",
            "#FD0E35",
            "#ccff02",
            "#ccff02",
            "#87FF2A",
            "#87FF2A",
            "#87FF2A",
            "#87FF2A",
            "#0066FF",
            "#0066FF",
            "#0066FF",
            "#0066FF",
            "#FF3399",
            "#FF3399",
            "#FF3399",
            "#FF3399",
            "#A0E6FF",
            "#A0E6FF",
            "#FF1818",
            "#FF1818"
          ]
      };
    }
  
    build() {
      for (let i = 0; i < this.length; ++i) {
        let canvas = document.createElement("canvas"),
            ctx    = canvas.getContext("2d");
  
        canvas.width  = Confetti.CONST.SPRITE_WIDTH;
        canvas.height = Confetti.CONST.SPRITE_HEIGHT;
  
        canvas.position = {
          initX : Math.random() * this.width,
          initY : -canvas.height - Math.random() * this.yRange
        };
  
        canvas.rotation = (this.rotationRange / 2) - Math.random() * this.rotationRange;
        canvas.speed    = (this.speedRange / 2) + Math.random() * (this.speedRange / 2);
  
        ctx.save();
          ctx.fillStyle = Confetti.CONST.COLORS[(Math.random() * Confetti.CONST.COLORS.length) | 0];
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
  
        this.sprites.push(canvas);
      }
    }
  
    render(now) {
      let progress = this.progress.tick(now);
  
      this.canvas.width  = this.width;
      this.canvas.height = this.height;
  
      for (let i = 0; i < this.length; ++i) {
        this.ctx.save();
          this.ctx.translate(
            this.sprites[i].position.initX + this.sprites[i].rotation * Confetti.CONST.ROTATION_RATE * progress,
            this.sprites[i].position.initY + progress * (this.height + this.yRange)
          );
          this.ctx.rotate(this.sprites[i].rotation);
          this.ctx.drawImage(
            this.sprites[i],
            -Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)) / 2,
            -Confetti.CONST.SPRITE_HEIGHT / 2,
            Confetti.CONST.SPRITE_WIDTH * Math.abs(Math.sin(progress * Math.PI * 2 * this.sprites[i].speed)),
            Confetti.CONST.SPRITE_HEIGHT
          );
        this.ctx.restore();
      }
  
      requestAnimationFrame(this.render);
    }
  }
  
  (() => {
    const DURATION = 9000,
          LENGTH   = 120;
  
    new Confetti({
      width    : window.innerWidth,
      height   : window.innerHeight,
      length   : LENGTH,
      duration : DURATION
    });
  
    setTimeout(() => {
      new Confetti({
        width    : window.innerWidth,
        height   : window.innerHeight,
        length   : LENGTH,
        duration : DURATION
      });
    }, DURATION / 2);
  })();

  const canvas = document.getElementById("fireworksCanvas");
  const ctx = canvas.getContext("2d");
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  
  window.addEventListener("resize", resizeCanvas);
  
  const random = (min, max) => Math.random() * (max - min) + min;
  
  const getRandomColor = () => {
    const hue = random(0, 360);
    const saturation = random(70, 100);
    const lightness = random(50, 70);
    return { hue, color: `hsl(${hue}, ${saturation}%, ${lightness}%)` };
  };
  
  class Star {
    constructor() {
      this.reset();
    }
  
    reset() {
      this.x = random(0, canvas.width);
      this.y = random(0, canvas.height);
      this.size = random(0.5, 1.5);
      this.baseAlpha = random(0.3, 0.8);
      this.alpha = this.baseAlpha;
      this.twinkleSpeed = random(0.005, 0.02);
      this.twinkleDirection = Math.random() < 0.5 ? 1 : -1;
    }
  
    update() {
      this.alpha += this.twinkleSpeed * this.twinkleDirection;
      if (this.alpha >= 1) {
        this.alpha = 1;
        this.twinkleDirection = -1;
      } else if (this.alpha <= this.baseAlpha) {
        this.alpha = this.baseAlpha;
        this.twinkleDirection = 1;
      }
    }
  
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }
  
  class Firework {
    constructor(isTextFirework = false, text = "") {
      this.isTextFirework = isTextFirework;
      this.text = text;
      this.reset();
    }
  
    reset() {
      this.x = random(100, canvas.width - 100);
      this.y = canvas.height;
      this.speed = this.isTextFirework ? random(4, 6) : random(3, 7);
      const angle = random((-5 * Math.PI) / 12, (-7 * Math.PI) / 12);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.gravity = 0.015;
      const colorObj = getRandomColor();
      this.hue = colorObj.hue;
      this.color = colorObj.color;
      this.exploded = false;
      this.particles = [];
      this.targetY = this.isTextFirework
        ? random(canvas.height / 3, canvas.height / 2.5)
        : random(canvas.height / 4, canvas.height / 2);
      this.history = [];
      this.maxHistory = 15;
      this.done = false;
    }
  
    update() {
      if (!this.exploded) {
        this.vy += this.gravity;
        this.x += this.vx + random(-0.5, 0.5);
        this.y += this.vy;
  
        this.history.push({ x: this.x, y: this.y });
        if (this.history.length > this.maxHistory) {
          this.history.shift();
        }
  
        if (this.vy >= 0 || this.y <= this.targetY) {
          this.exploded = true;
          this.explode();
        }
      }
  
      this.particles.forEach((particle) => particle.update());
      this.particles = this.particles.filter((particle) => !particle.done);
  
      if (this.exploded && this.particles.length === 0) {
        this.done = true;
      }
    }
  
    explode() {
      let explosionType;
  
      if (
        (this.hue >= 0 && this.hue <= 30) ||
        (this.hue >= 330 && this.hue <= 360)
      ) {
        explosionType = "heart";
      } else if (this.hue >= 180 && this.hue <= 240) {
        explosionType = "text";
      } else if (this.hue >= 90 && this.hue <= 150) {
        explosionType = "greenStar";
      } else {
        explosionType = Math.random() < 0.5 ? "round" : "star";
      }
  
      const particleCountMap = {
        round: { count: Math.floor(random(80, 120)), angleOffset: 0 },
        star: { count: 50, angleOffset: Math.PI / 5 },
        heart: { count: 100, angleOffset: 0 },
        text: { count: 200, angleOffset: 0 },
        greenStar: { count: 100, angleOffset: 0 }
      };
  
      const { count: particleCount, angleOffset } = particleCountMap[
        explosionType
      ] || { count: 100, angleOffset: 0 };
  
      if (explosionType === "text") {
        const texts = ["Happy New Year", "2025","AIML"];
        const selectedText = texts[Math.floor(Math.random() * texts.length)];
        this.createTextParticles(selectedText, 100);
      } else if (explosionType === "greenStar") {
        this.createStarParticles("green");
      } else {
        for (let i = 0; i < particleCount; i++) {
          let angle;
          let speed = random(1, 10);
          if (explosionType === "round") {
            angle = random(0, Math.PI * 2);
          } else if (explosionType === "star") {
            angle = (i / particleCount) * Math.PI * 2 + angleOffset;
          } else if (explosionType === "heart") {
            const t = (i / particleCount) * Math.PI * 2;
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(
              13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t)
            );
            angle = Math.atan2(y, x);
            speed = Math.sqrt(x * x + y * y) / 5;
          }
          this.particles.push(
            new Particle(this.x, this.y, this.color, angle, speed, explosionType)
          );
        }
      }
    }
  
    createTextParticles(text, fontSize) {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");
  
      tempCtx.font = `${fontSize}px Arial`;
  
      const textMetrics = tempCtx.measureText(text);
      tempCanvas.width = textMetrics.width;
      tempCanvas.height = fontSize * 1.2;
  
      tempCtx.font = `${fontSize}px Arial`;
      tempCtx.fillStyle = "white";
      tempCtx.textBaseline = "middle";
      tempCtx.fillText(text, 0, tempCanvas.height / 2);
  
      const imageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      ).data;
  
      const density = 4;
      for (let y = 0; y < tempCanvas.height; y += density) {
        for (let x = 0; x < tempCanvas.width; x += density) {
          const index = (y * tempCanvas.width + x) * 4;
          const alpha = imageData[index + 3];
          if (alpha > 128) {
            const offsetX = x - tempCanvas.width / 2;
            const offsetY = y - tempCanvas.height / 2;
  
            const posX = this.x + offsetX;
            const posY = this.y + offsetY;
  
            const angle = 0;
            const speed = random(0.5, 1.5);
  
            this.particles.push(
              new Particle(posX, posY, this.color, angle, speed, "text")
            );
          }
        }
      }
    }
  
    createStarParticles(color) {
      const particleCount = 100;
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = random(2, 6);
        this.particles.push(
          new Particle(
            this.x,
            this.y,
            color === "green" ? "hsl(120, 100%, 50%)" : this.color,
            angle,
            speed,
            "star"
          )
        );
      }
    }
  
    draw() {
      if (!this.exploded) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        this.history.forEach((point) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
        });
        ctx.restore();
  
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
  
      this.particles.forEach((particle) => particle.draw());
    }
  }
  
  class Particle {
    constructor(
      x,
      y,
      color,
      angle = null,
      speed = null,
      explosionType = "round"
    ) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = random(1, 3);
      this.speed = speed !== null ? speed : random(1, 10);
      this.angle = angle !== null ? angle : random(0, Math.PI * 2);
      this.gravity = 0.5;
      this.friction = 0.98;
      this.opacity = 1;
      this.done = false;
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.decay = random(0.15, 0.3);
      this.history = [];
      this.maxHistory = 5;
      this.explosionType = explosionType;
    }
  
    update() {
      this.history.push({ x: this.x, y: this.y });
      if (this.history.length > this.maxHistory) {
        this.history.shift();
      }
  
      const wind = 0.2;
      this.vx += wind * (Math.random() - 0.5);
  
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
  
      if (this.opacity <= 0.1) {
        this.done = true;
      }
    }
  
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * 0.5;
      ctx.beginPath();
      if (this.history.length > 0) {
        ctx.moveTo(this.history[0].x, this.history[0].y);
        this.history.forEach((point) => ctx.lineTo(point.x, point.y));
      } else {
        ctx.moveTo(this.x, this.y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
  
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.shadowBlur = 5;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    }
  }
  
  let fireworks = [];
  
  const stars = [];
  
  const starCount = 100;
  for (let i = 0; i < starCount; i++) {
    stars.push(new Star());
  }
  
  let lastTextExplosionTime = 0;
  const textExplosionInterval = 3000;
  
  const createFirework = (isTextFirework = false, text = "") => {
    fireworks.push(new Firework(isTextFirework, text));
  };
  
  for (let i = 0; i < 3; i++) {
    setTimeout(() => createFirework(), i * 1000);
  }
  
  const drawBackground = () => {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#001d3d");
    gradient.addColorStop(0.3, "#0f3057");
    gradient.addColorStop(0.6, "#1b4965");
    gradient.addColorStop(1, "#274690");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
  const animate = () => {
    requestAnimationFrame(animate);
  
    drawBackground();
  
    stars.forEach((star) => {
      star.update();
      star.draw();
    });
  
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx.globalCompositeOperation = "lighter";
  
    fireworks.forEach((firework) => firework.update());
    fireworks.forEach((firework) => firework.draw());
  
    if (Math.random() < 0.3) {
      createFirework();
    }
  
    const currentTime = Date.now();
    if (currentTime - lastTextExplosionTime > textExplosionInterval) {
      const activeTextExplosions = fireworks.filter(
        (firework) => firework.isTextFirework && !firework.exploded
      );
      if (activeTextExplosions.length === 0) {
        const texts = ["Frohes Neues Jahr"];
        const selectedText = texts[Math.floor(Math.random() * texts.length)];
        createFirework(true, selectedText);
        lastTextExplosionTime = currentTime;
      }
    }
  
    fireworks = fireworks.filter((firework) => !firework.done);
  };
  
  animate();
  
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const firework = new Firework();
    firework.x = x;
    firework.y = canvas.height;
    firework.targetY = y;
    fireworks.push(firework);
  });
  