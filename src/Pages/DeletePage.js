import React, { useState } from "react";
import { dbPromise } from "../db";
import { deletePatient } from "../queries";
import { broadcastPatientUpdate } from "../tabSync";

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
      console.log(`[DeletePage] Attempting to delete patient with ID: ${patientId}`);
      const db = await dbPromise;
      const result = await db.query(deletePatient, [patientId]);
      
      console.log(`[DeletePage] Delete operation result:`, result);
      
      if (result && result.rowCount > 0) {
        console.log(`[DeletePage] Patient ${patientId} deleted successfully`);
        
        const deleteData = { 
          patientId: patientId,
          timestamp: new Date().getTime(),
          success: true
        };
        
        console.log(`[DeletePage] Broadcasting patient delete:`, deleteData);
        broadcastPatientUpdate('PATIENT_DELETED', deleteData);
        
        setStatus(`Patient with ID "${patientId}" deleted successfully.`);
        setStatusType("success");
        setPatientId("");
      } else {
        console.log(`[DeletePage] No patient found with ID: ${patientId}`);
        setStatus(`No patient found with ID "${patientId}".`);
        setStatusType("error");
      }
    } catch (error) {
      console.error("[DeletePage] Error deleting patient:", error);
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