import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import updateJsonObject from '../utils/jsonUpdate';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer';
import styles from './UserSettingsPage.module.css';
// import fs from 'fs';

const UserSettingsPage = () => {
  const { setUserPreferences, userPreferences } = useAppContext(); // Assuming these will be added to context
  const [settingsString, setSettingsString] = useState(JSON.stringify(userPreferences, null, 2));
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    if (userPreferences) {
      setSettingsString(JSON.stringify(userPreferences, null, 2));
    }
  }, [userPreferences]);

  const handleSave = () => {
    try {
      const newSettings = JSON.parse(settingsString);
      setUserPreferences(newSettings); // Assuming setUserPreferences updates localStorage

      const fileName = 'userPreferences.json';
      const json = JSON.stringify(newSettings, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      alert('User preferences saved and downloaded!');
    } catch (error) {
      alert('Error parsing JSON for user preferences: ' + error.message);
    }
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

  if (!userPreferences) {
    return (
      <div className={styles.pageContainer}>
        <h2 className={styles.title}>User Settings</h2>
        <p>Loading user preferences...</p>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h2 className={styles.title}>User Settings</h2>
      <p className={styles.description}>
        Modify your application preferences. Changes are saved to a JSON file.
      </p>

      <div className={styles.viewerContainer}>
        <h3>Preferences Viewer</h3>
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
        <JsonViewer data={userPreferences} currentPath={currentPath} onNavigate={handleNavigateJson} onEdit={(newValue, path) => {
          setUserPreferences(updateJsonObject(userPreferences, path, newValue));
        }} />
      </div>
    </div>
  );
};

export default UserSettingsPage;