export function updateLegend(chart, legendId, allCharts) {
    const legendContainer = document.getElementById(legendId);
    legendContainer.innerHTML = '';
  
    chart.data.datasets.forEach((dataset, index) => {
      const legendItem = document.createElement('li');
      legendItem.classList.add('legend-item');
      legendItem.setAttribute('data-index', index);
  
      const colorBox = document.createElement('span');
      colorBox.style.backgroundColor = dataset.backgroundColor;
      colorBox.style.display = 'inline-block';
      colorBox.style.width = '10px';
      colorBox.style.height = '10px';
      colorBox.style.marginRight = '5px';
      legendItem.appendChild(colorBox);
      legendItem.appendChild(document.createTextNode(dataset.label));
      
      legendItem.addEventListener('click', () => {
        const datasetIndex = parseInt(legendItem.getAttribute('data-index'));
        const isHidden = legendItem.classList.toggle('hidden');
        legendItem.style.textDecoration = isHidden ? 'line-through' : 'none';
        
        allCharts.forEach((currentChart) => {
            currentChart.data.datasets[datasetIndex].hidden = isHidden;
            currentChart.update();
            console.log(`Updated chart with id: ${currentChart.canvas.id}`);
          });
          
      });      
  
      legendContainer.appendChild(legendItem);
    });
  }
  