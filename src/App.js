import logo from './logo.svg';
import './App.css';
import './index.css'; 
import { Routes, Route } from "react-router-dom";
import { dbPromise, initializeDatabase } from './db';
import { PGliteProvider } from "@electric-sql/pglite-react";
import React, {useEffect, useState} from 'react';
import Registration from './Pages/Registration';
import PatientList from './Pages/PatientList';
import PatientSearch from './Pages/PatientSearch';
import DeletePage from './Pages/DeletePage';
import { Link } from "react-router-dom";

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
              <Link to="/search">Search Patient</Link>
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
            <Route path="/search" element={<PatientSearch />} />
            <Route path="/delete" element={<DeletePage />} />
          </Routes>
        </div>
      </div>
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
        <Link to="/patients" className="btn btn-secondary" style={{ margin: '0 0.5rem' }}>View Patient List</Link>
      </div>
    </div>
  );
};

export default App;