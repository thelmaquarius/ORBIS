// f_filScroll.js

/* ===============================
   Génération de la courbe responsive
   =============================== */

/* function generateCurve() { Version sans chatGPT mais c'est pas très beau))
    const svg = document.getElementById("fil-svg");
    svg.innerHTML = ""; 

    
    const rects = Array.from(document.querySelectorAll(".x")).map((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        return {
            top:    { x: centerX, y: rect.top - 10 },
            bottom: { x: centerX, y: rect.bottom + 10 }
        };
    });

    
    for (let i = 0; i < rects.length - 1; i++) {
        const p1 = rects[i].bottom;
        const p2 = rects[i + 1].top;

        
        const ctrl1 = { x: p1.x, y: (p1.y + p2.y) / 2 };
        const ctrl2 = { x: p2.x, y: (p1.y + p2.y) / 2 };

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d",
            `M ${p1.x},${p1.y}
             C ${ctrl1.x},${ctrl1.y}
               ${ctrl2.x},${ctrl2.y}
               ${p2.x},${p2.y}`
        );
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "white");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("stroke-dasharray", "6 6");

        svg.appendChild(path);
    }
} */

export function initFilScroll() {

  // ==========================
  // CONFIGURATION
  // ==========================
  let randomMode = 0;       // 1 = aléatoire ON, 0 = OFF
  let randomStrength = 0;   // intensité (0 = pas d'aléatoire, 1 = normal, 2 = fort…)


  // =====================================================
  // FONCTION PRINCIPALE : GÉNÉRER LA COURBE ENTRE LES BOÎTES
  // =====================================================
  function generateCurve() {
    const svg = document.getElementById("fil-svg");
    if (!svg) return;
    svg.innerHTML = "";

    // Points d'entrée/sortie autour des .x
    const rects = Array.from(document.querySelectorAll(".x")).map((el) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      return {
        top:    { x: centerX, y: rect.top - 10 },
        bottom: { x: centerX, y: rect.bottom + 10 },
      };
    });

    // =====================================================
    // Catmull-Rom → Bézier (pour lisser)
    // =====================================================
    function catmullRom2bezier(points) {
      let d = "";
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2] || points[i + 1];

        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;

        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;

        d += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y} `;
      }
      return d;
    }


    // =====================================================
    // Random contrôlé (ON/OFF + intensité)
    // =====================================================
    function rand(amp) {
      if (!randomMode) return 0;
      return (Math.random() * amp * 2 - amp) * randomStrength;
    }


    // =====================================================
    // FABRICATION D’UN SEGMENT “CRAYON” ENTRE p1 & p2
    // =====================================================
    function createStyledPath(p1, p2) {
      const points = [];
      const dy = p2.y - p1.y;

      // ---- Segment droit de sortie ----
      const exitLen = 25;
      points.push({ x: p1.x, y: p1.y });
      points.push({ x: p1.x, y: p1.y + exitLen });

      // ---- Organisation des motifs ----
      const usableDy = dy - exitLen * 2;
      const motifCount = usableDy > 300 ? 3 : usableDy > 180 ? 2 : 1;
      const motifHeight = usableDy / motifCount;

      // ---- Motifs de base ----
      function motifS(h, amp) {
        return [
          { dx: amp,    dy: h * 0.33 },
          { dx: -amp,   dy: h * 0.66 },
          { dx: 0,      dy: h },
        ];
      }

      function motifLoop(h, amp) {
        return [
          { dx: amp/2,   dy: h * 0.25 },
          { dx: -amp/2,  dy: h * 0.5  },
          { dx: amp/2,   dy: h * 0.75 },
          { dx: 0,       dy: h },
        ];
      }

      const motifs = [motifS, motifLoop];

      // ---- Point courant ----
      let curX = p1.x;
      let curY = p1.y + exitLen;

      // ---- Appliquer les motifs ----
      for (let i = 0; i < motifCount; i++) {
        const motifFn = motifs[i % motifs.length];
        const baseAmp = 20 + rand(5);

        const seq = motifFn(motifHeight, baseAmp);

        seq.forEach((step, index) => {
          const t = index / seq.length;

          // Random atténué (plus fort au milieu, très faible proche des boîtes)
          const fade = 1 - Math.abs(t - 0.5) * 1.8;
          const jitterX = rand(4) * fade;
          const jitterY = rand(2) * fade;

          points.push({
            x: curX + step.dx + jitterX,
            y: curY + step.dy + jitterY,
          });
        });

        curX = points[points.length - 1].x;
        curY = points[points.length - 1].y;
      }

      // ---- Segment droit d’entrée ----
      points.push({ x: p2.x, y: p2.y - exitLen });
      points.push({ x: p2.x, y: p2.y });

      // ---- Conversion spline ----
      return "M " + p1.x + "," + p1.y + " " + catmullRom2bezier(points);
    }


    // =====================================================
    // GÉNÉRATION DE TOUS LES SEGMENTS
    // =====================================================
    for (let i = 0; i < rects.length - 1; i++) {
      const p1 = rects[i].bottom;
      const p2 = rects[i + 1].top;

      const d = createStyledPath(p1, p2);

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "white");
      path.setAttribute("stroke-width", "1.2");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-dasharray", "6 6");

      svg.appendChild(path);
    }
  }


  // ==========================
  // PREMIER TRAÇAGE
  // ==========================
  generateCurve();


  // ==========================
  // RESPONSIVE
  // ==========================
  window.addEventListener("resize", generateCurve);
  window.addEventListener("scroll", generateCurve);


  // ==========================
  // OPTION : exposer un toggle
  // ==========================
  return {
    enableRandom()  { randomMode = 1; generateCurve(); },
    disableRandom() { randomMode = 0; generateCurve(); },
    setStrength(v)  { randomStrength = v; generateCurve(); }
  };
}
