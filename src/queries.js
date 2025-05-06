export const insertPatientDetails = `
  INSERT INTO PatientDetails (PatientID, FirstName, LastName, Email, Number, Password)
  VALUES ($1, $2, $3, $4, $5, $6);
`;