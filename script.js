document.addEventListener('DOMContentLoaded', () => {
  const cartes = Array.from(document.querySelectorAll('.carte-nouvelles-langues'));
  const audios = cartes.map(c => c.querySelector('audio'));
  const boutonsPlay = cartes.map(c => c.querySelector('.bouton-lecture'));
  
  const ICON_PLAY  = '▶︎ Lecture';
  const ICON_PAUSE = '⏸ Pause';

  function stopAutres(indexActif) {
    audios.forEach((audio, i) => {
      if (i !== indexActif) {
        audio.pause();
        audio.currentTime = 0;
        if (boutonsPlay[i]) {
          const langueAutre = cartes[i].querySelector('.nom-langue')?.textContent.trim() || 'la langue';
          boutonsPlay[i].textContent = ICON_PLAY;
          boutonsPlay[i].classList.remove('en-lecture');
          boutonsPlay[i].setAttribute('aria-label', `Lire l’extrait audio de ${langueAutre}`);
        }
      }
    });
  }

  boutonsPlay.forEach((btn, index) => {
    const audio = audios[index];
    if (!btn || !audio) return;

    const langue = cartes[index].querySelector('.nom-langue')?.textContent.trim() || 'la langue';
    btn.setAttribute('aria-label', `Lire l’extrait audio de ${langue}`);

    btn.addEventListener('click', () => {

      if (audio.paused) {
        stopAutres(index);
        audio.play().then(() => {
          btn.textContent = ICON_PAUSE;
          btn.classList.add('en-lecture');
          btn.setAttribute('aria-label', `Mettre en pause l’extrait audio de ${langue}`);
        }).catch(console.error);
      } else {
        audio.pause();
        btn.textContent = ICON_PLAY;
        btn.classList.remove('en-lecture');
        btn.setAttribute('aria-label', `Lire l’extrait audio de ${langue}`);
      }
    });

    audio.addEventListener('ended', () => {
      btn.textContent = ICON_PLAY;
      btn.classList.remove('en-lecture');
      btn.setAttribute('aria-label', `Lire l’extrait audio de ${langue}`);
    });

    audio.addEventListener('pause', () => {
      if (!audio.ended) {
        btn.textContent = ICON_PLAY;
        btn.classList.remove('en-lecture');
        btn.setAttribute('aria-label', `Lire l’extrait audio de ${langue}`);
      }
    });
  });
});

document.querySelector('.video_a_propos').pause();

document.querySelector('.image_a_propos').addEventListener('mouseenter', () => {
  document.querySelector('.video_a_propos').play();
});

document.querySelector('.image_a_propos').addEventListener('mouseleave', () => {
  document.querySelector('.video_a_propos').pause();
  document.querySelector('.video_a_propos').currentTime = 0;
});

//MACHINE A ECRIRE

document.addEventListener('DOMContentLoaded', () => {
  const el = document.querySelector('.texte-machine');
  if (!el) return;

  const full = el.textContent;
  el.textContent = '';

  const total = full.length || 1;
  const dureeMs = 10000;
  const interval = Math.max(8, Math.floor(dureeMs / total));
  let i = 0;

  const timer = setInterval(() => {
    const charsParTick = Math.max(1, Math.round(total / (dureeMs / interval)));
    el.textContent += full.slice(i, i + charsParTick);
    i += charsParTick;

    if (i >= total) {
      clearInterval(timer);
      el.textContent = full;
      setTimeout(() => { el.style.setProperty('--cursor-hide', '1'); }, 200);
    }
  }, interval);
});

document.addEventListener('DOMContentLoaded', () => {
  const mentions = document.getElementById('mentions-leg');
  const btn = document.getElementById('toggle-mentions');

  if (!mentions || !btn) return;

  let isOpen = false;

  function majEtat() {
    mentions.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    btn.textContent = isOpen
      ? 'Masquer les mentions légales'
      : 'Voir les mentions légales';
  }

  majEtat();

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    majEtat();
  });
});
