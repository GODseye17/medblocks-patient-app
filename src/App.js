import logo from './logo.svg';
import './App.css';
import { Routes, Route } from "react-router-dom";
import { dbPromise, initializeDatabase } from './db';
import { PGliteProvider } from "@electric-sql/pglite-react";
import React, {useEffect, useState} from 'react';


const App = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    dbPromise.then(async (database) => {
      await initializeDatabase(database);
      setDb(database);
    });
  }, []);

  if (!db) {
    return <div>Loading...</div>;
  }
  return (
    <PGliteProvider db={db}>
      <nav className = "bg-blue-500 text-white p-4">
        <ul>
          <li>
            <a href="/" className="hover:underline">Home</a>
          </li>
          <li>
            <a href="/register" className="hover:underline">Register Patient</a>
          </li>
          <li>
            <a href="/patients" className="hover:underline">Patient List</a>
          </li>
        </ul>
      </nav>
    </PGliteProvider>
  );
};

export default App;
