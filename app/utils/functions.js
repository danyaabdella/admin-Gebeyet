import mongoose from 'mongoose';

export async function fetchUserData() {
  let data;
    console.log("Fetched user data innn");
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const user = await response.json(); 

      console.log("Fetched user data:", user);

      if (user) {
        data = user;
        return data;
      } else {
        return {}; 
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  let isConnected = false; // Global variable to track connection status
  
  export async function connectToDB() {
    if (isConnected) {
      console.log("Using existing database connection");
      return;
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URL);
  
      isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
      throw new Error("Failed to connect to the database");
    }
  }
  