// scrollGraph.js
export async function initScrollGraph() {
  const res = await fetch('/data/evolution_20_langues.json');
  const data = await res.json();

  const container = document.getElementById('graph-container');
  if (!data?.length) {
    console.error("Aucun jeu de données trouvé !");
    return;
  }
  data.forEach(lang => {
    console.log(lang['1900'])
  });
};
