// src/utils/api.js

/**
 * Fetches data from the specified API endpoint.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @param {object} params - Optional parameters to send with the request (e.g., filters).
 * @param {object} backendHints - Optional hints for backend processing.
 * @returns {Promise<any>} - A promise that resolves with the fetched data.
 */
export const fetchData = async (endpoint, params = {}, backendHints = {}) => {
  try {
    
    
    const allParams = { ...params, ...backendHints };

    const queryString = Object.keys(allParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
      .join('&');
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;

    console.log(`Fetching data from: ${url} with params:`, allParams); 

    
    if (url.startsWith('/api/products')) {
      console.log("Mocking API response for /api/products");
      const productData = [
        { id: 'p1', name: 'Wireless Mouse', price: 25.99, stock: 150 },
        { id: 'p2', name: 'Mechanical Keyboard', price: 79.50, stock: 75 },
        { id: 'p3', name: 'USB-C Hub', price: 33.00, stock: 200 },
        { id: 'p4', name: '4K Monitor', price: 299.99, stock: 30 },
        { id: 'p5', name: 'Webcam HD', price: 45.00, stock: 90 },
        { id: 'p6', name: 'Laptop Stand', price: 19.99, stock: 120 },
        { id: 'p7', name: 'Noise Cancelling Headphones', price: 199.00, stock: 50 },
        { id: 'p8', name: 'Gaming Chair', price: 250.00, stock: 20 },
        { id: 'p9', name: 'Smart Speaker', price: 89.99, stock: 65 },
        { id: 'p10', name: 'External SSD 1TB', price: 120.00, stock: 40 },
      ];
      
      const limit = parseInt(allParams.limit, 10);
      return Promise.resolve(limit ? productData.slice(0, limit) : productData);
    }

    if (url.startsWith('/api/sales_summary')) {
      console.log("Mocking API response for /api/sales_summary");
      return Promise.resolve({
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Monthly Sales (Mocked)',
            data: [65, 59, 80, 81, 56, 55],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    }

    if (url.startsWith('/api/featured_items')) {
      console.log("Mocking API response for /api/featured_items");
      return Promise.resolve([
        { id: 'f1', name: 'Featured Product A', shortDesc: 'An amazing featured product.', imageUrl: 'https://via.placeholder.com/300x200/007BFF/FFFFFF?Text=Product+A', price: 99.99 },
        { id: 'f2', name: 'Featured Item B', shortDesc: 'Another excellent choice for you.', imageUrl: 'https://via.placeholder.com/300x200/28A745/FFFFFF?Text=Product+B', price: 149.00 },
        { id: 'f3', name: 'Top Pick C', shortDesc: 'Highly rated by our customers.', imageUrl: 'https://via.placeholder.com/300x200/FFC107/000000?Text=Product+C', price: 75.50 },
        { id: 'f4', name: 'Special Offer D', shortDesc: 'Limited time offer, grab it now!', imageUrl: 'https://via.placeholder.com/300x200/DC3545/FFFFFF?Text=Product+D', price: 49.99 },
      ]);
    }

    if (url.startsWith('/api/pnl_data')) {
      console.log("Mocking API response for /api/pnl_data (hierarchical)");
      const pnlData = [
        { id: 'entity1', name: 'Global Equities', level: 0, budget: 1000000, actual: 950000, variance: -50000 },
        { id: 'desk1-1', name: 'Cash Trading Desk', level: 1, parentId: 'entity1', budget: 400000, actual: 380000, variance: -20000 },
        { id: 'cc1-1-1', name: 'US Equities', level: 2, parentId: 'desk1-1', budget: 200000, actual: 190000, variance: -10000 },
        { id: 'cc1-1-2', name: 'EMEA Equities', level: 2, parentId: 'desk1-1', budget: 200000, actual: 190000, variance: -10000 },
        { id: 'desk1-2', name: 'Derivatives Desk', level: 1, parentId: 'entity1', budget: 600000, actual: 570000, variance: -30000 },
        { id: 'cc1-2-1', name: 'Options Trading', level: 2, parentId: 'desk1-2', budget: 300000, actual: 280000, variance: -20000 },
        { id: 'cc1-2-2', name: 'Futures Trading', level: 2, parentId: 'desk1-2', budget: 300000, actual: 290000, variance: -10000 },
        { id: 'entity2', name: 'Fixed Income', level: 0, budget: 800000, actual: 820000, variance: 20000 },
        { id: 'desk2-1', name: 'Rates Trading Desk', level: 1, parentId: 'entity2', budget: 500000, actual: 510000, variance: 10000 },
        { id: 'cc2-1-1', name: 'Government Bonds', level: 2, parentId: 'desk2-1', budget: 250000, actual: 255000, variance: 5000 },
        { id: 'cc2-1-2', name: 'Corporate Bonds', level: 2, parentId: 'desk2-1', budget: 250000, actual: 255000, variance: 5000 },
        { id: 'desk2-2', name: 'Credit Trading Desk', level: 1, parentId: 'entity2', budget: 300000, actual: 310000, variance: 10000 },
      ];
      return Promise.resolve(pnlData);
    }

    if (url.startsWith('/api/system_status')) {
      console.log("Mocking API response for /api/system_status");
      return Promise.resolve([
        { systemName: 'Auth Service', status: 'Operational' },
        { systemName: 'Payment Gateway', status: 'Degraded Performance' },
        { systemName: 'Order Processor', status: 'Operational' },
        { systemName: 'Notification Service', status: 'Outage' },
      ]);
    }

    if (url.startsWith('/api/error_rates')) {
      console.log("Mocking API response for /api/error_rates");
      return Promise.resolve({
        labels: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
        datasets: [
          {
            label: 'Error Rate (%)',
            data: [1.2, 0.8, 1.5, 1.1, 2.0, 1.7],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
          },
        ],
      });
    }
  
    try {
        const response = await fetch(url);
        if (!response.ok) {
          
          console.error(`API request failed for ${url} with status ${response.status}: ${response.statusText}`);
          throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data (original fetch block):", error, "URL:", url);
        if (url.includes('products') || url.includes('featured_items') || url.includes('pnl_data')) return [];
        if (url.includes('sales_summary')) return { labels: [], datasets: [] };
        throw error;
    }
  } catch (error) {
    console.error("Error in fetchData function (outer catch):", error);
    throw error;
  }
};