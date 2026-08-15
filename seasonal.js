document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // 1 = Jan, 12 = Dez
  const year = now.getFullYear();

  // Gaußsche Osterformel
  function getEasterSunday(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100;
    const d = Math.floor(b / 4), e = b % 4;
    const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
    const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, easterMonth - 1, easterDay);
  }

  const easter = getEasterSunday(year);
  const easterStart = new Date(easter); easterStart.setDate(easter.getDate() - 2);
  const easterEnd = new Date(easter); easterEnd.setDate(easter.getDate() + 1);

  let theme = "sommer";
  if (now >= easterStart && now <= easterEnd) {
    theme = "ostern";
  } else if (month === 12 && day <= 26) {
    theme = "weihnachten";
  } else if ((month === 12 && day > 26) || month === 1 || month === 2 || month === 11) {
    theme = "winter";
  } else if (month >= 3 && month <= 5) {
    theme = "fruehling";
  } else if (month >= 6 && month <= 8) {
    theme = "sommer";
  } else if (month >= 9 && month <= 10) {
    theme = "herbst";
  }

  document.body.classList.add("theme-" + theme);

  // Erstelle Canvas für die Animation
  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Partikel-System
  const particleCount = width < 600 ? 35 : 65;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1.5,
      speedY: Math.random() * 1.2 + 0.5,
      speedX: Math.random() * 0.8 - 0.4,
      step: Math.random() * 100,
      stepSize: Math.random() * 0.02 + 0.01,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 2 - 1,
      color: getRandomColor(theme)
    });
  }

  function getRandomColor(t) {
    if (t === "winter" || t === "weihnachten") return "rgba(255, 255, 255, 0.85)";
    if (t === "herbst") {
      const colors = ["rgba(251, 133, 0, 0.7)", "rgba(217, 119, 6, 0.7)", "rgba(180, 83, 9, 0.7)"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    if (t === "fruehling" || t === "ostern") return "rgba(244, 114, 182, 0.75)";
    return "rgba(255, 214, 10, 0.65)"; // Sommer Sparkles
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    if (theme === "winter" || theme === "weihnachten") {
      // Schnee (Weich gezeichnete Flocken)
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255,255,255,0.8)";
      ctx.fill();
    } else if (theme === "herbst") {
      // Laubblätter (Ovale mit Drehung)
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 2.5, p.size * 1.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else if (theme === "fruehling" || theme === "ostern") {
      // Blütenblätter
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 2, p.size * 1.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      // Sommer Sparkles
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(255, 183, 3, 0.8)";
      ctx.fill();
    }

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.step += p.stepSize;
      p.rotation += p.rotSpeed;

      // Dynamische Bewegung (Seitlicher Sumpf/Wind)
      if (theme === "sommer") {
        p.y -= p.speedY * 0.5; // Sommer-Sparkles steigen sanft auf
        p.x += Math.sin(p.step) * 0.6;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      } else {
        p.y += p.speedY;
        p.x += Math.sin(p.step) * (theme === "herbst" ? 1.4 : 0.8) + p.speedX;
        if (p.y > height + 10) { p.y = -10; p.x = Math.random() * width; }
      }

      drawParticle(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
});
