# Configurable React Application

This project is a React application designed to be highly configurable through JSON objects. It demonstrates how to build a flexible UI where components, layouts, and even data sources can be defined and modified without changing the core application code.

## Core Concepts

The application revolves around a few key concepts:

1.  **`AppContext`**: A React Context that holds the global state, including:
    *   `hardcodedData`: A JSON object for static data, options, and initial configurations (e.g., user profile information, dropdown options, profile drawer structure).
    *   `ruleSet`: A JSON object that dictates the dynamic behavior and composition of views and components. It's now structured into three main parts:
        *   `frontendLogic`: Contains configurations for the UI, including global theme, `filterBarConfig`, and `views` (which define different page layouts and widget compositions).
        *   `backendProcessingHints`: Provides hints that can be sent to the backend when fetching data (e.g., `applyNetting`, `defaultSort`).
        *   `userPreferences`: Stores user-specific customizations, such as preferred widget order, hidden widgets, or items per page in tables, both globally and for specific views.
    *   Persistence: Both `hardcodedData` and `ruleSet` are persisted to `localStorage` to maintain changes across browser sessions. The application also includes logic to update the `ruleSet` in localStorage if an outdated structure is detected.

2.  **Multiple Views & Dynamic Widgets**:
    *   The application supports multiple "main views" (e.g., different dashboards), each configurable through the `ruleSet.frontendLogic.views` object. The active view is determined by a URL parameter (e.g., `/app/view/:viewId`).
    *   **`MainViewPage`**: Dynamically renders content based on the `viewId` from the URL. It fetches the corresponding view configuration from `ruleSet.frontendLogic.views[viewId]`, applies `userPreferences`, and renders the specified widgets.
    *   **Widget Types**: The application now supports diverse widget types:
        *   `TextDisplayWidget`: For simple text.
        *   `MetricDisplayWidget`: For showing key metrics.
        *   `TableWidget`: Displays data in a sortable table, fetched from an API.
        *   `ChartWidget`: Placeholder for displaying charts (e.g., bar, line), with data fetched from an API. (Actual chart rendering library integration is a next step).
        *   `CardListWidget`: Displays a list or grid of cards, with data fetched from an API.
    *   **`ProfileDrawer`**: A side drawer whose content (user info, links, buttons) is defined by an array in `hardcodedData.profileDrawerConfig`.
    *   **`FilterBar`**: A filter bar whose filter elements (date range, dropdown, text input, etc.) are defined by an array in `ruleSet.frontendLogic.filterBarConfig`.

3.  **Data Management & Editing**:
    *   **`DataManagementPage`**: Allows users to view and edit the `hardcodedData` JSON directly. It features a `JsonViewer` component for easier navigation of nested data.
    *   **`RuleSetEditorPage`**: Allows users to view and edit the `ruleSet` JSON, also using the `JsonViewer`.

4.  **CSS Modules**: Styling is handled using CSS Modules (`*.module.css`) to ensure component-scoped styles and prevent naming conflicts.

## Key Features Implemented

*   **Dynamic Profile Drawer**: Content driven by `hardcodedData.profileDrawerConfig`.
*   **Dynamic Filter Bar**: Filters driven by `ruleSet.frontendLogic.filterBarConfig`.
*   **Multiple Dynamic Main Views**: Widgets, layout, and content on `MainViewPage` driven by `ruleSet.frontendLogic.views[viewId]` and `ruleSet.userPreferences`.
*   **Diverse Widget Support**: Includes `TableWidget`, `ChartWidget` (mocked), and `CardListWidget` that fetch and display data from (mocked) API endpoints.
*   **Mock API**: [`src/utils/api.js:1`](src/utils/api.js:1) includes mock responses for `/api/products`, `/api/sales_summary`, and `/api/featured_items` to demonstrate widget functionality.
*   **Structured Ruleset**: `ruleSet` is organized into `frontendLogic`, `backendProcessingHints`, and `userPreferences`.
*   **User Preferences Application**: `MainViewPage` applies user preferences for widget order, visibility, and items per page.
*   **Backend Processing Hints**: Widgets can pass hints from `ruleSet.backendProcessingHints` to the API.
*   **JSON Viewer**: A component ([`src/components/UI/JsonViewer/JsonViewer.js:1`](src/components/UI/JsonViewer/JsonViewer.js:1)) for navigating and displaying JSON structures with breadcrumbs.
*   **In-browser Data Editing**: Pages for modifying `hardcodedData` and `ruleSet` with `localStorage` persistence.
*   **CSS Modules**: For all component styling.
*   **Helper for Nested Data**: A `getNestedValue` utility in `AppContext` to easily access data from nested JSON objects using a dot-separated path.

## Project Structure (Key Files)

