import { connectToDB, isAdmin, isSuperAdmin, sendNotification } from "../../utils/functions";
import Admin from "../../models/Admin"; 
import { role } from "../auth/[...nextauth]/route"; 
import argon2 from 'argon2';
import DeletedAdmin from '../../models/DeletedAdmin';

// GET: Fetch all admins
export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const createdAt = url.searchParams.get("createdAt");
    const isBanned = url.searchParams.get("isBanned");
    const email = url.searchParams.get("email");
    const isDeleted = url.searchParams.get("isDeleted");

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
      filter.isBanned = isBanned ; 
    }
    if (email) {
      filter.email = email;
    }
    if (isDeleted) {
      filter.isDeleted = isDeleted ;
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
    await isSuperAdmin(); 

    const { email, fullname, password, phone, createdBy } = await req.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return new Response(JSON.stringify({ message: "Admin already exists" }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await argon2.hash(password); 

    const newAdmin = await Admin.create({
      email,
      fullname,
      password: hashedPassword,
      phone,
      createdBy,
    });

    await sendNotification(newAdmin.email, "admin", "created", password);

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
    const { _id, isBanned, isDeleted } = await req.json();

    if (!_id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const admin = await Admin.findById(_id);
    if (!admin) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Case 1: If isBanned is passed, check if user is superAdmin and only update isBanned
    if (typeof isBanned !== "undefined") {
      await isSuperAdmin(); 
    
      // Update ban status separately
      const updatedAdmin = await Admin.findByIdAndUpdate(
        _id,
        { isBanned },
        { new: true }
      );
    
      if (!updatedAdmin) {
        return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
      }
    
      if (isBanned) {
        await sendNotification(updatedAdmin.email, "admin", "banned");
      } else {
        await sendNotification(updatedAdmin.email, "admin", "restored");
      }
    
      return new Response(JSON.stringify(updatedAdmin), { status: 200 });
    } 
    
    if (isDeleted === true) {
      await isSuperAdmin();

      // Move admin to DeletedAdmin database
      await DeletedAdmin.create({
        _id: admin._id,
        email: admin.email,
        fullname: admin.fullname,
        phone: admin.phone,
        createdBy: admin.createdBy,
        createdAt: admin.createdAt,
        deletedAt: new Date(),
      });

      // Delete from Admin collection
      await Admin.findByIdAndDelete(_id);
      await sendNotification(admin.email, "admin", "deleted");
      return new Response(JSON.stringify({ message: "Admin permanently deleted and stored in DeletedAdmin" }), { status: 200 });
      
    }
    // } else {
    //   // Case 2: If isBanned is not passed, check if user is admin and update other fields
    //   await isAdmin(); 

    //   const updatedData = {
    //     fullname,
    //     phone,
    //   };

    //   // Hash password only if it's being updated
    //   if (password) {
    //     updatedData.password = await argon2.hash(password);  // Use argon2 for hashing
    //   }

    //   const updatedAdmin = await Admin.findByIdAndUpdate(_id, updatedData, { new: true });
    //   if (!updatedAdmin) {
    //     return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
    //   }

    //   return new Response(JSON.stringify(updatedAdmin), { status: 200 });
    // }
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

    const { _id } = await req.json();

    if (!_id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const admin = await Admin.findById(_id);
    if (!admin) {
      return new Response(JSON.stringify({ message: "Admin not found" }), { status: 404 });
    }

    await isSuperAdmin(); // Ensure only super admins can delete

    // Store deleted admin in DeletedAdmin collection
    await DeletedAdmin.create({
      _id: admin._id,
      email: admin.email,
      fullname: admin.fullname,
      phone: admin.phone,
      createdBy: admin.createdBy,
      createdAt: admin.createdAt,
      deletedAt: new Date(),
    });

    // Delete the admin from the Admin collection
    await Admin.findByIdAndDelete(_id);
    await sendNotification(admin.email, "admin", "deleted");
    return new Response(JSON.stringify({ message: "Admin permanently deleted and stored in DeletedAdmin" }), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({
        message: error.message || "Error deleting admin",
      }),
      { status: error.message === "Unauthorized: Only superAdmins can perform this operation" ? 403 : 500 }
    );
  }
}


