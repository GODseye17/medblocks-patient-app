import React, { useEffect, useState } from "react";
import { dbPromise } from "../db";
import { getPatientDetailsbyName } from "../queries";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [name, setName] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const db = await dbPromise;
        const results = await db.query("SELECT * FROM PatientDetails");
        setPatients(results.rows);
        setFilteredPatients(results.rows);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setError("Failed to load patient data. Please try again later.");
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleSearch = async () => {
    if (name.trim() === "") {
      setFilteredPatients(patients);
      return;
    }
    
    setLoading(true);
    
    try {
      const db = await dbPromise;
      const res = await db.query(getPatientDetailsbyName, [`%${name.trim()}%`]);
      setLoading(false);
      
      if (res.rows.length === 0) {
        setError("No patients found with that name.");
        setFilteredPatients([]);
      } else {
        setError("");
        setFilteredPatients(res.rows);
      }
    } catch (error) {
      console.error("Error fetching patient details:", error);
      setError("Failed to fetch patient details. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Patient List</h2>
      
      <div className="search-container">
        <input
          type="text"
          name="name"
          placeholder="Search by First or Last Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="search-input"
          aria-label="Search patients"
        />
        <button
          onClick={handleSearch}
          className="search-button"
          aria-label="Search"
        >
          Search
        </button>
      </div>
      
      {loading ? (
        <p>Loading patients...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredPatients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.patientid || `${patient.firstname}-${patient.lastname}`}>
                  <td>{patient.patientid}</td>
                  <td>{patient.firstname}</td>
                  <td>{patient.lastname}</td>
                  <td>{patient.email}</td>
                  <td>{patient.number}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;