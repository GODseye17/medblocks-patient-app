import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";

// Initialize the DB instance (returns a Promise)
export const dbPromise = PGlite.create("idb://my-database", {
    extensions: { live },
  });

// Function to initialize PatientDetails table
export const initializeDatabase = async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS PatientDetails (
      PatientID TEXT PRIMARY KEY,
      FirstName TEXT,
      LastName TEXT,
      Email TEXT,
      Number TEXT,
      Verified BOOLEAN DEFAULT false,
      AccessToken TEXT,
      RefreshToken TEXT,
      Password TEXT
    );
  `);
};