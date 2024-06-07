import { filterData, addCheckboxEventListeners } from './filter.js';
import productColors from "../colors.js";
import { updateLegend } from './distributionLegend.js';

window.addEventListener('load', function() {
  let scatterChart;
  let allCharts = window.allCharts;

  fetch("data/trend_data.json")
    .then((response) => response.json())
    .then((originalData) => {
      function updateChart(data) {
        const groupedData = data.reduce((acc, curr) => {
          const { productType, totalQty, productTypePriceAvg } = curr;

          if (!acc[productType]) {
            acc[productType] = {
              totalQty: 0,
              productTypePriceAvg: 0,
            };
          }

          acc[productType].totalQty += totalQty;
          acc[productType].productTypePriceAvg = parseFloat(productTypePriceAvg);

          return acc;
        }, {});

        const datasets = Object.entries(groupedData).map(
          ([productType, { totalQty, productTypePriceAvg }]) => {
            return {
              label: productType,
              data: [{ x: totalQty, y: productTypePriceAvg }],
              backgroundColor: productColors[productType],
            };
          }
        );

        if (scatterChart) {
          scatterChart.destroy();
        }

        const ctx = document
          .getElementById("price-influence-purchasing-behaviour")
          .getContext("2d");
        scatterChart = new Chart(ctx, {
          type: "scatter",
          data: {
            datasets,
          },
          options: {
            scales: {
              x: {
                type: "linear",
                position: "bottom",
                title: {
                  display: true,
                  text: "Total Transactions",
                },
              },
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Average Product Price",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataPoint = context.dataset.data[context.dataIndex];
                    return `${context.dataset.label}: ${dataPoint.x}, ${dataPoint.y}`;
                  },
                },
              },
              legend: {
                display: false,
              },
            },
          },
        });

        allCharts.push(scatterChart);
        console.log(allCharts);
        updateLegend(scatterChart, 'js-legend', allCharts);
      }

      updateChart(originalData);
      addCheckboxEventListeners(updateChart, originalData);
    })
    .catch((error) => console.error("Error:", error));
});
