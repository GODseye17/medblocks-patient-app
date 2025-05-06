export const insertPatientDetails = `
  INSERT INTO PatientDetails (PatientID, FirstName, LastName, Email, Number, Password)
  VALUES ($1, $2, $3, $4, $5, $6);
`;
export const getPatientDetailsbyName= `
  SELECT * FROM PatientDetails WHERE FirstName LIKE $1 OR LastName LIKE $1;
`;