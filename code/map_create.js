// map_create.js
export function mapCreate() {
  fetch("/data/langages.json")
    .then((response) => response.json())
    .then((data) => {
      // Création de la carte
       var map = L.map('map', {
        center: [49.0, 15.0],
        zoom: 5,
        scrollWheelZoom: false
    });

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      // Fonction pour calculer la distance (formule de Haversine - copié du net)
      function distance(lat1, lon1, lat2, lon2) {
        const R = 6371; // km
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

      // Gestion du clic sur la carte
      map.on("click", function (e) {
        const latMap = e.latlng.lat;
        const lngMap = e.latlng.lng;
        console.log("📍 Clic :", latMap, lngMap);

        // Trouver la langue la plus proche
        let closest = null;
        let minDist = Infinity;

        data.forEach((lang) => {
          const dist = distance(latMap, lngMap, lang.Latitude, lang.Longitude);
          if (dist < minDist) {
            minDist = dist;
            closest = lang;
          }
        });

        if (closest) {
          // Gestion des valeurs manquantes
          const year =
            closest.First_Year_Of_Documentation && closest.First_Year_Of_Documentation !== ""
              ? closest.First_Year_Of_Documentation
              : "Inconnue";

          const level = closest.Level ? closest.Level : "Non spécifié";

          console.log(
            `Langue trouvée : ${closest.Name} (${level}) - découverte : ${year}`
          );

          // Ajouter un marqueur et une popup
          L.marker([closest.Latitude, closest.Longitude])
            .addTo(map)
            .bindPopup(
              `<b>${closest.Name}</b><br>
              Type : ${level}<br>
              Découverte : ${year}<br>
              Distance : ${minDist.toFixed(2)} km`
            )
            .openPopup();
        }
      });
    });
}
