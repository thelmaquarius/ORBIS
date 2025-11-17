// f_extinctionScroll.js

export function initExtinctionScroll({
    containerId = "extinction-scroll",
    jsonPath = "date_extinction.json",
    interval = 3000 // temps entre chaque langue (ms)
} = {}) {

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Conteneur #${containerId} introuvable`);
        return;
    }

    // Style minimal pour le fondu
    container.style.transition = "opacity 0.6s ease";
    container.style.opacity = 0;

    let index = 0;
    let data = [];

    // ==============================
    // 1) Charger les données JSON
    // ==============================
    fetch(jsonPath)
        .then(res => res.json())
        .then(json => {
            data = json;
            if (!data.length) return;
            showEntry();           // Premier affichage
            setInterval(nextEntry, interval); // Défilement auto
        })
        .catch(err => console.error("Erreur chargement JSON :", err));


    // ==============================
    // 2) Afficher une entrée
    // ==============================
    function showEntry() {
        const entry = data[index];

        // Tu peux personnaliser l'affichage ici
        container.innerHTML = `
            <div class="lang-entry">
                <div class="lang-name">${entry.Language}</div>
                <div class="lang-year"> Langue éteinte en ${entry.Date_claire_normalisée}</div>
                <div class="lang-region">${entry.Region}</div>
            </div>
        `;

        // Effet apparition
        container.style.opacity = 1;
    }


    // ==============================
    // 3) Passer à la suivante
    // ==============================
    function nextEntry() {
        // Effet disparition
        container.style.opacity = 0;

        setTimeout(() => {
            index = (index + 1) % data.length; // boucle infinie
            showEntry();
        }, 600);
    }
}
