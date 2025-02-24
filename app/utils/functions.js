import mongoose from 'mongoose';
import Admin from '../models/Admin';
import SuperAdmin from '../models/SuperAdmin';
import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';

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

  let isConnected = false; 
  
  export async function connectToDB() {
    if (isConnected && mongoose.connection.readyState === 1) {
      console.log("Using existing database connection");
      return;
    }
  
    try {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000,
      });
  
      isConnected = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error.message);
      throw new Error("Failed to connect to the database");
    }
  }
  
  // Utility function to check if the user has "superAdmin" role
  export async function isSuperAdmin() {
    const userRole = await role();
    if (userRole !== "superAdmin") {
      throw new Error("Unauthorized: Only superAdmins can perform this operation");
    }
  }
  
  export async function isAdmin() {
    const userRole = await role();
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Only admins can perform this operation");
    }
  }

  export async function userInfo() {
    const session = await getServerSession(options)
    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    let userInfo = await Admin.findOne({email: userEmail})
    if (!userInfo) {
        userInfo = await SuperAdmin.findOne({email: userEmail})
    }
    console.log("user info to check role: ", userInfo.role);
    if(!userInfo) {
      return false;
    }
  
    return userInfo;
  }
  export async function role() {
    const session = await getServerSession(options);
    console.log("session: ", session);

    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    console.log("email: ", userEmail);

    let userInfo = await Admin.findOne({email: userEmail})
    if (!userInfo) {
        userInfo = await SuperAdmin.findOne({email: userEmail})
    }
    if(!userInfo) {
      return false;
    }
  
    return userInfo.role;
  }