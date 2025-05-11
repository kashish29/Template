import React from 'react';
import styles from './JsonViewer.module.css';

const JsonViewer = ({ data, currentPath = [], onNavigate, onEdit }) => {
  const getNestedValue = (obj, pathArray) => {
    return pathArray.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  };

  const currentData = getNestedValue(data, currentPath);

  const renderValue = (value, key, path) => {
    const fullPath = [...path, key];
    if (typeof value === 'object' && value !== null) {
      return (
        <button onClick={() => onNavigate(fullPath)} className={styles.navButton}>
          {Array.isArray(value) ? `[ Array (${value.length}) ]` : `{ Object }`}
        </button>
      );
    }
    return <span className={styles.value}>{JSON.stringify(value)}</span>;
  };

  if (currentData === undefined && currentPath.length > 0) {
    return <p className={styles.error}>Invalid path or data not found.</p>;
  }
  if (typeof currentData !== 'object' || currentData === null) {
    return (
      <div className={styles.leafNode}>
        <span className={styles.keyPrimitive}>{currentPath.length > 0 ? currentPath[currentPath.length -1] : "Root Value"}: </span>
        <span className={styles.value}>{JSON.stringify(currentData)}</span>
      </div>
    );
  }

  return (
    <div className={styles.jsonViewer}>
      {Object.entries(currentData).map(([key, value]) => (
        <div key={key} className={styles.entry}>
          <span className={styles.key}>{key}:</span>
          {renderValue(value, key, currentPath)}
        </div>
      ))}
    </div>
  );
};
export default JsonViewer;