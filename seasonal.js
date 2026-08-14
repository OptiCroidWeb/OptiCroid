document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1; // 1 = Januar, 12 = Dezember
  const year = now.getFullYear();

  // Datum formatieren (z. B. 14.08.2026)
  const formattedDay = String(day).padStart(2, "0");
  const formattedMonth = String(month).padStart(2, "0");
  const dateString = `${formattedDay}.${formattedMonth}.${year}`;

  // Funktion zur Berechnung des Ostersonntags (Gaußsche Osterformel)
  function getEasterSunday(y) {
    const a = y % 19;
    const b = Math.floor(y / 100);
    const c = y % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }

  // Bestimme Jahreszeit / Anlass
  let seasonName = "Sommer";
  let seasonIcon = "☀️";
  let themeClass = "theme-sommer";

  // Osterzeit prüfen (vom Karfreitag bis Ostermontag)
  const easter = getEasterSunday(year);
  const easterStart = new Date(easter);
  easterStart.setDate(easter.getDate() - 2); // Karfreitag
  const easterEnd = new Date(easter);
  easterEnd.setDate(easter.getDate() + 1); // Ostermontag

  if (now >= easterStart && now <= easterEnd) {
    seasonName = "Ostern";
    seasonIcon = "🐰🥚";
    themeClass = "theme-ostern";
  } else if (month === 12 && day <= 26) {
    // Weihnachtszeit
    seasonName = "Weihnachten";
    seasonIcon = "🎄";
    themeClass = "theme-weihnachten";
  } else if (
    (month === 12 && day > 26) ||
    month === 1 ||
    month === 2
  ) {
    // Winter
    seasonName = "Winter";
    seasonIcon = "❄️";
    themeClass = "theme-winter";
  } else if (month >= 3 && month <= 5) {
    // Frühling
    seasonName = "Frühling";
    seasonIcon = "🌱";
    themeClass = "theme-fruehling";
  } else if (month >= 6 && month <= 8) {
    // Sommer
    seasonName = "Sommer";
    seasonIcon = "☀️";
    themeClass = "theme-sommer";
  } else if (month >= 9 && month <= 11) {
    // Herbst
    seasonName = "Herbst";
    seasonIcon = "🍂";
    themeClass = "theme-herbst";
  }

  // Theme auf <body> anwenden
  document.body.classList.add(themeClass);

  // Anzeigeelement oben links erstellen und einfügen
  const badge = document.createElement("div");
  badge.className = "date-season-badge";
  badge.innerHTML = `<span>${dateString} ${seasonName}</span> <span>${seasonIcon}</span>`;
  document.body.appendChild(badge);
});
