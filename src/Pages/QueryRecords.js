import React, { useState } from "react";
import { dbPromise } from "../db";

const QueryRecords = () => {
  const [filters, setFilters] = useState({
    ageRange: "",
    bloodGroup: "",
    medicalCondition: "",
    heightRange: "",
    weightRange: "",
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const db = await dbPromise;
      let query = "SELECT * FROM PatientDetails WHERE 1=1";
      const params = [];
      let paramCount = 1;

      if (filters.ageRange) {
        const [minAge, maxAge] = filters.ageRange.split("-");
        query += ` AND Age BETWEEN $${paramCount} AND $${paramCount + 1}`;
        params.push(parseInt(minAge), parseInt(maxAge));
        paramCount += 2;
      }

      if (filters.bloodGroup) {
        query += ` AND BloodGroup = $${paramCount}`;
        params.push(filters.bloodGroup);
        paramCount += 1;
      }

      if (filters.medicalCondition) {
        query += ` AND MedicalCondition ILIKE $${paramCount}`;
        params.push(`%${filters.medicalCondition}%`);
        paramCount += 1;
      }

      if (filters.heightRange) {
        const [minHeight, maxHeight] = filters.heightRange.split("-");
        query += ` AND Height BETWEEN $${paramCount} AND $${paramCount + 1}`;
        params.push(parseFloat(minHeight), parseFloat(maxHeight));
        paramCount += 2;
      }

      if (filters.weightRange) {
        const [minWeight, maxWeight] = filters.weightRange.split("-");
        query += ` AND Weight BETWEEN $${paramCount} AND $${paramCount + 1}`;
        params.push(parseFloat(minWeight), parseFloat(maxWeight));
      }

      const results = await db.query(query, params);
      setResults(results.rows);
      setLoading(false);
    } catch (error) {
      console.error("Error querying records:", error);
      setError("Failed to fetch records. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Query Patient Records</h2>

      <form onSubmit={handleSearch} className="search-form-group">
        <div className="select-wrapper">
          <select
            name="ageRange"
            value={filters.ageRange}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">Select Age Range</option>
            <option value="0-18">0-18</option>
            <option value="19-30">19-30</option>
            <option value="31-50">31-50</option>
            <option value="51-70">51-70</option>
            <option value="71-100">71+</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            name="bloodGroup"
            value={filters.bloodGroup}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <input
          type="text"
          name="medicalCondition"
          placeholder="Medical Condition"
          value={filters.medicalCondition}
          onChange={handleFilterChange}
          className="search-input"
        />

        <div className="select-wrapper">
          <select
            name="heightRange"
            value={filters.heightRange}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">Select Height Range (cm)</option>
            <option value="150-160">150-160</option>
            <option value="161-170">161-170</option>
            <option value="171-180">171-180</option>
            <option value="181-190">181-190</option>
            <option value="191-200">191+</option>
          </select>
        </div>

        <div className="select-wrapper">
          <select
            name="weightRange"
            value={filters.weightRange}
            onChange={handleFilterChange}
            className="search-select"
          >
            <option value="">Select Weight Range (kg)</option>
            <option value="40-50">40-50</option>
            <option value="51-60">51-60</option>
            <option value="61-70">61-70</option>
            <option value="71-80">71-80</option>
            <option value="81-90">81-90</option>
            <option value="91-100">91+</option>
          </select>
        </div>

        <button type="submit" className="search-button" disabled={loading}>
          <span className="search-icon">⚲</span>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      

      {results.length > 0 && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Blood Group</th>
                <th>Height (cm)</th>
                <th>Weight (kg)</th>
                <th>Medical Condition</th>
              </tr>
            </thead>
            <tbody>
              {results.map((patient) => (
                <tr key={patient.patientid}>
                  <td>{patient.patientid}</td>
                  <td>{`${patient.firstname} ${patient.lastname}`}</td>
                  <td>{patient.age}</td>
                  <td>{patient.bloodgroup}</td>
                  <td>{patient.height}</td>
                  <td>{patient.weight}</td>
                  <td>{patient.medicalcondition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && results.length === 0 && (
        <p className="text-center mt-4">No records found matching your criteria.</p>
      )}
    </div>
  );
};

export default QueryRecords;