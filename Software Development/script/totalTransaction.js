import { filterData, addCheckboxEventListeners } from './filter.js';
import productColors from "../colors.js";

window.addEventListener('load', function() {
  let pieChart;

  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      function updateChart(data) {
        let totalQuantities = {};
        for (let item of data) {
          // If the product type is not in the totalQuantities object, add it
          if (!(item.productType in totalQuantities)) {
            totalQuantities[item.productType] = 0;
          }

          // Add the total quantity for this item to the total for its product type
          totalQuantities[item.productType] += item.totalQty;
        }

        // Extract product types and total quantities from the totalQuantities object
        let productTypes = Object.keys(totalQuantities);
        let quantities = Object.values(totalQuantities);

        // Create an array of colors based on the product types
        let backgroundColors = productTypes.map(
          (type) => productColors[type]
        );

        // Destroy the old chart if it exists
        if (pieChart) {
          pieChart.destroy();
        }

        // Create the chart
        const ctx = document
          .getElementById("totalTransaction")
          .getContext("2d");
        const chartData = {
          labels: productTypes,
          datasets: [
            {
              label: "Total Transactions",
              data: quantities,
              backgroundColor: backgroundColors,
              hoverOffset: 4,
            },
          ],
        };
        pieChart = new Chart(ctx, {
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
                onClick: null,
              }
            }
          },
          plugins: [ChartDataLabels],
        });
      }

      // Initial chart creation
      updateChart(originalData);

      addCheckboxEventListeners(updateChart, originalData);
    })
    .catch((error) => console.error("Error:", error));
});
