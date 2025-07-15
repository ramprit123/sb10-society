import { insertDummyResidents } from "@/utils/dummyData";

// NOTE: You need to create the residents table in your Supabase dashboard first
// or run the SQL script in database/create_residents_table.sql

// Function to setup the database and insert dummy data
export const setupResidentsDatabase = async () => {
  try {
    console.log("Setting up residents database...");
    await insertDummyResidents();
    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Error setting up database:", error);
    throw error;
  }
};

// Export for use in components
export { insertDummyResidents };
