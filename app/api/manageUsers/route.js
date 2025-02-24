import { connectToDB, isAdmin, sendNotification, userInfo } from "../../../utils/functions";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await isAdmin();

    await connectToDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const email = url.searchParams.get("email");
    const fullName = url.searchParams.get("fullName");
    const isBanned = url.searchParams.get("isBanned");
    const role = url.searchParams.get("role");
    const isMerchant = url.searchParams.get("isMerchant");
    const stateName = url.searchParams.get("stateName");
    const cityName = url.searchParams.get("cityName");
    const approvedBy = url.searchParams.get("approvedBy");
    const bannedBy = url.searchParams.get("bannedBy");

    // Build the filter object dynamically
    let filter = {};
    if (_id) filter._id = _id;
    if (email) filter.email = email;
    if (fullName) filter.fullName = { $regex: fullName, $options: "i" };
    if (isBanned) filter.banned = isBanned === "true"; 
    if (role) filter.role = role;
    if (approvedBy) filter.approvedBy = approvedBy;
    if (bannedBy) filter.bannedBy = bannedBy;
    if (isMerchant) filter.isMerchant = isMerchant === "true";
    if (stateName) filter.stateName = { $regex: stateName, $options: "i" }; 
    if (cityName) filter.cityName = { $regex: cityName, $options: "i" }; 

    // Fetch users based on the filter
    const users = await User.find(filter);

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return new Response(
      JSON.stringify({ message: error.message || "Error fetching users" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await isAdmin();
    await connectToDB();

    const userData = await userInfo();

    // Parse the request body
    const body = await req.json();
    const { _id, isMerchant, isBanned, isDeleted } = body;

    if (!_id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    // Check if the user is marked as deleted
    const user = await User.findById(_id);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Handle the undo deletion logic
    if (isDeleted === false && user.trashDate !== null) {
      user.trashDate = null;
      user.isDeleted = false;
      await user.save();
      await sendNotification(user.email, "user", "restored");
      return new Response(JSON.stringify({ message: "User restored from trash" }), { status: 200 });
    }

    // Build the update object dynamically
    let updateData = {};
    if (isMerchant !== undefined) {
      updateData.isMerchant = isMerchant;
      updateData.approvedBy = isMerchant ? userData.email : null;
      await sendNotification(user.email, "user", "approved");
    }
    if (isBanned !== undefined) {
      updateData.isBanned = isBanned;
      updateData.bannedBy = isBanned ? userData.email : null;
      if (isBanned) {
        await sendNotification(user.email, "user", "banned");
      }
    }

    // Update the user if no deletion logic is applied
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }


    return new Response(JSON.stringify({ message: "User updated successfully", user: updatedUser }), { status: 200 });
  } catch (error) {
    console.error("Error occurred:", error.message);
    return new Response(
      JSON.stringify({ message: error.message || "Error updating user data" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
try {
    await connectToDB();
    await isAdmin();

    const { _id } = await req.json();

    // Find the user to soft-delete
    const user = await User.findById(_id);
    if (!user) {
    return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    if (user.isDeleted) {
      return new Response(
        JSON.stringify({ message: "User alraeady in trash. It will be permanently deleted after 30 days." }),
        { status: 200 }
        );
    }
    // Mark the user as deleted and set the trash date
    user.isDeleted = true;
    user.trashDate = new Date();
    await user.save();
    await sendNotification(user.email, "user", "deleted");

    return new Response(
    JSON.stringify({ message: "User soft deleted. It will be permanently deleted after 30 days." }),
    { status: 200 }
    );
} catch (error) {
    return new Response(
    JSON.stringify({ message: error.message || "Error deleting user" }),
    { status: 500 }
    );
}
}