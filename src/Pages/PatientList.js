import React, { use, useEffect, useState } from "react";
import { dbPromise } from "../db";
import { getPatientDetailsbyName } from "../queries";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [name, setName] = useState("");
    const [filteredPatients, setFilteredPatients] = useState([]);
    

    useEffect(() => {
        const fetchPatients = async () => {
          try {
            const db = await dbPromise;
            const results = await db.query("SELECT * FROM PatientDetails");
            console.log("hello");
            console.log(results.rows);
            setPatients(results.rows);
            setFilteredPatients(results.rows);
          } catch (error) {
            console.error("Error fetching patient details:", error);
          }
        };
        fetchPatients();
    }, []);

        const handleSearch = async () => {
            if (name.trim() === "") {
                setFilteredPatients(patients);
                return;
            }
            try{
                const db = await dbPromise;
                const res = await db.query(getPatientDetailsbyName, [`%${name.trim()}%`]);
                if (res.rows.length === 0) {
                    alert("No patients found with that name.");
                    setFilteredPatients([]);
                } else {
                    setFilteredPatients(res.rows);
                }
            } catch (error) {
                console.error("Error fetching patient details:", error);
                alert("Failed to fetch patient details. Please try again.");
            }
        };

      return (

        <div className="p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Patient List</h2>
          {/* Search bar */}
          <div className="mb-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Search by First or Last Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                />
                <button
                    onClick={handleSearch}
                    className="mt-2 w-full bg-red-500 text-white p-2 rounded">
                    Search
                    </button>
                
            </div>
          {/* Show list of patients */}
          {filteredPatients.length === 0 ? (
                <p>No patients found.</p>
            ) : (
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Patient ID</th>
                            <th className="border px-4 py-2">First Name</th>
                            <th className="border px-4 py-2">Last Name</th>
                            <th className="border px-4 py-2">Email</th>
                            <th className="border px-4 py-2">Phone Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.map((patient) => (
                            <tr key={patient.PatientID}>
                                <td className="border px-4 py-2">{patient.patientid}</td>
                                <td className="border px-4 py-2">{patient.firstname}</td>
                                <td className="border px-4 py-2">{patient.lastname}</td>
                                <td className="border px-4 py-2">{patient.email}</td>
                                <td className="border px-4 py-2">{patient.number}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      );
};
export default PatientList;