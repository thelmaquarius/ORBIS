// f_filResponsive.js
// =====================================================
// Génération dynamique d’un fil SVG reliant les ancres
// -----------------------------------------------------
// - Chaque section “.bloc” possède .ancre-start et .ancre-end
// - Ce script relie automatiquement la fin d’un bloc au suivant
// =====================================================

export function initFilResponsive() {
  const svg = document.getElementById("fil-dynamique");
  if (!svg) {
    console.warn("⚠️ Aucun SVG trouvé avec l’ID #fil-dynamique");
    return;
  }

  // =====================================================
  // 🧩 Fonction principale : recalculer et redessiner les fils
  // =====================================================
  function majFil() {
    const ancres = [...document.querySelectorAll(".ancre-start, .ancre-end")];
    if (ancres.length === 0) return;

    // 1️⃣ Dimensions globales du document
    const totalHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      window.innerHeight
    );

    svg.setAttribute("width", window.innerWidth);
    svg.setAttribute("height", totalHeight);
    svg.setAttribute("viewBox", `0 0 ${window.innerWidth} ${totalHeight}`);
    svg.innerHTML = ""; // nettoyage complet

    // ⚠️ ⚠️ ⚠️ On définit D’ABORD le headerOffset avant tout calcul
    const intro = document.getElementById("intro");
    const headerOffset =
      intro && intro.classList.contains("fini") ? intro.offsetHeight : 0;

    // 2️⃣ Calcul des coordonnées absolues pour chaque ancre
    const points = ancres.map((a) => {
      const rect = a.getBoundingClientRect();
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + scrollTop + rect.height / 2 - headerOffset,
        el: a,
      };
    });

    // 3️⃣ Relier les paires d’ancres (end → start du bloc suivant)
    const starts = [...document.querySelectorAll(".ancre-start")];
    starts.forEach((start, i) => {
      const end = start.closest(".bloc")?.querySelector(".ancre-end");
      const nextStart = starts[i + 1];

      if (end && nextStart) {
        const p1 = points.find((p) => p.el === end);
        const p2 = points.find((p) => p.el === nextStart);
        if (p1 && p2) dessinerCourbe(p1, p2);
      }
    });
  }

  // =====================================================
  // ✏️ Fonction pour dessiner une courbe entre deux points
  // =====================================================
  function dessinerCourbe(p1, p2) {
    const dx = (p2.x - p1.x) * 0.3;
    const dy = (p2.y - p1.y) * 0.3;

    const pathData = `
      M ${p1.x} ${p1.y}
      C ${p1.x + dx} ${p1.y + dy},
        ${p2.x - dx} ${p2.y - dy},
        ${p2.x} ${p2.y}
    `;

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData.trim());
    path.classList.add("fil-ligne"); // stylé via CSS
    svg.appendChild(path);
  }

  // =====================================================
  // 🔁 Rafraîchissement automatique (scroll / resize)
  // =====================================================
  const debouncedMajFil = debounce(majFil, 100);
  setTimeout(majFil, 600);
  window.addEventListener("resize", debouncedMajFil);
  window.addEventListener("scroll", debouncedMajFil);
}

// =====================================================
// ⏱️ Utilitaire : évite de recalculer trop souvent
// =====================================================
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
