import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import updateJsonObject from '../utils/jsonUpdate';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer';
import styles from './DataManagementPage.module.css';
// import fs from 'fs';

const DataManagementPage = () => {
  const { setHardcodedData, hardcodedData } = useAppContext();
  const [dataString, setDataString] = useState(JSON.stringify(hardcodedData, null, 2));
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    setDataString(JSON.stringify(hardcodedData, null, 2));
  }, [hardcodedData]);


  const handleSave = () => {
    try {
      const newData = JSON.parse(dataString);
      setHardcodedData(newData);

      const fileName = 'hardcodedData.json';
      const json = JSON.stringify(newData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      alert('Data saved and downloaded!');
    } catch (error) {
      alert('Error parsing JSON: ' + error.message);
    }
  };

  const handleExport = () => {
    console.log("Current Hardcoded Data:", JSON.stringify(hardcodedData, null, 2));
    alert("Data logged to console. You can copy it from there.");
  };

  const handleNavigateJson = (newPath) => {
    setCurrentPath(newPath);
  };

  const getBreadcrumbs = () => {
    let pathSegments = [{ label: 'Root', path: [] }];
    currentPath.forEach((segment, index) => {
      pathSegments.push({
        label: segment,
        path: currentPath.slice(0, index + 1)
      });
    });
    return pathSegments;
  };

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.title}>Manage Hardcoded Data</h2>
      <p className={styles.description}>
        View and edit the application's hardcoded data. Changes are saved to a JSON file.
      </p>

      <div className={styles.viewerContainer}>
        <h3>Data Viewer</h3>
        <div className={styles.breadcrumbs}>
          {getBreadcrumbs().map((crumb, index) => (
            <span key={index}>
              <button onClick={() => handleNavigateJson(crumb.path)} className={styles.crumbButton}>
                {crumb.label}
              </button>
              {index < getBreadcrumbs().length - 1 && <span className={styles.crumbSeparator}> / </span>}
            </span>
          ))}
        </div>
        <JsonViewer data={hardcodedData} currentPath={currentPath} onNavigate={handleNavigateJson} onEdit={(newValue, path) => {
          setHardcodedData(updateJsonObject(hardcodedData, path, newValue));
        }} />
      </div>
    </div>
  );
};

export default DataManagementPage;