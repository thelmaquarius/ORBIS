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

  const interval = setInterval(() => {
    const currentAlphabet = random(alphabets);
    const chars = Object.values(currentAlphabet).filter(c => c && c.trim() !== '');
    let displayed = '';

    for (let i = 0; i < letters.length; i++) {
      displayed += i < locked ? letters[i] : random(chars);
    }

    el.textContent = displayed;
  }, 150);

  for (let i = 0; i <= letters.length; i++) {
    await new Promise(res => setTimeout(res, stepDuration));
    locked = i;
  }

  clearInterval(interval);
  el.textContent = targetText;
}