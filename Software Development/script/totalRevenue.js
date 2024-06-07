import { filterData, addCheckboxEventListeners } from './filter.js';
import productColors from "../colors.js";

window.addEventListener('load', function() {
  let revenueChart; 

  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      function updateChart(data) {
        let totalRevenues = {};

        for (let item of data) {
          if (!(item.productType in totalRevenues)) {
            totalRevenues[item.productType] = 0;
          }

          // Add the total revenue for this item to the total for its product type
          totalRevenues[item.productType] += item.totalRevenue;
        }

        // Extract product types and total revenues from the totalRevenues object
        let productTypes = Object.keys(totalRevenues);
        let revenues = Object.values(totalRevenues);

        // Create an array of colors based on the product types
        let backgroundColors = productTypes.map(
          (type) => productColors[type]
        );

        // Destroy the old chart if it exists
        if (revenueChart) {
          revenueChart.destroy();
        }

        // Create the chart
        const ctx = document
          .getElementById("totalRevenue") // Make sure to change the canvas id to the id of the canvas for the revenue chart
          .getContext("2d");
        const chartData = {
          labels: productTypes,
          datasets: [
            {
              label: "Total Revenues",
              data: revenues,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        revenueChart = new Chart(ctx, {
          type: "pie",
          data: chartData,
          options: {
            plugins: {
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    let value = context.parsed;
                    let sum = context.dataset.data.reduce((a, b) => a + b, 0);
                    let percentage = ((value * 100) / sum).toFixed(2) + '%';
                    return `${label}: ${value} (${percentage})`;
                  }
                }
              },
              datalabels: {
                formatter: (value, ctx) => {
                  let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                  let percentage = (value * 100 / sum).toFixed(2) + "%";
                  return percentage;
                },
                color: "#333",
                font: {
                  weight: "bold",
                },
                display: function(context) {
                  let value = context.dataset.data[context.dataIndex];
                  let sum = context.dataset.data.reduce((a, b) => a + b, 0);
                  let percentage = (value * 100 / sum);
                  return percentage > 5; 
                },
              },
              legend: {
                display: false,
                position: 'right',
                labels: {
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
                onClick: null
              }
            }
          },
          plugins: [ChartDataLabels],
        });
      }

      updateChart(originalData);

      addCheckboxEventListeners(updateChart, originalData);
    })
    .catch((error) => console.error("Error:", error));
});
