// scrollGraph.js
// ========================================
// Animation du graphique à barres (amCharts 5) synchronisée avec le scroll
// ========================================
export async function initScrollGraph() {
  // --- 1️ Chargement des données JSON ---
  // On récupère le fichier des 20 langues interpolées (1900 → 2025)
  const res = await fetch("/data/evolution_20_langues_interpolated.json");
  const data = await res.json();

  // Vérification basique
  if (!Array.isArray(data) || data.length === 0) {
    console.error("❌ Aucune donnée valide trouvée !");
    return;
  }

  // --- 2️ Extraction des métadonnées ---
  // On récupère toutes les clés correspondant à des années ("1900", "1901", …)
  const allYears = Object.keys(data[0])
    .filter((key) => /^\d{4}$/.test(key)) // garde uniquement les années au format 4 chiffres
    .map(Number)
    .sort((a, b) => a - b); // tri chronologique

  const numSteps = allYears.length; // ≈150 années interpolées

  // Les labels des barres (noms des langues/pays)
  const labels = data.map((d) => d.label);

  // Palette de couleurs pour 20 barres (tu peux la personnaliser)
  const colors = [
    "#FF6384", "#eb8536ff", "#ffcf56c9", "#a3482aff", "#ff5e08ff",
    "#FF9F40", "#965d24ff", "#dd6a28ff", "#E56B6F", "#FFD166",
    "#d63d06ff", "#b0702fff", "#b03733ff", "#EF476F", "#da6e2bff",
    "#FFBE0B", "#f8903bff", "#f2d119ff", "#e84f21ff", "#c15b1fff",
  ];

  // --- 3️ Initialisation du graphique Chart.js ---
  const ctx = document.getElementById("myChart").getContext("2d");
  const yearDisplay = document.getElementById("year-display"); // overlay HTML déjà présent dans le DOM

  // Année et valeurs initiales
  const initialYear = allYears[0];
  const initialValues = data.map((d) => d[initialYear]);

  // Création du graphique
  const myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: `Population (${initialYear})`,
        data: initialValues,
        backgroundColor: colors.slice(0, data.length),
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 0 }, // pas d’animation Chart.js (on gère nous-mêmes le scroll)
      plugins: {
        legend: { display: false }, // on cache la légende pour épurer
        title: { display: false },
      },
      scales: {
        x: {
          ticks: { color: "#333", font: { weight: "bold" } },
        },
        y: {
          //  Bornes fixes pour éviter les variations de hauteur
          min: 20000000,
          max: 1700000000,
          ticks: {
            color: "#333",
            callback: (value) => value.toLocaleString(), // formatage lisible
          },
          title: {
            display: true,
            text: "Nombre de locuteurs (approx.)",
          },
        },
      },
    },
  });

  // --- 4️ Paramétrage du scroll ---
  const graphContainer = document.getElementById("graph-container");

  const offset = 0; // démarre un peu avant le container
  const canvasHeight = ctx.canvas.offsetHeight; // hauteur du canvas visible
  const scrollStart = graphContainer.offsetTop - offset; // début de l’animation
  const scrollRange = 1.7 * canvasHeight; // longueur de scroll pour 1900 → 2025

  let lastIndex = -1; // pour éviter les updates inutiles

  /**
   * Met à jour le graphique et l’overlay selon la position de scroll
   * @param {number} scrollY - position verticale actuelle
   */
  function updateChartForScroll(scrollY) {
    // En dehors de la zone d’animation → on ne fait rien
    if (scrollY < scrollStart || scrollY > scrollStart + scrollRange) return;

    // Ratio de progression (0 → 1)
    const progress = (scrollY - scrollStart) / scrollRange;

    // Index correspondant à l’année
    const index = Math.floor(progress * (numSteps - 1));
    if (index === lastIndex) return; // évite les recalculs si on reste sur la même année
    lastIndex = index;

    const currentYear = allYears[index];

    // --- Met à jour les données ---
    myChart.data.datasets[0].data = data.map((d) => d[currentYear]);
    myChart.data.datasets[0].label = `Population (${currentYear})`;

    // --- Met à jour le texte de l’overlay ---
    yearDisplay.textContent = currentYear;

    // --- Rafraîchit le graphique ---
    myChart.update();
  }

  // --- 5️ Liaison au scroll avec requestAnimationFrame ---
  // (plus fluide et performant que d’appeler directement dans l’événement)
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

  // --- 6️ Initialisation (si la page est déjà scrollée au chargement) ---
  updateChartForScroll(window.scrollY);
};
