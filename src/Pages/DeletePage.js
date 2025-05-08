import React, { useState } from "react";
import { dbPromise } from "../db";
import { deletePatient } from "../queries";

const DeletePatientPage = () => {
  const [patientId, setPatientId] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("");

  const handleDelete = async () => {
    if (!patientId.trim()) {
      setStatus("Please enter a valid Patient ID.");
      setStatusType("error");
      return;
    }

    try {
      const db = await dbPromise;
      await db.query(deletePatient, [patientId]);
      setStatus(`Patient with ID "${patientId}" deleted successfully.`);
      setStatusType("success");
      setPatientId("");
    } catch (error) {
      console.error("Error deleting patient:", error);
      setStatus("An error occurred while deleting the patient.");
      setStatusType("error");
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Delete Patient Record</h2>
      <div className="delete-container">
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="search-input"
        />
        <button
          onClick={handleDelete}
          className="btn btn-danger delete-btn"
        >
          Delete Patient
        </button>
        {status && (
          <div className={`delete-status ${statusType}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletePatientPage;