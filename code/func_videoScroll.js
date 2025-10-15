      const video = document.querySelector("video.background");
      const main = document.getElementById("main-content");

function videoScroll(video, main) {
        
      }
      // Attendre que la vidéo soit prête à jouer
      video.addEventListener("canplaythrough", () => {
        console.log("Vidéo chargée, lancement du compte à rebours...");

        // Lancer le défilement
        setTimeout(() => {
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          main.classList.add("visible");
        }, 14720);
      });

      setTimeout(() => {
        if (!main.classList.contains("visible")) {
          console.warn("Timeout forcé — la vidéo a peut-être mis trop de temps à charger.");
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          main.classList.add("visible");
        }
      }, 25720);