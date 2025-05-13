import React, { createContext, useState, useContext, useEffect } from 'react';
// import fs from 'fs';

const AppContext = createContext();

const APP_NAMESPACE = 'myConfigurableApp';

export const AppProvider = ({ children }) => {
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);

  useEffect(() => {
    fetch('data/hardcodedData.json')
      .then(response => response.json())
      .then(data => {
        setHardcodedDataState(data);
      })
      .catch(error => {
        console.error("Failed to read hardcodedData.json:", error);
        setHardcodedDataState({});
      });

    fetch('data/userPreferences.json')
      .then(response => response.json())
      .then(data => {
        setUserPreferencesState(data);
      })
      .catch(error => {
        console.error("Failed to read userPreferences.json:", error);
        setUserPreferencesState({});
      });

    fetch('data/ruleSet.json')
      .then(response => response.json())
      .then(data => {
        setRuleSetState(data);
      })
      .catch(error => {
        console.error("Failed to read ruleSet.json:", error);
        setRuleSetState({});
      });
  }, []);


  const [hardcodedData, setHardcodedDataState] = useState(null);

  const [userPreferences, setUserPreferencesState] = useState(null);

  const [ruleSet, setRuleSetState] = useState(null);

    

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