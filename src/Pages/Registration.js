import React, { useState } from "react";
import { dbPromise } from "../db";
import { insertPatientDetails } from "../queries";

const Registration = () => {
  const [formData, setFormData] = useState({
    PatientID: "",
    FirstName: "",
    LastName: "",
    Email: "",
    Number: "",
    Password: "",
  });
  
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    
    const db = await dbPromise;
    const { PatientID, FirstName, LastName, Email, Number, Password } = formData;
    
    try {
      await db.query(insertPatientDetails, [
        PatientID,
        FirstName,
        LastName,
        Email,
        Number,
        Password,
      ]);

      setSuccessMessage("Patient registered successfully!");

      // Clear the form data
      setFormData({
        PatientID: "",
        FirstName: "",
        LastName: "",
        Email: "",
        Number: "",
        Password: "",
      });
    } catch (error) {
      console.error("Error inserting patient details:", error);
      setErrorMessage("Failed to register patient. Please try again.");
    }
  };
  
  const formFields = [
    { name: "PatientID", label: "Patient ID", type: "text" },
    { name: "FirstName", label: "First Name", type: "text" },
    { name: "LastName", label: "Last Name", type: "text" },
    { name: "Email", label: "Email Address", type: "email" },
    { name: "Number", label: "Phone Number", type: "tel" },
    { name: "Password", label: "Password", type: "password" },
  ];

  return (
    <div className="form-container">
      <h2 className="form-title">Patient Registration</h2>
      
      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger">
          {errorMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {formFields.map((field) => (
          <div className="form-group" key={field.name}>
            <label className="form-label" htmlFor={field.name}>
              {field.label}
            </label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        ))}
        
        <button type="submit" className="btn btn-primary btn-block">
          Register Patient
        </button>
      </form>
    </div>
  );
};

export default Registration;