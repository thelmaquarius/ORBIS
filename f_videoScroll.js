// ========================================
// Gère la transition entre la vidéo d’intro plein écran et le header réduit
// Déclenche automatiquement après la lecture de la vidéo
// OU manuellement si l’utilisateur scrolle avant la fin
// ========================================
// f_videoScroll.js
export function initVideoScroll() {
  const video = document.querySelector("video.background");
  const main = document.getElementById("main-content");
  const intro = document.getElementById("intro");
  const body = document.querySelector("body");

  main.classList.add("visible");
  if (!video || !main) return;

  video.loop = true;

  let triggered = false;

  function triggerScroll(auto = true) {
    if (triggered) return;
    triggered = true;

    console.log(auto ? "Déclenchement du scroll auto" : "Transition manuelle via scroll");

    intro?.classList.add("fini");
    body.style.overflowY = "visible";

    // 🔥 Active le mode “resize animé”
    window.kunst_und_musik = true;
    window.filScrollControl?.startAutoCurve();

    // 🔥 Coupe l’animation après 11 sec
    setTimeout(() => {
      window.kunst_und_musik = false;
      window.filScrollControl?.stopAutoCurve();
    }, 11000);
  }

  video.addEventListener("canplaythrough", () => {
    console.log("Vidéo chargée, lancement du compte à rebours...");
    setTimeout(() => triggerScroll(true), 14420);
  });

  setTimeout(() => {
    if (!triggered) {
      console.warn("Timeout forcé — vidéo trop lente à charger.");
      triggerScroll(true);
    }
  }, 14720);

  window.addEventListener("scroll", () => {
    if (!triggered && window.scrollY > 80) {
      triggerScroll(false);
    }
  }, { passive: true });
}