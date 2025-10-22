// scrollGraph.js
export async function initScrollGraph() {
  const res = await fetch("/data/evolution_20_langues_interpolated.json");
  const data = await res.json();
  const container = document.getElementById("graph-container");
  if (!data?.length) {
    console.error("Aucun jeu de données trouvé !");
    return;
  }
  /*   data.forEach((lang) => {
    console.log("=========LANGUE=========")
    for (let i = 1900; i < 2025; i++) {
      console.log(lang[i]);
    }
  }); */

const ctx = document.getElementById('myChart').getContext('2d');
const valueSteps = [80000000,160000000,240000000,320000000,400000000,480000000,560000000,640000000,720000000,800000000];
const initialData = [valueSteps[0], 200000000, 300000000];

const myChart = new Chart(ctx, {
    type: 'bar',
    data: { labels:['A','B','C'], datasets:[{ label:'Valeurs', data:initialData, backgroundColor:['red','blue','green'] }] },
    options: { responsive:true, animation:{duration:0}, scales:{y:{min:80000000, max:1600000000}} }
});

const canvasHeight = ctx.canvas.offsetHeight;
const graphContainer = document.getElementById('graph-container');
const offset = -700; // décalage en pixels avant que l'animation commence
const scrollStart = graphContainer.offsetTop - offset;
const scrollRange = 1 * canvasHeight; // distance scroll pour passer de 1 à 10

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if(scrollY >= scrollStart && scrollY <= scrollStart + scrollRange){
        const progressRatio = (scrollY - scrollStart) / scrollRange;
        const stepIndex = Math.floor(progressRatio * (valueSteps.length - 1));
        myChart.data.datasets[0].data[0] = valueSteps[stepIndex];
        myChart.update();
    } else if(scrollY > scrollStart + scrollRange){
        // fin de l'animation : le canvas revient dans le flux normal
        myChart.data.datasets[0].data[0] = valueSteps[valueSteps.length - 1];
        myChart.update();
        ctx.canvas.style.position = 'relative';
        ctx.canvas.style.top = '0';
        ctx.canvas.style.left = '0';
        ctx.canvas.style.transform = 'none';
    }
});
}