*   [`src/contexts/AppContext.js:1`](src/contexts/AppContext.js:1): Manages global state, data persistence, and the structured `ruleSet`.
*   [`src/pages/MainViewPage.js:1`](src/pages/MainViewPage.js:1): The main page rendering dynamic views and widgets.
*   [`src/components/Widgets/`](src/components/Widgets/): Directory containing `TableWidget.js`, `ChartWidget.js`, `CardListWidget.js`, and `Card.js`.
*   [`src/utils/api.js:1`](src/utils/api.js:1): Handles API calls and includes mock data.
*   [`src/utils/dataTransforms.js:1`](src/utils/dataTransforms.js:1): Placeholder for data transformation functions.
*   [`src/components/Layout/ProfileDrawer.js:1`](src/components/Layout/ProfileDrawer.js:1): The configurable profile drawer.
*   [`src/components/Filters/FilterBar.js:1`](src/components/Filters/FilterBar.js:1): The configurable filter bar.
*   [`src/pages/DataManagementPage.js:1`](src/pages/DataManagementPage.js:1): Page for editing `hardcodedData`.
*   [`src/pages/RuleSetEditorPage.js:1`](src/pages/RuleSetEditorPage.js:1): Page for editing `ruleSet`.
*   [`src/components/UI/JsonViewer/JsonViewer.js:1`](src/components/UI/JsonViewer/JsonViewer.js:1): Component for viewing JSON.
*   [`src/App.js:1`](src/App.js:1): Defines routing, including `/app/view/:viewId` for dynamic views.

## Adding a New View

To add a new view (e.g., an "Operations Dashboard"):

1.  **Define the View in `ruleSet`**:
*   Open [`src/contexts/AppContext.js:1`](src/contexts/AppContext.js:1).
*   Locate the `initialRuleSet.frontendLogic.views` object.
*   Add a new key for your view, for example, `operations_dashboard`. The value should be an object defining its `title`, `layout` (e.g., `{ type: "grid", columns: 3 }`), and an array of `widgets`.
*   Each widget in the array needs an `id`, `type` (e.g., "TableWidget", "ChartWidget"), `gridPosition` (if using a grid layout), and a `config` object specific to that widget type (e.g., `apiEndpoint`, `columns` for a table; `chartType`, `apiEndpoint` for a chart).

Example for `operations_dashboard` in `initialRuleSet.frontendLogic.views`:
```json
"operations_dashboard": {
  "title": "Operations Dashboard",
  "layout": { "type": "grid", "columns": 2 },
  "widgets": [
    {
      "id": "op_status_table",
      "type": "TableWidget",
      "gridPosition": { "row": 1, "col": 1 },
      "config": {
        "title": "System Status",
        "apiEndpoint": "/api/system_status", // Create mock or real API
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
        "apiEndpoint": "/api/error_rates" // Create mock or real API
      }
    }
    // ... more widgets
  ]
}
```

2.  **(Optional) Add User Preferences for the New View**:
*   In `initialRuleSet.userPreferences.viewSpecific`, add a key for `operations_dashboard`.
*   You can define `widgetOrder` or `hiddenWidgets` for this new view.

3.  **(Optional) Add Mock API Data**:
*   If your new widgets use new API endpoints (e.g., `/api/system_status`), add corresponding mock data handlers in [`src/utils/api.js:1`](src/utils/api.js:1) similar to how `/api/products` is handled.

4.  **Add Navigation (Optional but Recommended)**:
*   To easily access the new view, add a link in [`src/App.js:1`](src/App.js:1) within the `<nav>` section:
    ```jsx
    <Link to="/app/view/operations_dashboard">Operations Dashboard</Link>
    ```

5.  **Access the View**:
*   You can now navigate to `/app/view/operations_dashboard` in your browser.

## Getting Started

1.  Clone the repository.
2.  Install dependencies: `npm install` or `yarn install`.
3.  Run the development server: `npm start` or `yarn start`.

The application will then be available in your browser, typically at `http://localhost:3000`.

## Missing Pieces / Next Steps

*   **`ProfileIcon` Component**: The [`src/components/Layout/TopBar.js:1`](src/components/Layout/TopBar.js:1) references a `ProfileIcon` component that needs to be created.
*   **Real Charting Library**: Integrate a library like Chart.js, Recharts, or Nivo into `ChartWidget.js` for actual chart rendering instead of the current placeholder.
*   **RuleSetEditorPage Update**: Enhance [`src/pages/RuleSetEditorPage.js:1`](src/pages/RuleSetEditorPage.js:1) to better support editing the new three-part `ruleSet` structure (e.g., separate sections for `frontendLogic`, `backendProcessingHints`, `userPreferences`).
*   **User Preferences UI**: Create a dedicated UI (perhaps in `ProfileDrawer` or a new settings page) for users to modify their preferences stored in `ruleSet.userPreferences`.
*   **Actual Backend Integration**: Replace mock API calls in [`src/utils/api.js:1`](src/utils/api.js:1) with actual `fetch` calls to a real backend.
*   **Error Handling and Validation**: More robust error handling for API calls, data transformations, and rule interpretation.
*   **Styling Polish**: Further refinement of CSS Modules and overall UI/UX.
*   **Testing**: Implementation of unit and integration tests.
*   **Advanced Widget Features**: Implement features like pagination for `TableWidget`, more chart interactions for `ChartWidget`, etc.