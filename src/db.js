import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";

// Initialize the DB instance (returns a Promise)
export const dbPromise = PGlite.create("idb://my-database", {
  extensions: { live },
});

export const initializeDatabase = async (db) => {
  await db.exec(`
     CREATE TABLE IF NOT EXISTS PatientDetails (
      PatientID TEXT PRIMARY KEY,
      FirstName TEXT NOT NULL,
      LastName TEXT NOT NULL,
      Email TEXT UNIQUE NOT NULL,
      Number TEXT,
      Verified BOOLEAN DEFAULT false,
      AccessToken TEXT,
      RefreshToken TEXT,
      Password TEXT NOT NULL,
      Age INTEGER,
        BloodGroup TEXT,
        Height REAL,
        Weight REAL,
        MedicalCondition TEXT);
    
   
  `);

  // Initialize other tables if needed
  await initializeDoctorDetails(db);
  await initializePatientRecords(db);
};

export const initializeDoctorDetails = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS DoctorDetails (
      DoctorID TEXT PRIMARY KEY,
      FirstName TEXT NOT NULL,
      LastName TEXT NOT NULL,
      Email TEXT UNIQUE NOT NULL,
      Number TEXT,
      Specialization TEXT
    );
  `);
};

export const initializePatientRecords = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS PatientRecords (
      RecordID TEXT PRIMARY KEY,
      PatientID TEXT,
      Age INTEGER,
      BloodGroup TEXT,
      Height REAL,
      Disease TEXT,
      Treatment TEXT,
      Date TIMESTAMP,
      DoctorID TEXT,
      FOREIGN KEY (PatientID) REFERENCES PatientDetails(PatientID) ON DELETE CASCADE,
      FOREIGN KEY (DoctorID) REFERENCES DoctorDetails(DoctorID) ON DELETE CASCADE
    );
  `);
};