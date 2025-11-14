// ========================================
// Gère la transition entre la vidéo d’intro plein écran et le header réduit
// Déclenche automatiquement après la lecture de la vidéo
// OU manuellement si l’utilisateur scrolle avant la fin
// ========================================
export function initVideoScroll() {
  const video = document.querySelector("video.background");
  const main = document.getElementById("main-content");
  const intro = document.getElementById("intro");
  const body = document.querySelector("body");

  main.classList.add("visible");
  if (!video || !main) return;

  video.loop = true;

  let triggered = false; // verrou de trigger pour éviter les doublons

  function triggerScroll(auto = true) {
    if (triggered) return;
    triggered = true;

    console.log(auto ? "Déclenchement du scroll auto" : "Transition manuelle via scroll");
    
    // Passe le header en mode bandeau
    intro?.classList.add("fini");
    body.style.overflowY = "visible";

  }

  // --- Déclenchement automatique après lecture vidéo ---
  video.addEventListener("canplaythrough", () => {
    console.log("Vidéo chargée, lancement du compte à rebours...");
    setTimeout(() => triggerScroll(true), 14420);
  });

  // --- Sécurité : si la vidéo ne charge jamais ---
  setTimeout(() => {
    if (!triggered) {
      console.warn("Timeout forcé — vidéo trop lente à charger.");
      triggerScroll(true);
    }
  }, 14720);

  // --- Déclenchement manuel si l’utilisateur scrolle ---
  window.addEventListener("scroll", () => {
    // Si l’utilisateur a commencé à scroller (plus de 80px)
    if (!triggered && window.scrollY > 80) {
      triggerScroll(false);
    }
  }, { passive: true });
}
