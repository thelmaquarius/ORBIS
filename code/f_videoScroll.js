// videoScroll.js
export function initVideoScroll() {
  const video = document.querySelector("video.background");
  const main = document.getElementById("main-content");
  const intro = document.getElementById("intro");
  const body = document.querySelector("body");
main.classList.add("visible");
  if (!video || !main) return;

  // Activer la boucle si tu veux qu’elle tourne en continu
  video.loop = true;

  let triggered = false; // verrou

  function triggerScroll() {
    if (triggered) return; // évite tout double déclenchement
    triggered = true;

    console.log("Déclenchement du scroll");
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    /* main.classList.add("visible"); */
    intro?.classList.add("fini");
    body.style.overflowY= 'visible';
  }

  // Quand la vidéo est prête
  video.addEventListener("canplaythrough", () => {
    console.log("Vidéo chargée, lancement du compte à rebours...");
    setTimeout(triggerScroll, 14420);
  });

  // Sécurité : si la vidéo ne charge jamais
  setTimeout(() => {
    if (!triggered) {
      console.warn("Timeout forcé — vidéo trop lente à charger.");
      triggerScroll();
    }
  }, 14720);
}