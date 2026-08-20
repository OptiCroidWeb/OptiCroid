document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

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
  const seasonTextEl = document.getElementById("season-name");
  if (seasonTextEl) seasonTextEl.innerText = theme;

  /* Tag & Nacht Berechnung */
  function updateDayNightCycle() {
    const date = new Date();
    const hours = date.getHours() + date.getMinutes() / 60;
    let nightOpacity = 0;

    if (hours >= 18 && hours < 20) {
      nightOpacity = (hours - 18) / 2 * 0.72;
    } else if (hours >= 20 || hours < 6) {
      nightOpacity = 0.72;
    } else if (hours >= 6 && hours < 8) {
      nightOpacity = (1 - (hours - 6) / 2) * 0.72;
    } else {
      nightOpacity = 0;
    }

    document.documentElement.style.setProperty("--night-opacity", nightOpacity);

    if (nightOpacity > 0.3) {
      document.body.classList.add("is-night");
    } else {
      document.body.classList.remove("is-night");
    }

    return nightOpacity;
  }

  let currentNightOpacity = updateDayNightCycle();
  setInterval(updateDayNightCycle, 60000);

  /* Canvas & Partikel (Fokus von der rechten oberen Ecke) */
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

  const particleCount = width < 600 ? 25 : 45;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: width - Math.random() * 300,
      y: Math.random() * 200,
      size: Math.random() * 3.5 + 1.5,
      speedY: Math.random() * 0.8 + 0.2,
      speedX: -(Math.random() * 0.8 + 0.2),
      step: Math.random() * 100,
      stepSize: Math.random() * 0.015 + 0.008,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 1.5 - 0.75,
      color: getRandomColor(theme)
    });
  }

  function getRandomColor(t) {
    if (t === "winter" || t === "weihnachten") return "rgba(255, 255, 255, 0.85)";
    if (t === "herbst") {
      const colors = ["rgba(254, 240, 138, 0.85)", "rgba(253, 186, 116, 0.8)", "rgba(251, 146, 60, 0.8)"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    if (t === "fruehling" || t === "ostern") {
      const colors = ["rgba(255, 255, 255, 0.85)", "rgba(244, 114, 182, 0.8)", "rgba(167, 243, 208, 0.8)"];
      return colors[Math.floor(Math.random() * colors.length)];
    }
    return "rgba(254, 240, 138, 0.85)";
  }

  function drawParticle(p) {
    ctx.save();
    ctx.translate(p.x, p.y);

    if (theme === "winter" || theme === "weihnachten") {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    } else {
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 1.8, p.size * 1, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.step += p.stepSize;
      p.rotation += p.rotSpeed;

      p.y += p.speedY;
      p.x += Math.sin(p.step) * 0.6 + p.speedX;

      if (p.y > height + 10 || p.x < -10) {
        p.y = Math.random() * 100 - 20;
        p.x = width - Math.random() * 250;
      }

      drawParticle(p);
    });

    requestAnimationFrame(animate);
  }

  animate();
});
