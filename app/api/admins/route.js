import { connectToDB } from "../../utils/functions";
import Admin from "../../models/Admin";
import { getServerSession } from "next-auth"; 
import { options } from "../auth/[...nextauth]/options"; 
import { role } from "../auth/[...nextauth]/route"; 
import bcrypt from "bcrypt"; // Make sure to import bcrypt

// Utility function to check if the user has "superAdmin" role
async function isSuperAdmin() {
  const userRole = await role();
  if (userRole !== "superAdmin") {
    throw new Error("Unauthorized: Only superAdmins can perform this operation");
  }
}

async function isAdmin() {
  const userRole = await role();
  if (userRole !== "admin") {
    throw new Error("Unauthorized: Only admins can perform this operation");
  }
}

// GET: Fetch all admins
export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const createdAt = url.searchParams.get("createdAt");
    const isBanned = url.searchParams.get("isBanned");
    const email = url.searchParams.get("email");

    // Check the user's role
    const userRole = await role();
    if (!userRole) {
      return new Response(JSON.stringify({ message: "Unauthorized: No user session found" }), { status: 401 });
    }

    // If fetching by _id, allow both superAdmin and admin roles
    if (_id) {
      if (userRole !== "superAdmin" && userRole !== "admin") {
        return new Response(JSON.stringify({ message: "Unauthorized: Only admins or superAdmins can fetch by ID" }), { status: 403 });
      }
      const admin = await Admin.findById(_id);
      if (!admin) {
        return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
      }
      return new Response(JSON.stringify(admin), { status: 200 });
    }

    // For all other fetch operations, only superAdmin is allowed
    await isSuperAdmin();

    let filter = {};

    if (createdAt) {
      filter.createdAt = { $gte: new Date(createdAt) };
    }
    if (isBanned) {
      filter.isBanned = isBanned === "true"; // Convert query string to boolean
    }
    if (email) {
      filter.email = email;
    }

    const admins = await Admin.find(filter);
    return new Response(JSON.stringify(admins), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error fetching admins",
      }),
      { status: error.message === "Unauthorized: Only superAdmins can perform this operation" ? 403 : 500 }
    );
  }
}


// POST: Create a new admin
export async function POST(req) {
  try {
    await connectToDB();
    await isSuperAdmin(); // Authenticate user role

    const { email, fullname, password, phone, role, createdBy } = await req.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ message: "Admin already exists" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      email,
      fullname,
      password: hashedPassword,
      phone,
      role,
      createdBy,
    });

    return new Response(JSON.stringify(newAdmin), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error creating admin",
      }),
      { status: error.message === "Unauthorized: Only superAdmins can perform this operation" ? 403 : 500 }
    );
  }
}

//Update Admin
export async function PUT(req) {
  try {
    await connectToDB();

    // Parse the request data
    const { _id, email, fullname, password, phone, role, isBanned } = await req.json();

    // Case 1: If isBanned is passed, check if user is superAdmin and only update isBanned
    if (typeof isBanned !== "undefined") {
      await isSuperAdmin(); 

      const updatedData = { isBanned };

      const updatedAdmin = await Admin.findByIdAndUpdate(_id, updatedData, { new: true });
      if (!updatedAdmin) {
        return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
      }

      return new Response(JSON.stringify(updatedAdmin), { status: 200 });
    } else {
      // Case 2: If isBanned is not passed, check if user is admin and update other fields
      await isAdmin(); 

      const updatedData = {
        email,
        fullname,
        phone,
        role,
      };

      // Hash password only if it's being updated
      if (password) {
        updatedData.password = await bcrypt.hash(password, 10);
      }

      const updatedAdmin = await Admin.findByIdAndUpdate(_id, updatedData, { new: true });
      if (!updatedAdmin) {
        return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
      }

      return new Response(JSON.stringify(updatedAdmin), { status: 200 });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error updating admin",
      }),
      { status: error.message === "Unauthorized: Only superAdmins can perform this operation" ? 403 : 500 }
    );
  }
}

// DELETE: Soft delete an admin
export async function DELETE(req) {
  try {
    await connectToDB();
    await isSuperAdmin();

    const { _id } = await req.json();

    // Find the admin to soft delete
    const admin = await Admin.findById(_id);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
    }

    // Mark the admin as deleted and set trash date (soft delete)
    admin.trashDate = new Date();
    await admin.save();

    return new Response(
      JSON.stringify({ message: "Admin soft deleted. It will be permanently deleted after 20 seconds." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error deleting admin",
      }),
      { status: 500 }
    );
  }
}


