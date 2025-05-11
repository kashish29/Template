import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer';
import styles from './UserSettingsPage.module.css';

const UserSettingsPage = () => {
  const { userPreferences, setUserPreferences } = useAppContext(); // Assuming these will be added to context
  const [settingsString, setSettingsString] = useState('');
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
      alert('User preferences saved!');
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
        Modify your application preferences. Changes are persisted using localStorage.
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
        <JsonViewer data={userPreferences} currentPath={currentPath} onNavigate={handleNavigateJson} />
      </div>

      <div className={styles.editorContainer}>
        <h3>JSON Editor (User Preferences)</h3>
        <textarea
          value={settingsString}
          onChange={(e) => setSettingsString(e.target.value)}
          className={styles.jsonTextarea}
        />
        <div className={styles.actions}>
          <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}>
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;