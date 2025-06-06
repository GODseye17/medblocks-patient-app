import './App.css';
import './index.css';
import { Routes, Route, useLocation } from "react-router-dom";
import { dbPromise, initializeDatabase } from './db';
import { PGliteProvider } from "@electric-sql/pglite-react";
import React, { useEffect, useState } from 'react';
import { initPageRefreshManager, triggerPageRefreshAllTabs } from './PageRefresh';
import Registration from './Pages/Registration';
import PatientList from './Pages/PatientList';
import QueryRecords from './Pages/QueryRecords';
import DeletePage from './Pages/DeletePage';
import { Link } from "react-router-dom";

// Route listener component to initialize page refresh manager
const RouteListener = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Initialize with current path whenever location changes
    initPageRefreshManager(location.pathname);
    console.log('Page refresh manager initialized for:', location.pathname);
  }, [location.pathname]);
  
  return children;
};

const App = () => {
  const [db, setDb] = useState(null);
  
  useEffect(() => {
    dbPromise.then(async (database) => {
      await initializeDatabase(database);
      setDb(database);
    });
  }, []);
  
  if (!db) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading application...</p>
      </div>
    );
  }
  
  return (
    <PGliteProvider db={db}>
      <RouteListener>
        <div className="app-container">
          <nav className="navbar">
            <ul>
              <li className="navbar-brand">PatientCare</li>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register Patient</Link>
              </li>
              <li>
                <Link to="/patients">Patient List</Link>
              </li>
              <li>
                <Link to="/query">Query Records</Link>
              </li>
              <li>
                <Link to="/delete">Delete Patient</Link>
              </li>
            </ul>
          </nav>
          
          <div className="content-container">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/patients" element={<PatientList />} />
              <Route path="/query" element={<QueryRecords />} />
              <Route path="/delete" element={<DeletePage />} />
            </Routes>
          </div>
        </div>
      </RouteListener>
    </PGliteProvider>
  );
};

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to PatientCare</h1>
      <p className="welcome-subtitle">A comprehensive patient management system</p>
      <div className="welcome-actions">
        <Link to="/register" className="btn btn-primary" style={{ margin: '0 0.5rem' }}>Register New Patient</Link>
        <Link to="/query" className="btn btn-secondary" style={{ margin: '0 0.5rem' }}>Query Records</Link>
      </div>
    </div>
  );
};

// Export the triggerPageRefreshAllTabs function to make it available globally
window.triggerPageRefreshAllTabs = triggerPageRefreshAllTabs;

export default App;