import React, { useEffect, useState } from "react";
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
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const db = await dbPromise;
        const { PatientID, FirstName, LastName, Email, Number, Password } = formData;
        console.log(formData)
    
        try {
          // Use db.query() for the insert operation
          await db.query(insertPatientDetails, [
            PatientID,
            FirstName,
            LastName,
            Email,
            Number,
            Password,
          ]);
    
          alert("Patient registered successfully!");
    
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
          alert("Failed to register patient. Please try again.");
        }
      };
    
      return (
        <div className="p-4 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Patient Registration</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["PatientID", "FirstName", "LastName", "Email", "Number", "Password"].map((field) => (
              <input
                key={field}
                type={field === "Password" ? "password" : "text"}
                name={field}
                placeholder={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            ))}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
              Register
            </button>
          </form>
        </div>
      );
    };    
export default Registration;