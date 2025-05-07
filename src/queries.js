export const insertPatientDetails = `
  INSERT INTO PatientDetails (
    PatientID, FirstName, LastName, Email, Number, 
    Age, BloodGroup, Height, Weight, MedicalCondition, Password
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
`;
export const getPatientDetailsbyName= `
  SELECT * FROM PatientDetails WHERE FirstName LIKE $1 OR LastName LIKE $1;
`;

export const deletePatient= `
  DELETE FROM PatientDetails WHERE PatientID = $1;
`;