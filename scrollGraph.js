// ========================================
// Graphique à barres (Chart.js) avec sélection d’année par curseur
// ========================================
export async function initScrollGraph() {
  // --- Chargement des données JSON ---
  const res = await fetch("/data/evolution_20_langues_interpolated.json");
  const data = await res.json();

  if (!Array.isArray(data) || data.length === 0) {
    console.error("❌ Aucune donnée valide trouvée !");
    return;
  }

  // --- Extraction des métadonnées ---
  const allYears = Object.keys(data[0])
    .filter((key) => /^\d{4}$/.test(key))
    .map(Number)
    .sort((a, b) => a - b);

  const labels = data.map((d) => d.label);

const colors = [
  "#8a5524",
  "#9e632a",
  "#b0702f",
  "#c27d35",
  "#cf8740",
  "#d88f48",
  "#e09853",
  "#eaa260",
  "#f2ad6c",
  "#f7b776",
  "#f6c088",
  "#f6ca96",
  "#f6d4a4",
  "#f6ddaf",
  "#f6e6bd",
  "#a83822",
  "#c24921",
  "#d65823",
  "#e26727",
  "#f07b2f"
];
  // --- Initialisation du graphique ---
  const ctx = document.getElementById("myChart").getContext("2d");
  const yearDisplay = document.getElementById("year-display");

  const initialYear = allYears[0];
  const initialValues = data.map((d) => d[initialYear]);

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
      animation: { duration: 0 }, // pas d’animation, synchro via slider
      plugins: {
        legend: { display: false }, //
        title: { display: false }, // pas de titre général
      },
      scales: {
        x: {
          ticks: {
            color: "#ffffff", // labels des langues
            font: { weight: "bold", size: 13 },
          },
          grid: {
            color: "rgba(255,255,255,0.05)", // lignes horizontales discrètes
          },
        },
        y: {
          min: 20000000, //
          max: 1700000000, //
          ticks: {
            color: "#ffffff", // chiffres en blanc
            callback: (value) => value.toLocaleString(), // formatage lisible
            font: { size: 12 },
          },
          title: {
            display: true,
            text: "Nombre de locuteurs (approx.)",
            color: "#ffffff", // axe Y blanc
            font: { weight: "bold", size: 14 },
          },
          grid: {
            color: "rgba(255,255,255,0.08)", // lignes verticales légères
          },
        },
      },
    },
  });

  // --- Barre de sélection d’année ---
  const slider = document.getElementById("year-slider");
  slider.min = allYears[0];
  slider.max = allYears[allYears.length - 1];
  slider.step = 1;
  slider.value = initialYear;

  slider.addEventListener("input", (e) => {
    const currentYear = parseInt(e.target.value);
    myChart.data.datasets[0].data = data.map((d) => d[currentYear]);
    myChart.data.datasets[0].label = `Population (${currentYear})`;
    yearDisplay.textContent = currentYear;
    myChart.update();
  });
}