// scrollGraph.js
// ========================================
// Animation du graphique à barres synchronisée avec le scroll
// ========================================

export async function initScrollGraph() {
  // --- 1. Récupération du JSON ---
  const res = await fetch("/data/evolution_20_langues_interpolated.json");
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Aucune donnée valide trouvée !");
    return;
  }

  // --- 2. Extraction des métadonnées ---
  // Récupérer la liste des années (ex : ["1900", "1901", ..., "2025"])
  const allYears = Object.keys(data[0])
    .filter((key) => /^\d{4}$/.test(key))
    .map((y) => parseInt(y))
    .sort((a, b) => a - b);

  const numSteps = allYears.length; // ~150 années interpolées

  // Récupérer les labels (langues/pays)
  const labels = data.map((d) => d.label);

  // Couleurs distinctes (Chart.js génère aussi des couleurs si tu veux)
  const colors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#6F9D5C",
    "#E56B6F",
    "#FFD166",
    "#06D6A0",
    "#118AB2",
    "#073B4C",
    "#EF476F",
    "#8338EC",
    "#FFBE0B",
    "#3A86FF",
    "#8ECAE6",
    "#219EBC",
    "#023047",
  ];

  // --- 3. Préparation du graphique ---
  const ctx = document.getElementById("myChart").getContext("2d");

  // Données initiales (première année)
  const initialYear = allYears[0];
  const initialValues = data.map((d) => d[initialYear]);
  const yearOverlay = document.getElementById('year-overlay');


  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: `Population (${initialYear})`,
          data: initialValues,
          backgroundColor: colors.slice(0, data.length),
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 0.1 },
      plugins: {
        legend: { display: false },
        title: { display: false },
      },
      scales: {
        x: { ticks: { color: "#333", font: { weight: "bold" } } },
        y: {
          min: 20000000,
          max: 1700000000,
          ticks: { color: "#333" },
        },
      },
    },
  });

  // --- 4. Overlay pour afficher l’année ---
  const yearDisplay = document.createElement("div");
  yearDisplay.id = "year-display";
  Object.assign(yearDisplay.style, {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "10rem",
    fontWeight: "700",
    color: "rgba(200,200,200,0.2)",
    pointerEvents: "none",
    zIndex: "1",
  });
  document.getElementById("graph-container").appendChild(yearDisplay);

  // --- 5. Scroll binding ---
  const graphContainer = document.getElementById("graph-container");
  const offset = 200; // déclenchement avant le container
  const canvasHeight = ctx.canvas.offsetHeight;
  const scrollStart = graphContainer.offsetTop - offset;
  const scrollRange = 1.7 * canvasHeight;

  let lastIndex = -1;

  function updateChartForScroll(scrollY) {
    if (scrollY < scrollStart) return;
    if (scrollY > scrollStart + scrollRange) return;

    const progress = (scrollY - scrollStart) / scrollRange;
    const index = Math.floor(progress * (numSteps - 1));

    // Éviter de recalculer si on est sur la même année
    if (index === lastIndex) return;
    lastIndex = index;

    const currentYear = allYears[index];

    // Met à jour toutes les barres
    myChart.data.datasets[0].data = data.map((d) => d[currentYear]);
    myChart.data.datasets[0].label = `Population (${currentYear})`;
    yearDisplay.textContent = currentYear;

    myChart.update();
  }

  // Rafraîchissement fluide via requestAnimationFrame
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateChartForScroll(window.scrollY);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initialisation (au cas où on est déjà scrollé)
  updateChartForScroll(window.scrollY);
}
