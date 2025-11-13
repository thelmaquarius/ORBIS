document.addEventListener('DOMContentLoaded', () => {
  const cartes = Array.from(document.querySelectorAll('.carte-nouvelles-langues'));
  const audios = cartes.map(c => c.querySelector('audio'));
  const boutonsPlay = cartes.map(c => c.querySelector('.bouton-lecture'));

  // Texte/icônes comme dans ton exemple (adapté)
  const ICON_PLAY  = '▶︎ Lecture'; // équiv. "⏵"
  const ICON_PAUSE = '⏸ Pause';    // équiv. "⏸"

  // Remet tous les autres audios à zéro et leur bouton en "Lecture"
  function stopAutres(indexActif) {
    audios.forEach((audio, i) => {
      if (i !== indexActif) {
        audio.pause();
        audio.currentTime = 0;
        if (boutonsPlay[i]) {
          boutonsPlay[i].textContent = ICON_PLAY;
          boutonsPlay[i].classList.remove('en-lecture');
          boutonsPlay[i].setAttribute('aria-label', 'Lire l’extrait audio');
        }
      }
    });
  }

  // Attache les écouteurs play/pause par carte (indexée)
  boutonsPlay.forEach((btn, index) => {
    const audio = audios[index];
    if (!btn || !audio) return;

    // Clic play/pause
    btn.addEventListener('click', () => {
      // Si on lance celui-ci, on coupe les autres
      if (audio.paused) {
        stopAutres(index);
        audio.play().then(() => {
          btn.textContent = ICON_PAUSE;
          btn.classList.add('en-lecture');
          btn.setAttribute('aria-label', 'Mettre en pause');
        }).catch(console.error);
      } else {
        audio.pause();
        btn.textContent = ICON_PLAY;
        btn.classList.remove('en-lecture');
        btn.setAttribute('aria-label', 'Lire l’extrait audio');
      }
    });

    // Quand la piste se termine
    audio.addEventListener('ended', () => {
      btn.textContent = ICON_PLAY;
      btn.classList.remove('en-lecture');
      btn.setAttribute('aria-label', 'Lire l’extrait audio');
    });

    // Si l’utilisateur met en pause via l’UI native (clavier, etc.)
    audio.addEventListener('pause', () => {
      if (!audio.ended) {
        btn.textContent = ICON_PLAY;
        btn.classList.remove('en-lecture');
        btn.setAttribute('aria-label', 'Lire l’extrait audio');
      }
    });
  });
});

//MACHINE A ECRIRE

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.texte-machine');
  if (!el) return;

  const full = el.textContent;         // texte complet existant
  el.textContent = '';                  // on part de vide

  const total = full.length || 1;
  const dureeMs = 10000;                 // ≈ 5 secondes
  const interval = Math.max(8, Math.floor(dureeMs / total)); // cadence
  let i = 0;

  const timer = setInterval(() => {
    // Ajoute plusieurs chars si besoin pour tenir le timing
    const charsParTick = Math.max(1, Math.round(total / (dureeMs / interval)));
    el.textContent += full.slice(i, i + charsParTick);
    i += charsParTick;

    if (i >= total) {
      clearInterval(timer);
      el.textContent = full;           // s'assure que tout est affiché
      // Retire le curseur après un petit délai
      setTimeout(() => { el.style.setProperty('--cursor-hide', '1'); }, 200);
    }
  }, interval);
});
