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

  //  Initialisation des spans pour chaque caractère
  el.innerHTML = letters.map(letter => `<span class="char">${letter}</span>`).join('');
  const spans = el.querySelectorAll('.char');

  //  Mutation régulière
  const interval = setInterval(() => {
    const currentAlphabet = random(alphabets);
    const chars = Object.values(currentAlphabet).filter(c => c && c.trim() !== '');

    for (let i = 0; i < letters.length; i++) {
      if (i < locked) {
        spans[i].textContent = letters[i]; // lettre fixée
      } else {
        spans[i].textContent = random(chars); // lettre aléatoire
      }
    }
  }, 150);

  //  Verrouillage progressif des lettres
  for (let i = 0; i <= letters.length; i++) {
    await new Promise(res => setTimeout(res, stepDuration));
    locked = i;
  }

  clearInterval(interval);

  //  Fin : afficher le texte final proprement
  for (let i = 0; i < letters.length; i++) {
    spans[i].textContent = letters[i];
  }
}
