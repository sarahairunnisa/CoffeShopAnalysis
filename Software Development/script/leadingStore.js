import { filterData, addCheckboxEventListeners } from './filter.js';

window.addEventListener('load', initialize);

function initialize() {
  fetchData("data/trend_data.json")
    .then((originalData) => {
      const updateDataDisplay = createDataDisplayUpdater(originalData);
      updateDataDisplay(originalData);
      addCheckboxEventListeners(updateDataDisplay, originalData);
    })
    .catch((error) => console.error("Error:", error));
}

function fetchData(url) {
  return fetch(url).then((response) => response.json());
}

function createDataDisplayUpdater(originalData) {
  return function updateDataDisplay(data) {
    const filteredData = filterData(data);
    processAndDisplayData(filteredData);
  };
}

function processAndDisplayData(data) {
  const tbody = document.querySelector("#storeTable tbody");
  tbody.innerHTML = ''; 

  const groupedData = data.reduce((acc, curr) => {
    const key = `${curr.productCategory}-${curr.productType}-${curr.storeLocation}`;
    if (!acc[key]) {
      acc[key] = {
        productCategory: curr.productCategory,
        productType: curr.productType,
        storeLocation: curr.storeLocation,
        totalQty: 0,
        totalRevenue: 0,
      };
    }
    acc[key].totalQty += curr.totalQty;
    acc[key].totalRevenue += curr.totalRevenue;
    return acc;
  }, {});

  const sortedData = Object.values(groupedData).sort((a, b) => {
    if (a.productCategory < b.productCategory) return -1;
    if (a.productCategory > b.productCategory) return 1;
    if (a.productType < b.productType) return -1;
    if (a.productType > b.productType) return 1;
    return b.totalRevenue - a.totalRevenue;
  });

  sortedData.forEach((item) => {
    const row = `<tr>
                  <td>${item.productType}</td>
                  <td>${item.storeLocation}</td>
                  <td>${item.totalQty}</td>
                  <td>${item.totalRevenue}</td>
                </tr>`;
    tbody.innerHTML += row;
  });

   $('#storeTable').DataTable();
}
