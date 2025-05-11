import React, { useState } from 'react';
import styles from './JsonViewer.module.css';

const JsonViewer = ({ data, onEdit }) => {
  const [expandedPaths, setExpandedPaths] = useState({});
  const [editingKey, setEditingKey] = useState(null);

  const toggleExpand = (path) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const isExpanded = (path) => !!expandedPaths[path];

  const renderJson = (jsonData, path = []) => {
    if (typeof jsonData !== 'object' || jsonData === null) {
      // Render value with edit functionality
      return (
        <div className={styles.valueContainer}>
          {onEdit ? (
            editingKey === path.join('.') ? (
              <input
                type="text"
                className={styles.valueInput}
                defaultValue={JSON.stringify(jsonData)}
                onBlur={(e) => {
                  onEdit(e.target.value, path);
                  setEditingKey(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onEdit(e.target.value, path);
                    setEditingKey(null);
                  }
                }}
              />
            ) : (
              <span className={styles.value} onClick={() => setEditingKey(path.join('.'))}>
                {JSON.stringify(jsonData)}
              </span>
            )
          ) : (
            <span className={styles.value}>{JSON.stringify(jsonData)}</span>
          )}
        </div>
      );
    }

    return (
      <div className={styles.objectContainer}>
        {Object.entries(jsonData).map(([key, value]) => {
          const currentPath = [...path, key];
          const displayValue = typeof value === 'object' && value !== null ? (Array.isArray(value) ? `[Array(${value.length})]` : '{Object}') : JSON.stringify(value);
          return (
            <div key={key} className={styles.entry}>
              <div className={styles.keyColumn}>
                <button className={styles.toggleButton} onClick={() => toggleExpand(currentPath.join('.'))}>
                  {isExpanded(currentPath.join('.')) ? '[-]' : '[+]'}
                </button>
                <span className={styles.key}>{key}:</span>
              </div>
              <div className={styles.valueColumn}>
                {typeof value === 'object' && value !== null && !isExpanded(currentPath.join('.')) ? (
                  <span className={styles.summary}>{displayValue}</span>
                ) : (
                  renderJson(value, currentPath)
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object' || data[0] === null) {
      return null;
    }

    const headers = Object.keys(data[0]);

    return (
      <table className={styles.jsonTable}>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header}>{JSON.stringify(item[header])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.jsonViewer}>
      {renderTable(data) || renderJson(data)}
    </div>
  );
};
export default JsonViewer;