import productColors from "../colors.js";
import { filterData, addCheckboxEventListeners } from './filter.js';

window.addEventListener('load', function() {
    const ctx = document.getElementById("trendDay").getContext("2d");
    
    fetch("data/trend_data.json")
      .then((response) => response.json())
      .then((originalData) => {
        // Function to update the chart
        function updateChart(data) {
          // Get unique product types
          const productTypes = [
            ...new Set(data.map((item) => item.productType)),
          ];
  
          // Prepare the datasets
          const datasets = productTypes.map((productType) => {
            // Filter data for this product type
            const productData = data.filter(
              (item) => item.productType === productType
            );
  
            // Sum up totalQty for each dayOfWeek
            const totalQtyByDay = [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((dayOfWeek) => {
              const dayData = productData.filter(
                (item) => item.dayOfWeek === dayOfWeek
              );
              const totalQty = dayData.reduce(
                (sum, item) => sum + item.totalQty,
                0
              );
              return totalQty;
            });
  
            return {
              label: productType,
              data: totalQtyByDay,
              backgroundColor: productColors[productType],
              borderColor: productColors[productType],
              borderWidth: 1,
            };
          });
  
          // Create or update the chart
          if (window.chart) {
            window.chart.data.datasets = datasets;
            window.chart.update();
          } else {
            window.chart = new Chart(ctx, {
              type: "bar",
              data: {
                labels: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ],
                datasets: datasets,
              },
              options: {
                indexAxis: "y", 
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true,
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                    position:"top",
                    labels: {
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              },
            });
          }
        }
  
        // Initial chart creation
        updateChart(originalData);
  
        // Add event listener to each checkbox
        addCheckboxEventListeners(updateChart, originalData);
      })
      .catch((error) => console.error("Error:", error));
});
