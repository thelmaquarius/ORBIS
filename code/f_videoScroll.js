// videoScroll.js
export function initVideoScroll() {
  const video = document.querySelector("video.background");
  const main = document.getElementById("main-content");

  if (!video || !main) return;

  // Quand la vidéo est prête
  video.addEventListener("canplaythrough", () => {
    console.log("Vidéo chargée, lancement du compte à rebours...");
    setTimeout(() => {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      main.classList.add("visible");
    }, 14720);
  });

  // Sécurité : si la vidéo ne charge pas
  setTimeout(() => {
    if (!main.classList.contains("visible")) {
      console.warn("Timeout forcé — la vidéo a peut-être mis trop de temps à charger.");
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      main.classList.add("visible");
    }
  }, 14720);
}
