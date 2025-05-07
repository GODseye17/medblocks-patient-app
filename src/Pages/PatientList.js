import React, { useEffect, useState } from "react";
import { dbPromise } from "../db";

const fieldOptions = [
  { label: "Patient ID", value: "patientid" },
  { label: "First Name", value: "firstname" },
  { label: "Last Name", value: "lastname" },
  { label: "Email", value: "email" },
  { label: "Phone Number", value: "number" },
];

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedField, setSelectedField] = useState("");
  const [searchValue, setSearchValue] = useState("");
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

  const handleSearch = () => {
    if (!selectedField || searchValue.trim() === "") {
      setFilteredPatients(patients);
      setError("");
      return;
    }

    const value = searchValue.trim().toLowerCase();
    const filtered = patients.filter((p) =>
      String(p[selectedField]).toLowerCase().includes(value)
    );

    if (filtered.length === 0) {
      setError("No patients found matching the criteria.");
    } else {
      setError("");
    }

    setFilteredPatients(filtered);
  };

  return (
    <div className="card">
      <h2 className="card-title">Patient List</h2>

      <div className="search-form-group">
      <div className="select-wrapper">
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className="search-select"
          aria-label="Select search field"
        >
          <option value="">Select Field</option>
          {fieldOptions.map((field) => (
            <option key={field.value} value={field.value}>
              {field.label}
            </option>
          ))}
        </select>
      </div>
      
      <input
        type="text"
        placeholder="Enter value to search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="search-input"
        aria-label="Search value"
      />
      
      <button
        onClick={handleSearch}
        className="search-button"
        aria-label="Search"
      >
        <span className="search-icon">⚲</span>
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