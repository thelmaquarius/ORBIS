// main.js
import { initVideoScroll } from './f_videoScroll.js';
import { decodeText } from './f_decodeText.js';
import { mapCreate } from './map_create.js';

window.addEventListener('DOMContentLoaded', () => {
  mapCreate();
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


});