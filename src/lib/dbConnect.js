import mongoose from "mongoose";

const connection = {};

async function dbconnect() {
  // Check if the connection is already established
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    console.log("Attempting to connect to the database...");

    const db = await mongoose.connect(process.env.MONGO || '');

    connection.isConnected = db.connections[0].readyState;

    if (connection.isConnected) {
      console.log("DB Connected Successfully");
    } else {
      console.log("DB connection failed");
    }

  } catch (error) {
    console.error("Database connection failed:", error.message);
    
    // Retry connection in 5 seconds if it fails
    setTimeout(() => {
      console.log("Retrying database connection...");
      dbconnect();
    }, 5000);
  }
}

export default dbconnect;