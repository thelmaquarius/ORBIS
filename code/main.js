// main.js
import { initVideoScroll } from './f_videoScroll.js';
import { decodeText } from './f_decodeText.js';

window.addEventListener('DOMContentLoaded', () => {
  initVideoScroll();

  const titreElement = document.querySelector('.titre');
  if (titreElement) {
    const targetText = titreElement.innerHTML;
    decodeText(targetText, 11000, 'titre');
  }

/*   var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> ' +
                 '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map); */

fetch('/data/langages.json')
  .then(response => response.json())
  .then(data => {
    // Création de la carte
    var map = L.map('map').setView([20, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Pour chaque langage, création d'un marker
    data.forEach(lang => {
      const lat = lang.Latitude;
      const lng = lang.Longitude;

      if (lat && lng) {
        let popupContent = `<strong>${lang.Name}</strong><br>`;
        if (lang.Level) popupContent += `Level: ${lang.Level}<br>`;
        if (lang.First_Year_Of_Documentation) popupContent += `Découverte: ${lang.First_Year_Of_Documentation}<br>`;
        if (lang.Last_Year_Of_Documentation) popupContent += `Disparition: ${lang.Last_Year_Of_Documentation}`;

        L.marker([lat, lng])
          .addTo(map)
          .bindPopup(popupContent);
      }
    });
  })
  .catch(err => console.error('Erreur lors du chargement du JSON :', err));
});