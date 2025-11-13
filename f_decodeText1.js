// decodeText.js
export async function decodeText(targetText, totalDuration, elementId) {
  const res = await fetch('/data/alphabets_rotated.json');
  const alphabets = await res.json();
  if (!alphabets.length) {
    console.error("⚠️ Les alphabets ne sont pas encore chargés !");
    return;
  }

  const el = document.getElementById(elementId);
  const letters = targetText.split('');
  const stepDuration = totalDuration / letters.length;
  const random = arr => arr[Math.floor(Math.random() * arr.length)];
  let locked = 0;

  // tableau de largeurs personnalisées (en ch)
  const widths = [1.3, 1.2, 1.2,0.5, 1]; 
  // → tu peux l’ajuster selon ton mot

  // création des spans avec largeur spécifique
  el.innerHTML = letters
    .map((l, i) => `<span class="char" style="width:${(widths[i] ?? 1)}ch">${l}</span>`)
    .join('');
  const spans = el.querySelectorAll('.char');

  // mutation du texte
  const interval = setInterval(() => {
    const currentAlphabet = random(alphabets);
    const chars = Object.values(currentAlphabet).filter(c => c && c.trim() !== '');
    for (let i = 0; i < letters.length; i++) {
      spans[i].textContent = i < locked ? letters[i] : random(chars);
    }
  }, 150);

  // verrouillage progressif
  for (let i = 0; i <= letters.length; i++) {
    await new Promise(res => setTimeout(res, stepDuration));
    locked = i;
  }

  clearInterval(interval);
  spans.forEach((s, i) => (s.textContent = letters[i]));
}