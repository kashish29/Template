// src/components/Widgets/CardListWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext'; 
import { fetchData } from '../../utils/api';
import { transformData } from '../../utils/dataTransforms';
import Card from './Card';
import styles from './CardListWidget.module.css';

const CardListWidget = ({ config, filters }) => { 
  const { ruleSet } = useAppContext(); 
  const { title, apiEndpoint, apiParams, cardConfig, dataTransformations, layout = 'grid' } = config;
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDataForWidget = useCallback(async () => {
    if (!apiEndpoint) {
      setError(new Error("Missing apiEndpoint in CardListWidget config."));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      
      const backendHints = {};
      
      if (apiEndpoint && apiEndpoint.includes('featured_items') && ruleSet?.backendProcessingHints?.defaultSort?.customerLists) { 
        backendHints.defaultSort = ruleSet.backendProcessingHints.defaultSort.customerLists;
      }
      

      
      const effectiveApiParams = { ...apiParams, ...filters };

      const rawData = await fetchData(apiEndpoint, effectiveApiParams, backendHints);
      let transformedData = rawData;
      if (dataTransformations && dataTransformations.transformer) {
        
        transformedData = transformData(rawData, dataTransformations.format || 'cardList');
      }
      
      setItems(Array.isArray(transformedData) ? transformedData : []);
    } catch (err) {
      setError(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, apiParams, dataTransformations, ruleSet, filters]);

  useEffect(() => {
    fetchDataForWidget();
  }, [fetchDataForWidget]);

  if (loading) {
    return <div className={styles.widget}><h3>{title || 'Card List'}</h3><p>Loading items...</p></div>;
  }

  if (error) {
    return <div className={styles.widget}><h3>{title || 'Card List'}</h3><p className={styles.error}>Error: {error.message}</p></div>;
  }

  if (items.length === 0) {
    return <div className={styles.widget}><h3>{title || 'Card List'}</h3><p>No items to display.</p></div>;
  }

  return (
    <div className={styles.widget}>
      <h3>{title || 'Card List'}</h3>
      <div className={`${styles.cardListContainer} ${styles[layout]}`}>
        {items.map((item, index) => (
          <Card key={item.id || index} item={item} cardConfig={cardConfig} />
        ))}
      </div>
    </div>
  );
};

export default CardListWidget;