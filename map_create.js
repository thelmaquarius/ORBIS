// map_create.js
export function mapCreate() {
  fetch("data/langages.json")
    .then((reponse) => reponse.json())
    .then((donneesLangues) => {
      // === Création de la carte ===
      const carte = L.map("map", {
        center: [49.0, 15.0],
        zoom: 5,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(carte);

      // === Fonction de calcul de distance (Haversine) ===
      function calculerDistanceKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Rayon de la Terre en km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      // === Suivi des langues déjà affichées (éviter les doublons) ===
      const languesDejaAffichees = new Set();

      // === Icône pour les dialectes ===
      const iconeDialecte = L.icon({
        iconUrl: "media/marker_dialect.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // === Icône spéciale pour les langages ===
      const iconeLangage = L.icon({
        iconUrl: "media/marker_language.png",
        iconSize: [48, 48],
        iconAnchor: [24, 48],
        popupAnchor: [0, -48],
      });

            // === Icône pour les dialectes ===
      const iconeFamille = L.icon({
        iconUrl: "media/marker_family.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // === Gestion du clic sur la carte ===
      carte.on("click", async function (evenementCarte) {
        const latitudeCliquee = evenementCarte.latlng.lat;
        const longitudeCliquee = evenementCarte.latlng.lng;

        console.log("Clic :", latitudeCliquee, longitudeCliquee);

        // === Recherche de la langue la plus proche ===
        let langueLaPlusProche = null;
        let distanceMinimale = Infinity;

        donneesLangues.forEach((langue) => {
          const dist = calculerDistanceKm(
            latitudeCliquee,
            longitudeCliquee,
            langue.Latitude,
            langue.Longitude
          );

          if (dist < distanceMinimale) {
            distanceMinimale = dist;
            langueLaPlusProche = langue;
          }
        });

        if (!langueLaPlusProche) return;

        // === Si elle est déjà affichée → on ne fait rien ===
        if (languesDejaAffichees.has(langueLaPlusProche.Name)) {
          console.log(
            `! ${langueLaPlusProche.Name} est déjà affichée sur la carte.`
          );
          return;
        }

        languesDejaAffichees.add(langueLaPlusProche.Name);

        // === Récupération des informations ===
        const anneeDocumentation =
          langueLaPlusProche.First_Year_Of_Documentation &&
          langueLaPlusProche.First_Year_Of_Documentation !== ""
            ? langueLaPlusProche.First_Year_Of_Documentation
            : "Inconnue";

        const typeLangue = langueLaPlusProche.Level || "Non spécifié";

        // === Récupération du pays via Nominatim ===
        let paysOrigine = "Inconnu";

        try {
          const reponsePays = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${langueLaPlusProche.Latitude}&lon=${langueLaPlusProche.Longitude}&format=json`
          );

          const informationsNominatim = await reponsePays.json();
          paysOrigine =
            informationsNominatim.address?.country || "Inconnu";
        } catch (erreur) {
          console.warn("Erreur lors de la récupération du pays :", erreur);
        }

        console.log(
          `V Langue trouvée : ${langueLaPlusProche.Name} (${typeLangue}) — ` +
            `Documentation : ${anneeDocumentation} — Pays : ${paysOrigine}`
        );

        // === Détermination de l'icône à utiliser ===
        const iconeAUtiliser =
          typeLangue && typeLangue.toLowerCase() === "language"
            ? iconeLangage
            : typeLangue && typeLangue.toLowerCase() === "family"
            ? iconeFamille
            : iconeDialecte;

        // === Ajout du marqueur sur la carte ===
        L.marker(
          [langueLaPlusProche.Latitude, langueLaPlusProche.Longitude],
          { icon: iconeAUtiliser }
        )
          .addTo(carte)
          .bindPopup(
            `<b>${langueLaPlusProche.Name}</b><br>
             Type : ${typeLangue}<br>
             Première documentation : ${anneeDocumentation}<br>
             Pays : ${paysOrigine}`
          )
          .openPopup();
      });
    });
}
