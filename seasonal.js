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
  
  const seasonTextEl = document.getElementById("season-text");
  if (seasonTextEl) seasonTextEl.innerText = theme.toUpperCase();

  /* Day / Night Calculation */
  function updateDayNightCycle() {
    const date = new Date();
    const hours = date.getHours() + date.getMinutes() / 60;
    let nightOpacity = 0;

    if (hours >= 18 && hours < 20) {
      nightOpacity = ((hours - 18) / 2) * 0.6;
    } else if (hours >= 20 || hours < 6) {
      nightOpacity = 0.6;
    } else if (hours >= 6 && hours < 8) {
      nightOpacity = (1 - (hours - 6) / 2) * 0.6;
    }

    document.documentElement.style.setProperty("--night-opacity", nightOpacity);
  }

  updateDayNightCycle();
  setInterval(updateDayNightCycle, 60000);

  /* Interaktives Tech-Partikelnetzwerk (Canvas) */
  const canvas = document.createElement("canvas");
  canvas.id = "seasonal-canvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", function () {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  /* Theme Color Palette Mapping */
  function getThemeRGB(t) {
    switch(t) {
      case "winter":
      case "weihnachten": return "56, 189, 248";  // Blue/Cyan
      case "herbst": return "249, 115, 22";       // Orange
      case "fruehling":
      case "ostern": return "16, 185, 129";      // Emerald
      default: return "245, 158, 11";             // Gold/Amber
    }
  }

  const baseRGB = getThemeRGB(theme);
  const particleCount = Math.min(Math.floor(width / 18), 50);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw Node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${baseRGB}, 0.7)`;
      ctx.fill();

      // Connect Nodes with Lines
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${baseRGB}, ${0.25 - dist / 440})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Mouse Interaction
      if (mouse.x !== null) {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${baseRGB}, ${0.4 - dist / (mouse.radius * 2.5)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
