import React, { useEffect, useState } from "react";
import { dbPromise } from "../db";
import { getPatientDetailsbyName } from "../queries";

const PatientSearch = () => {
    const [name, setName] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async (e) => {
        e.preventDefault();
        const db = await dbPromise;
        try {
            const res = await db.query(getPatientDetailsbyName, [`%${name.trim()}%`]);
            if (res.rows.length === 0) {
                alert("No patients found with that name.");
                return;
            }
            console.log(res.rows);
            setResults(res.rows);
        } catch (error) {
            console.error("Error fetching patient details:", error);
            alert("Failed to fetch patient details. Please try again.");
        }
    };
    return (
        <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Search Patients by Name</h2>
      <form onSubmit={handleSearch} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Enter First or Last Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Search
        </button>
      </form>

      {results.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Results:</h3>
          <ul className="space-y-2">
            {results.map((patient) => (
              <li key={patient.patientid || `${patient.firstname}-${patient.lastname}`} className="border p-2 rounded">
                <p><strong>ID:</strong> {patient.patientid}</p>
                <p><strong>Name:</strong> {patient.firstname} {patient.lastname}</p>
                <p><strong>Email:</strong> {patient.email}</p>
                <p><strong>Number:</strong> {patient.number}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    );
};

export default PatientSearch;