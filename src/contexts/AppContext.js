import React, { createContext, useState, useContext, useEffect } from 'react';

const AppContext = createContext();

const APP_NAMESPACE = 'myConfigurableApp';

const loadFromLocalStorage = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(`${APP_NAMESPACE}_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value) => {
  try {
    window.localStorage.setItem(`${APP_NAMESPACE}_${key}`, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
};

const initialHardcodedData = {
  appName: "My Configurable App",
  userProfile: {
    name: "Demo User",
    email: "demo@example.com",
    avatarUrl: "https://placehold.co/50x50/007bff/ffffff?text=DU"
  },
  profileDrawerConfig: [
    { type: 'userInfo', dataKey: 'userProfile' },
    { type: 'divider' },
    { type: 'linksGroup', title: 'Navigation', links: [
        { label: 'Dashboard', path: '/' },
        { label: 'Settings', path: '/settings' }, 
        { label: 'My Activity', path: '/activity' }
    ]},
    { type: 'divider' },
    { type: 'actionButton', label: 'Logout', action: 'logout' }
  ],
  filterOptions: {
    categories: [
      { value: 'tech', label: 'Technology' },
      { value: 'health', label: 'Healthcare' },
      { value: 'finance', label: 'Finance' },
    ],
    status: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ]
  }
};

const initialUserPreferences = {
  global: {
    itemsPerPageInTables: 10,
    chartAnimation: true,
  },
  viewSpecific: {
    default: {
      widgetOrder: ["welcome", "productTable", "activeUsers", "salesTrendPlaceholder"],
      hiddenWidgets: [],
    },
    sales_dashboard: {},
    operations_dashboard: {}
  }
};

const initialRuleSet = {
  version: "1.1",
  frontendLogic: {
    globalTheme: "light",

    filterBarConfig: [
      { id: 'dateRange', type: 'dateRange', label: 'Period' },
      { id: 'category', type: 'dropdown', label: 'Category', optionsKey: 'filterOptions.categories' },
      { id: 'status', type: 'multiSelect', label: 'Status', optionsKey: 'filterOptions.status' },
      { id: 'searchTerm', type: 'textInput', label: 'Search', placeholder: 'Enter search term...' },
      { id: 'showActive', type: 'toggle', label: 'Active Only', defaultValue: true }

    ],
    views: {
      default: {
        title: "Dynamic Dashboard (Default View)",
        layout: { type: "grid", columns: 2 },
        widgets: [
          {
            id: "welcome",
            type: "TextDisplay",
            gridPosition: { row: 1, col: 1, colSpan: 2 },
            config: { content: "Welcome to your customizable dashboard!", style: "h3" }
          },
          {
            id: "activeUsers",
            type: "MetricDisplay",
            gridPosition: { row: 2, col: 1 },
            config: { title: "Active Users", value: 1250, dataKeyFromHardcoded: "appName" }
          },
          {
            id: "salesTrendPlaceholder",
            type: "PlaceholderWidget",
            gridPosition: { row: 2, col: 2 },
            config: { title: "Sales Trend (Placeholder)" }
          },

          {
            id: "productTable",
            type: "TableWidget",
            gridPosition: { row: 3, col: 1, colSpan: 2 },
            config: {
              title: "Product List",
              apiEndpoint: "/api/products",
              apiParams: { limit: 10 },
              columns: [
                { header: "Name", key: "name", sortable: true },
                { header: "Price", key: "price", sortable: true },
                { header: "Stock", key: "stock", sortable: true }
              ]
            }
          },
          {
            id: "pnlTable",
            type: "TableWidget",
            gridPosition: { row: 4, col: 1, colSpan: 2 },
            config: {
              title: "P&L Summary (Hierarchical)",
              apiEndpoint: "/api/pnl_data",
              columns: [
                { header: "Name", key: "name", sortable: true },
                { header: "Budget", key: "budget", sortable: true },
                { header: "Actual", key: "actual", sortable: true },
                { header: "Variance", key: "variance", sortable: true }
              ]

            }
          }
        ]
      },
      sales_dashboard: {
        title: "Sales Dashboard",
        layout: { type: "grid", columns: 3 },
        widgets: [
          {
            id: "salesSummaryChart",
            type: "ChartWidget",
            gridPosition: { row: 1, col: 1, colSpan: 2 },
            config: {
              title: "Monthly Sales Summary",
              chartType: "BarChart",
              apiEndpoint: "/api/sales_summary",

            }
          },
          {
            id: "featuredItems",
            type: "CardListWidget",
            gridPosition: { row: 2, col: 1, colSpan: 3 },
            config: {
              title: "Featured Items",
              apiEndpoint: "/api/featured_items",
              cardConfig: { titleKey: "name", imageKey: "imageUrl", descriptionKey: "shortDesc" },
              layout: "grid"
            }
          }
        ]
      },
      operations_dashboard: {
        "title": "Operations Dashboard",
        "layout": { "type": "grid", "columns": 2 },
        "widgets": [
          {
            "id": "op_status_table",
            "type": "TableWidget",
            "gridPosition": { "row": 1, "col": 1 },
            "config": {
              "title": "System Status",
              "apiEndpoint": "/api/system_status",
              "columns": [
                { "header": "System", "key": "systemName", "sortable": true },
                { "header": "Status", "key": "status", "sortable": false }
              ]
            }
          },
          {
            "id": "op_error_rate_chart",
            "type": "ChartWidget",
            "gridPosition": { "row": 1, "col": 2 },
            "config": {
              "title": "Error Rates (Last 24h)",
              "chartType": "LineChart",
              "apiEndpoint": "/api/error_rates"
            }
          }
        ]
      }
    },

    frontendProcessingHints: {
        tableWidget: {
          hierarchicalColumnKey: "name",
          indentationUnitPx: 22
        }
    }
  },
  backendProcessingHints: {

    applyNetting: false,
    defaultSort: {
      customerLists: "last_active_date",
      productCatalog: "popularity"
    },
    advancedCalculations: {
      financialReports: true,
      inventoryProjections: false
    },


  }
};
export const AppProvider = ({ children }) => {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  const [hardcodedData, setHardcodedDataState] = useState(() =>
    loadFromLocalStorage('hardcodedData', initialHardcodedData)
  );

  const [userPreferences, setUserPreferencesState] = useState(() =>
    loadFromLocalStorage('userPreferences', initialUserPreferences)
  );

  const [ruleSet, setRuleSetState] = useState(() => {
    const loadedRuleSet = loadFromLocalStorage('ruleSet', null);

    
    if (loadedRuleSet &&
        loadedRuleSet.frontendLogic &&
        loadedRuleSet.frontendLogic.views &&
        loadedRuleSet.version &&
        parseFloat(loadedRuleSet.version) >= parseFloat(initialRuleSet.version)) {
      
      return loadedRuleSet;
    } else {
      
      
      if (loadedRuleSet) { 
        console.warn(`Loaded ruleset (version: ${loadedRuleSet.version}, structure: ${loadedRuleSet.frontendLogic ? 'new-ish' : 'old'}) is outdated or invalid. Reverting to initialRuleSet (version: ${initialRuleSet.version}) and updating localStorage.`);
      } else { 
        console.log("No ruleset found in localStorage. Initializing with default and saving.");
      }
      saveToLocalStorage('ruleSet', initialRuleSet);
      return initialRuleSet;
    }
  });

  const setHardcodedData = (data) => {
    setHardcodedDataState(data);
    saveToLocalStorage('hardcodedData', data);
  };

  const setUserPreferences = (prefs) => {
    setUserPreferencesState(prefs);
    saveToLocalStorage('userPreferences', prefs);
  };

  const setRuleSet = (rules) => {
    setRuleSetState(rules);
    saveToLocalStorage('ruleSet', rules);
  };


  useEffect(() => {
    if (!window.localStorage.getItem(`${APP_NAMESPACE}_hardcodedData`)) {
      saveToLocalStorage('hardcodedData', initialHardcodedData);
    }
    if (!window.localStorage.getItem(`${APP_NAMESPACE}_ruleSet`)) {
      saveToLocalStorage('ruleSet', initialRuleSet);
    }
    if (!window.localStorage.getItem(`${APP_NAMESPACE}_userPreferences`)) {
      saveToLocalStorage('userPreferences', initialUserPreferences);
    }
  }, []);


  const toggleProfileDrawer = () => setIsProfileDrawerOpen(!isProfileDrawerOpen);

  const getNestedValue = (obj, path) => {
    if (!path) return obj;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <AppContext.Provider value={{
      isProfileDrawerOpen,
      toggleProfileDrawer,
      hardcodedData,
      setHardcodedData,
      ruleSet,
      setRuleSet,
      userPreferences,
      setUserPreferences,
      getNestedValue
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);