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
          const { productType, totalRevenue, product_variations } = curr;

          if (!acc[productType]) {
            acc[productType] = {
              totalRevenue: 0,
              product_variations: [],
            };
          }

          acc[productType].totalRevenue += totalRevenue;
          acc[productType].product_variations.push(product_variations);

          return acc;
        }, {});

        const datasets = Object.entries(groupedData).map(
          ([productType, { totalRevenue, product_variations }]) => {
            const uniqueDataPoints = new Map();

            product_variations.forEach((variation) => {
              const key = `${totalRevenue},${variation}`;
              uniqueDataPoints.set(key, { x: totalRevenue, y: variation });
            });

            return {
              label: productType,
              data: Array.from(uniqueDataPoints.values()).map((point) => ({
                ...point,
                totalRevenue,
              })),
              backgroundColor: productColors[productType],
            };
          }
        );

        if (scatterChart) {
          scatterChart.destroy();
        }

        const ctx = document
          .getElementById("product-variety-revenue")
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
                  text: "Total Revenue",
                },
              },
              y: {
                type: "linear",
                position: "left",
                title: {
                  display: true,
                  text: "Product Variations",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const dataPoint = context.dataset.data[context.dataIndex];
                    return `${context.dataset.label}: ${dataPoint.x}`;
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
