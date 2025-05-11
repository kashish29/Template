// src/components/Widgets/TableWidget.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../contexts/AppContext'; 
import { fetchData } from '../../utils/api';
import { transformData } from '../../utils/dataTransforms'; 
import styles from './TableWidget.module.css';

const TableWidget = ({ config, filters }) => { 
  const { ruleSet } = useAppContext(); 
  
  const { title, apiEndpoint, columns, apiParams, dataTransformations, itemsPerPage } = config;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  const fetchDataForWidget = useCallback(async () => {
    if (!apiEndpoint || !columns) {
      setError(new Error("Missing apiEndpoint or columns in widget config."));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      
      const backendHints = {};
      if (ruleSet?.backendProcessingHints?.applyNetting !== undefined) {
        backendHints.applyNetting = ruleSet.backendProcessingHints.applyNetting;
      }
      
      if (apiEndpoint && apiEndpoint.includes('products') && ruleSet?.backendProcessingHints?.defaultSort?.productCatalog) {
        backendHints.defaultSort = ruleSet.backendProcessingHints.defaultSort.productCatalog;
      }
      

      
      
      const effectiveApiParams = { ...apiParams, ...filters };
      if (itemsPerPage) { 
        effectiveApiParams.limit = itemsPerPage; 
      }


      const rawData = await fetchData(apiEndpoint, effectiveApiParams, backendHints);
      let transformedData = rawData;
      if (dataTransformations && dataTransformations.transformer) {
        
        
        
        transformedData = transformData(rawData, dataTransformations.format || 'table');
      } else if (typeof transformProductDataForTable === 'function' && apiEndpoint.includes('products')) {
        
        
      }
      setData(transformedData || []);
    } catch (err) {
      setError(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, columns, apiParams, dataTransformations, ruleSet, filters, itemsPerPage]);

  useEffect(() => {
    fetchDataForWidget();
  }, [fetchDataForWidget]);

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (columnKey) => {
    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'ascending' ? ' \u25B2' : ' \u25BC';
    }
    return '';
  };

  if (loading) {
    return <div className={styles.widget}><h3>{title || 'Table Widget'}</h3><p>Loading data...</p></div>;
  }

  if (error) {
    return <div className={styles.widget}><h3>{title || 'Table Widget'}</h3><p className={styles.error}>Error: {error.message}</p></div>;
  }

  if (!Array.isArray(sortedData) || sortedData.length === 0) {
    return <div className={styles.widget}><h3>{title || 'Table Widget'}</h3><p>No data available.</p></div>;
  }

  
  const tableColumns = Array.isArray(columns) ? columns : [];

  return (
    <div className={styles.widget}>
      <h3>{title || 'Table Widget'}</h3>
      <table
        className={styles.table}
        style={{
          "--base-indent": `${ruleSet?.frontendProcessingHints?.tableWidget?.indentationUnitPx || 20}px`,
        }}
      >
        <thead>
          <tr>
            {tableColumns.map((col) => (
              <th key={col.key || col.header} onClick={() => col.sortable !== false && requestSort(col.key)} className={col.sortable !== false ? styles.sortableHeader : ''}>
                {col.header}
                {col.sortable !== false && getSortIndicator(col.key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} data-level={row.level !== undefined ? String(row.level) : ''}>
              {tableColumns.map((col) => {
                const cellContent = row[col.key];
                const hierarchicalKey = ruleSet?.frontendProcessingHints?.tableWidget?.hierarchicalColumnKey || 'name';

                if (col.key === hierarchicalKey && typeof row.level === 'number') {
                  return (
                    <td
                      key={`${col.key || col.header}-${rowIndex}`}
                      className={styles.hierarchicalCell}
                      data-level={String(row.level)} 
                    >
                      {cellContent}
                    </td>
                  );
                }
                return (
                  <td key={`${col.key || col.header}-${rowIndex}`}>{cellContent}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableWidget;