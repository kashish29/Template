// src/components/Widgets/ChartWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext'; 
import { fetchData } from '../../utils/api';
import { transformData } from '../../utils/dataTransforms'; 
import styles from './ChartWidget.module.css';



const ChartRenderer = ({ type, data, options }) => {
  if (!data || !data.labels || !data.datasets) {
    return <p>Chart data is not in the expected format.</p>;
  }

  
  return (
    <div className={styles.chartPlaceholder}>
      <h4>{type || 'Chart'}</h4>
      <p>Labels: {data.labels.join(', ')}</p>
      {data.datasets.map((dataset, index) => (
        <div key={index}>
          <p>Dataset {dataset.label || index + 1}: {dataset.data.join(', ')}</p>
        </div>
      ))}</div>
  );
};


const ChartWidget = ({ config, filters }) => { 
  const { ruleSet } = useAppContext(); 
  const { title, chartType, apiEndpoint, apiParams, dataTransformations, chartOptions } = config;
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataForWidget = useCallback(async () => {
    if (!apiEndpoint || !chartType) {
      setError(new Error("Missing apiEndpoint or chartType in widget config."));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      
      const backendHints = {};
      
      if (apiEndpoint && apiEndpoint.includes('financialReports') && ruleSet?.backendProcessingHints?.advancedCalculations?.financialReports !== undefined) {
        backendHints.advancedCalculations = ruleSet.backendProcessingHints.advancedCalculations.financialReports;
      }
      if (ruleSet?.backendProcessingHints?.dataGranularity) { 
          backendHints.dataGranularity = ruleSet.backendProcessingHints.dataGranularity;
      }
      const effectiveApiParams = { ...apiParams, ...filters };

      const rawData = await fetchData(apiEndpoint, effectiveApiParams, backendHints);
      let transformedData = rawData;
      if (dataTransformations && dataTransformations.transformer) {
        transformedData = transformData(rawData, dataTransformations.format || 'chart');
      } else {
        transformedData = transformData(rawData, 'chart'); 
      }

      setChartData(transformedData);
    } catch (err) {
      setError(err);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, chartType, apiParams, dataTransformations, ruleSet, filters]);

  useEffect(() => {
    fetchDataForWidget();
  }, [fetchDataForWidget]);

  if (loading) {
    return <div className={styles.widget}><h3>{title || 'Chart Widget'}</h3><p>Loading chart data...</p></div>;
  }

  if (error) {
    return <div className={styles.widget}><h3>{title || 'Chart Widget'}</h3><p className={styles.error}>Error: {error.message}</p></div>;
  }

  if (!chartData) {
    return <div className={styles.widget}><h3>{title || 'Chart Widget'}</h3><p>No data available to display chart.</p></div>;
  }

  return (
    <div className={styles.widget}>
      <h3>{title || 'Chart Widget'}</h3>
      <ChartRenderer type={chartType} data={chartData} options={chartOptions || {}} />
    </div>
  );
};

export default ChartWidget;