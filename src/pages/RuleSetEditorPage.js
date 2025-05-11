import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer'; // Reuse JsonViewer
import styles from './RuleSetEditorPage.module.css'; // Create this CSS Module (can be similar to DataManagementPage.module.css)
// import fs from 'fs';

import updateJsonObject from '../utils/jsonUpdate';

const RuleSetEditorPage = () => {
  const { setRuleSet, ruleSet } = useAppContext();
  const [rulesString, setRulesString] = useState(JSON.stringify(ruleSet, null, 2));
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    setRulesString(JSON.stringify(ruleSet, null, 2));
  }, [ruleSet]);

  const handleSave = () => {
    try {
      const newRules = JSON.parse(rulesString);
      setRuleSet(newRules);

      const fileName = 'ruleSet.json';
      const json = JSON.stringify(newRules, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = href;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);

      alert('Ruleset saved and downloaded!');
    } catch (error) {
      alert('Error parsing JSON for ruleset: ' + error.message);
    }
  };

  const handleExport = () => {
    console.log("Current RuleSet:", JSON.stringify(ruleSet, null, 2));
    alert("RuleSet logged to console. You can copy it from there.");
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
      <h2 className={styles.title}>Edit RuleSet</h2>
      <p className={styles.description}>
        Modify the JSON defining the application's behavior. Changes are saved to a JSON file.
    </p>

      <div className={styles.viewerContainer}>
        <h3>RuleSet Viewer</h3>
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
        <JsonViewer data={ruleSet} currentPath={currentPath} onNavigate={handleNavigateJson} onEdit={(newValue, path) => {
          setRuleSet(updateJsonObject(ruleSet, path, newValue));
        }} />
      </div>
    </div>
  );
};

export default RuleSetEditorPage;