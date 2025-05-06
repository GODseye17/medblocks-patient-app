import React, { useEffect, useState } from "react";
import { dbPromise } from "../db";

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
          try {
            const db = await dbPromise;
            const results = await db.query("SELECT * FROM PatientDetails");
            console.log("hello");
            console.log(results.rows);
            setPatients(results.rows);
          } catch (error) {
            console.error("Error fetching patient details:", error);
          }
        };
    
        fetchPatients();
      }, []);
      return (
        <div className="p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Patient List</h2>
          {patients.length === 0 ? (
            <p>No patients registered yet.</p>
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
                {patients.map((patient) => (
                  <tr key={patient.patientid}>
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