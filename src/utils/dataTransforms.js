// src/utils/dataTransforms.js

/**
 * Example data transformation function.
 * @param {any} data - The data to transform.
 * @param {string} targetFormat - A string indicating the desired format.
 * @returns {any} - The transformed data.
 */
export const transformData = (data, targetFormat) => {
  console.log(`Transforming data to ${targetFormat}`, data);

  return data; 
};


/**
 * Transforms raw product data into a format suitable for a product table.
 * @param {Array<Object>} rawProducts - The raw product data from the API.
 * @returns {Array<Object>} - Transformed product data.
 */
export const transformProductDataForTable = (rawProducts) => {
  if (!Array.isArray(rawProducts)) {
    console.warn('transformProductDataForTable expected an array, received:', rawProducts);
    return [];
  }
  return rawProducts.map(product => ({
    id: product.id,
    name: product.productName || product.name, 
    price: product.price,
    stock: product.stockLevel || product.stock,
    
  }));
};

/**
 * @param {Object} salesSummary - Raw sales summary.
 * @returns {Object} - Data formatted for a chart library (e.g., Chart.js).
 */
export const transformSalesForChart = (salesSummary) => {
  
  
  if (typeof salesSummary !== 'object' || salesSummary === null) {
    console.warn('transformSalesForChart expected an object, received:', salesSummary);
    return { labels: [], datasets: [] };
  }
  const labels = Object.keys(salesSummary);
  const data = Object.values(salesSummary);
  return {
    labels,
    datasets: [
      {
        label: 'Monthly Sales',
        data,
        
      },
    ],
  };
};