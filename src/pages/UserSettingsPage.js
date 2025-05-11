import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import updateJsonObject from '../utils/jsonUpdate';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer';
import styles from './UserSettingsPage.module.css';
import fs from 'fs';

const UserSettingsPage = () => {
  const { setUserPreferences } = useAppContext(); // Assuming these will be added to context
  const [settingsString, setSettingsString] = useState('');
  const [currentPath, setCurrentPath] = useState([]);
  const [userPreferences, setUserPreferencesState] = useState(null);

  useEffect(() => {
    fs.readFile('data/userPreferences.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Failed to read userPreferences.json:", err);
        setUserPreferencesState({});
        setSettingsString(JSON.stringify({}, null, 2));
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        setUserPreferencesState(parsedData);
        setSettingsString(JSON.stringify(parsedData, null, 2));
      } catch (parseError) {
        console.error("Failed to parse userPreferences.json:", parseError);
        setUserPreferencesState({});
        setSettingsString(JSON.stringify({}, null, 2));
      }
    });
  }, []);

  useEffect(() => {
    if (userPreferences) {
      setSettingsString(JSON.stringify(userPreferences, null, 2));
    }
  }, [userPreferences]);

  const handleSave = () => {
    try {
      const newSettings = JSON.parse(settingsString);
      setUserPreferences(newSettings); // Assuming setUserPreferences updates localStorage
      fs.writeFile('data/userPreferences.json', JSON.stringify(newSettings, null, 2), (err) => {
        if (err) {
          console.error("Failed to write userPreferences.json:", err);
          alert('User preferences saved, but failed to persist to file!');
        } else {
          alert('User preferences saved!');
        }
      });
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
          setUserPreferencesState(updateJsonObject(userPreferences, path, newValue));
        }} />
      </div>

    </div>
  );
};

  const setUserPreferences = (newSettings) => {
    setUserPreferencesState(newSettings);
    setSettingsString(JSON.stringify(newSettings, null, 2));
  };

export default UserSettingsPage;