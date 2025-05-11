import React, { createContext, useState, useContext, useEffect } from 'react';
import fs from 'fs';

const AppContext = createContext();

const APP_NAMESPACE = 'myConfigurableApp';

export const AppProvider = ({ children }) => {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    fs.readFile('data/hardcodedData.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Failed to read hardcodedData.json:", err);
        setHardcodedDataState({});
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        setHardcodedDataState(parsedData);
      } catch (parseError) {
        console.error("Failed to parse hardcodedData.json:", parseError);
        setHardcodedDataState({});
      }
    });

    fs.readFile('data/userPreferences.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Failed to read userPreferences.json:", err);
        setUserPreferencesState({});
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        setUserPreferencesState(parsedData);
      } catch (parseError) {
        console.error("Failed to parse userPreferences.json:", parseError);
        setUserPreferencesState({});
      }
    });

    fs.readFile('data/ruleSet.json', 'utf8', (err, data) => {
      if (err) {
        console.error("Failed to read ruleSet.json:", err);
        setRuleSetState({});
        return;
      }
      try {
        const parsedData = JSON.parse(data);
        setRuleSetState(parsedData);
      } catch (parseError) {
        console.error("Failed to parse ruleSet.json:", parseError);
        setRuleSetState({});
      }
    });
  }, []);


  const [hardcodedData, setHardcodedDataState] = useState({});

  const [userPreferences, setUserPreferencesState] = useState({});

  const [ruleSet, setRuleSetState] = useState({});

    

  const setHardcodedData = (data) => {
    setHardcodedDataState(data);
  };

  const setUserPreferences = (prefs) => {
    setUserPreferencesState(prefs);
  };

  const setRuleSet = (rules) => {
    setRuleSetState(rules);
  };


  useEffect(() => {
  }, []);


  const toggleProfileDrawer = () => setIsProfileDrawerOpen(!isProfileDrawerOpen);

  const getNestedValue = (obj, path) => {
    if (!path) return obj;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  return (
    <AppContext.Provider value={{
      isProfileDrawerOpen,
      toggleProfileDrawer,
      hardcodedData,
      setHardcodedData,
      ruleSet,
      setRuleSet,
      userPreferences,
      setUserPreferences,
      getNestedValue
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);