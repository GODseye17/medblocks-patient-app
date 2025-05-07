import React, { useState } from "react";
import { dbPromise } from "../db";
import { getPatientDetailsbyName } from "../queries";

const PatientSearch = () => {
  const [name, setName] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);
    
    try {
      const db = await dbPromise;
      const res = await db.query(getPatientDetailsbyName, [`%${name.trim()}%`]);
      setLoading(false);
      
      if (res.rows.length === 0) {
        setError("No patients found with that name.");
        setResults([]);
      } else {
        setResults(res.rows);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("Failed to fetch patient details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Search Patients by Name</h2>
      
      <form onSubmit={handleSearch}>
        <div className="form-group">
          <label className="form-label" htmlFor="search-name">Patient Name</label>
          <input
            id="search-name"
            type="text"
            name="name"
            placeholder="Enter First or Last Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-secondary btn-block"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="form-title">Search Results</h3>
          <div className="search-results">
            {results.map((patient) => (
              <div 
                key={patient.patientid || `${patient.firstname}-${patient.lastname}`} 
                className="patient-item"
              >
                <p><strong>ID:</strong> {patient.patientid}</p>
                <p><strong>Name:</strong> {patient.firstname} {patient.lastname}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Number:</strong> {patient.number}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {searched && !loading && results.length === 0 && !error && (
        <p className="text-center mt-4">No patients found matching your search.</p>
      )}
    </div>
  );
};

export default PatientSearch;