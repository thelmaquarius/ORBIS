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
});