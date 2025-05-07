import React, { useState } from "react";
import { dbPromise } from "../db";
import { deletePatient } from "../queries";

const DeletePatientPage = () => {
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");

  const handleDelete = async () => {
    if (!patientId.trim()) {
      setStatus("Please enter a valid Patient ID.");
      return;
    }

    try {
      const db = await dbPromise;

      // Use positional parameter with exec
      await db.query(deletePatient, [patientId]);

      setStatus(`Patient with ID "${patientId}" deleted successfully.`);
      setPatientId("");
    } catch (error) {
      console.error("Error deleting patient:", error);
      setStatus("An error occurred while deleting the patient.");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Delete Patient Record</h2>
      <input
        type="text"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        placeholder="Enter Patient ID"
        className="search-input"
      />
      <button onClick={handleDelete} className="button-delete">
        Delete Patient
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default DeletePatientPage;
