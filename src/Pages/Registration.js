import React, { useState } from "react";
import { dbPromise } from "../db";
import { insertPatientDetails } from "../queries";
import { broadcastPatientUpdate } from "../tabSync";

const Registration = () => {
  const formFields = [
    { name: "PatientID", label: "Patient ID", type: "text" },
    { name: "FirstName", label: "First Name", type: "text" },
    { name: "LastName", label: "Last Name", type: "text" },
    { name: "Email", label: "Email Address", type: "email" },
    { name: "Number", label: "Phone Number", type: "tel" },
    { name: "Age", label: "Age", type: "number" },
    { name: "BloodGroup", label: "Blood Group", type: "select", options: [
      { value: "A+", label: "A+" },
      { value: "A-", label: "A-" },
      { value: "B+", label: "B+" },
      { value: "B-", label: "B-" },
      { value: "AB+", label: "AB+" },
      { value: "AB-", label: "AB-" },
      { value: "O+", label: "O+" },
      { value: "O-", label: "O-" },
    ]},
    { name: "Height", label: "Height (cm)", type: "number" },
    { name: "Weight", label: "Weight (kg)", type: "number" },
    { name: "MedicalCondition", label: "Medical Condition", type: "textarea" },
    { name: "Password", label: "Password", type: "password" },
  ];

  const initialFormData = formFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);
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
    
    try {
      await db.query(insertPatientDetails, [
        formData.PatientID,
        formData.FirstName,
        formData.LastName,
        formData.Email,
        formData.Number,
        parseInt(formData.Age),
        formData.BloodGroup,
        parseFloat(formData.Height),
        parseFloat(formData.Weight),
        formData.MedicalCondition,
        formData.Password,
      ]);

      const patientData = {
        patientid: formData.PatientID,
        firstname: formData.FirstName,
        lastname: formData.LastName,
        email: formData.Email,
        number: formData.Number,
        age: parseInt(formData.Age),
        bloodgroup: formData.BloodGroup,
        height: parseFloat(formData.Height),
        weight: parseFloat(formData.Weight),
        medicalcondition: formData.MedicalCondition
      };
      
      broadcastPatientUpdate('PATIENT_ADDED', patientData);

      setSuccessMessage("Patient registered successfully!");
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error inserting patient details:", error);
      setErrorMessage("Failed to register patient. Please try again.");
    }
  };

  const renderField = (field) => {
    const commonProps = {
      name: field.name,
      value: formData[field.name],
      onChange: handleChange,
      className: "form-control",
      required: true,
      id: field.name,
    };

    if (field.type === "select") {
      return (
        <select {...commonProps}>
          <option value="">Select {field.label}</option>
          {field.options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea 
          {...commonProps}
          rows="3"
          required={false}
        />
      );
    }

    return (
      <input
        type={field.type}
        {...commonProps}
      />
    );
  };

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
            {renderField(field)}
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