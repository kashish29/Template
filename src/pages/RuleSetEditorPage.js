import React, { useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import JsonViewer from '../components/UI/JsonViewer/JsonViewer'; // Reuse JsonViewer
import styles from './RuleSetEditorPage.module.css'; // Create this CSS Module (can be similar to DataManagementPage.module.css)

const RuleSetEditorPage = () => {
  const { ruleSet, setRuleSet } = useAppContext();
  const [rulesString, setRulesString] = useState('');
  const [currentPath, setCurrentPath] = useState([]);

  useEffect(() => {
    setRulesString(JSON.stringify(ruleSet, null, 2));
  }, [ruleSet]);

  const handleSave = () => {
    try {
      const newRules = JSON.parse(rulesString);
      setRuleSet(newRules);
      alert('Ruleset saved! (Persisted with localStorage if enabled)');
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
        Modify the JSON defining the application's behavior. Changes are persisted using localStorage.
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
        <JsonViewer data={ruleSet} currentPath={currentPath} onNavigate={handleNavigateJson} />
      </div>

      <div className={styles.editorContainer}>
        <h3>JSON Editor (Full RuleSet)</h3>
        <textarea
          value={rulesString}
          onChange={(e) => setRulesString(e.target.value)}
          className={styles.jsonTextarea}
        />
        <div className={styles.actions}>
          <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}>
            Save RuleSet
          </button>
           <button onClick={handleExport} className={`${styles.button} ${styles.exportButton}`}>
            Export JSON to Console
          </button>
        </div>
      </div>
    </div>
  );
};
export default RuleSetEditorPage;