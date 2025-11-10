// f_filScroll.js
export function initFilScroll() {
  const path = document.getElementById("chemin");
  const segments = document.querySelectorAll(".segment");
  if (!path || !segments.length) return;

  const len = path.getTotalLength();

  function placeSegments() {
    segments.forEach(seg => {
      const p = parseFloat(seg.style.getPropertyValue("--pos"));
      const pt = path.getPointAtLength(len * p);
      seg.style.left = `${pt.x}px`;
      seg.style.top = `${pt.y}px`;
    });
  }

  placeSegments();
  window.addEventListener("resize", placeSegments);

  // Activation des segments selon le scroll
  const sections = document.querySelectorAll("main section");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const i = [...sections].indexOf(entry.target);
        segments.forEach(s => s.classList.remove("active"));
        if (segments[i]) segments[i].classList.add("active");
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(s => obs.observe(s));
}
