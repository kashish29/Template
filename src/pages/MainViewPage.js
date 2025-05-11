import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import FilterBar from '../components/Filters/FilterBar';
import { useAppContext } from '../contexts/AppContext';
import styles from './MainViewPage.module.css'; 
import TableWidget from '../components/Widgets/TableWidget';
import ChartWidget from '../components/Widgets/ChartWidget';
import CardListWidget from '../components/Widgets/CardListWidget';


const TextDisplayWidget = ({ config }) => (
  <div className={styles.widget}>
    {config.style === 'h3' ? <h3>{config.content}</h3> : <p>{config.content}</p>}
  </div>
);

const MetricDisplayWidget = ({ config, hardcodedData, getNestedValue }) => {
  const dataFromHardcoded = config.dataKeyFromHardcoded ? getNestedValue(hardcodedData, config.dataKeyFromHardcoded) : '';
  return (
    <div className={`${styles.widget} ${styles.metricWidget}`}>
      <h4>{config.title}</h4>
      <div className={styles.metricValue}>{config.value}</div>
      {dataFromHardcoded && <small>Context: {dataFromHardcoded}</small>}
    </div>
  );
};

const PlaceholderWidget = ({ config }) => (
  <div className={`${styles.widget} ${styles.placeholderWidget}`}>
    <h4>{config.title || "Placeholder"}</h4>
    <p>This is a placeholder for a {config.type || 'generic'} widget.</p>
    <pre>{JSON.stringify(config, null, 2)}</pre>
  </div>
);




const widgetMap = {
  TextDisplay: TextDisplayWidget,
  MetricDisplay: MetricDisplayWidget,
  PlaceholderWidget: PlaceholderWidget,
  TableWidget: TableWidget,
  ChartWidget: ChartWidget,
  CardListWidget: CardListWidget,
  
};


const MainViewPage = () => {
  const { ruleSet, hardcodedData, getNestedValue, userPreferences } = useAppContext();
  const { viewId } = useParams();
  const [activeFilters, setActiveFilters] = useState({});
  const [currentViewConfig, setCurrentViewConfig] = useState(null);

  useEffect(() => {
    const actualViewId = viewId || 'default';
    let baseConfig;

    if (ruleSet && ruleSet.frontendLogic && ruleSet.frontendLogic.views && ruleSet.frontendLogic.views[actualViewId]) {
      baseConfig = JSON.parse(JSON.stringify(ruleSet.frontendLogic.views[actualViewId]));
    } else {
      console.warn(`View configuration for viewId "${actualViewId}" not found in frontendLogic.views. Using a default placeholder.`);
      baseConfig = { title: `View: ${actualViewId} (Not Found)`, widgets: [], layout: { type: "default" } };
    }


    if (userPreferences && userPreferences.viewSpecific && userPreferences.viewSpecific[actualViewId]) {
      const prefs = userPreferences.viewSpecific[actualViewId];


      if (prefs.widgetOrder && Array.isArray(prefs.widgetOrder) && baseConfig.widgets) {
        baseConfig.widgets.sort((a, b) => {
          const indexA = prefs.widgetOrder.indexOf(a.id);
          const indexB = prefs.widgetOrder.indexOf(b.id);

          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }


      if (prefs.hiddenWidgets && Array.isArray(prefs.hiddenWidgets) && baseConfig.widgets) {
        baseConfig.widgets = baseConfig.widgets.filter(widget => !prefs.hiddenWidgets.includes(widget.id));
      }


      if(prefs.themeOverride){



        baseConfig.theme = prefs.themeOverride;
      }
    }

    if (userPreferences?.global?.itemsPerPageInTables && baseConfig.widgets) {
        baseConfig.widgets.forEach(widget => {
            if (widget.type === 'TableWidget' && widget.config) {
                widget.config.itemsPerPage = userPreferences.global.itemsPerPageInTables;
            }
        });
    }


    setCurrentViewConfig(baseConfig);
  }, [viewId, ruleSet, userPreferences]);

  const handleFilterChange = (newFilters) => {
    console.log("Filters updated in MainViewPage:", newFilters);
    setActiveFilters(newFilters);
    
  };

  
  const viewConfig = currentViewConfig || { title: "Loading View...", widgets: [], layout: { type: "default" } };
  const layoutConfig = viewConfig.layout || { type: "default" };
  const filterBarConfiguration = ruleSet?.frontendLogic?.filterBarConfig || [];

  const renderWidget = (widgetRule) => {
    const WidgetComponent = widgetMap[widgetRule.type];
    if (!WidgetComponent) {
      return (
        <div key={widgetRule.id} className={styles.widgetError}>
          Unknown widget type: {widgetRule.type}
        </div>
      );
    }
    
    const widgetStyle = {};
    if (layoutConfig.type === 'grid' && widgetRule.gridPosition) {
        widgetStyle.gridColumnStart = widgetRule.gridPosition.col;
        if (widgetRule.gridPosition.colSpan) {
            widgetStyle.gridColumnEnd = `span ${widgetRule.gridPosition.colSpan}`;
        }
        widgetStyle.gridRowStart = widgetRule.gridPosition.row;
         if (widgetRule.gridPosition.rowSpan) {
            widgetStyle.gridRowEnd = `span ${widgetRule.gridPosition.rowSpan}`;
        }
    }

    return (
      <div key={widgetRule.id} style={widgetStyle}>
        <WidgetComponent
            config={widgetRule.config}
            filters={activeFilters} 
            hardcodedData={hardcodedData} 
            getNestedValue={getNestedValue} 
            
        />
      </div>
    );
  };

  const gridStyle = layoutConfig.type === 'grid' ? {
    display: 'grid',
    gridTemplateColumns: `repeat(${layoutConfig.columns || 2}, 1fr)`,
    gap: '20px',
  } : {};


  return (
    <div className={styles.mainViewPage}>
      <h2 className={styles.pageTitle}>{viewConfig.title}</h2>
      
      <FilterBar
        config={filterBarConfiguration}
        onFiltersChange={handleFilterChange}
        hardcodedData={hardcodedData}
        getNestedValue={getNestedValue}
      />

      <div className={styles.widgetsContainer} style={gridStyle}>
        {viewConfig.widgets.map(renderWidget)}
      </div>

      <div className={styles.debugInfo}>
        <h4>Current Active Filters (for debugging):</h4>
        <pre>{JSON.stringify(activeFilters, null, 2)}</pre>
      </div>
    </div>
  );
};
export default MainViewPage;