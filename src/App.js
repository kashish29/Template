import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import TopBar from './components/Layout/TopBar';
import ProfileDrawer from './components/Layout/ProfileDrawer';
import MainViewPage from './pages/MainViewPage';
import DataManagementPage from './pages/DataManagementPage';
import RuleSetEditorPage from './pages/RuleSetEditorPage';
import UserSettingsPage from './pages/UserSettingsPage'; 
import './App.css';

function App() {
  const NavLinks = () => {
    const { ruleSet } = useAppContext();
    const views = ruleSet?.frontendLogic?.views || {};

    return (
      <>
        {Object.entries(views).map(([viewId, viewConfig]) => (
          <Link key={viewId} to={`/app/view/${viewId}`}>
            {viewConfig.title || viewId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Link>
        ))}
      </>
    );
  };

  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="App">
          <TopBar />
          <ProfileDrawer />
          <nav className="main-nav">
            <NavLinks /> 
            <Link to="/data-management">Manage Data</Link>
            <Link to="/ruleset-editor">Edit Ruleset</Link>
            
          </nav>
          <main className="content-container">
            <Routes>
              <Route path="/app/view/:viewId" element={<MainViewPage />} />
              <Route path="/" element={<MainViewPage />} />
              <Route path="/data-management" element={<DataManagementPage />} />
              <Route path="/ruleset-editor" element={<RuleSetEditorPage />} />
              <Route path="/settings" element={<UserSettingsPage />} />
              <Route path="/activity" element={<div><h2>My Activity Page (Placeholder)</h2></div>} />
              <Route path="/login" element={<div><h2>Login Page (Placeholder for Logout Redirect)</h2></div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;