import { connectToDB, isAdmin, sendNotification, userInfo, isAdminOrSuperAdmin } from "../../../utils/functions";
import User from "../../../models/User";

export async function GET(req) {
  try {
    await isAdminOrSuperAdmin();

    await connectToDB();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const email = url.searchParams.get("email");
    const fullName = url.searchParams.get("fullName");
    const isBanned = url.searchParams.get("isBanned");
    const role = url.searchParams.get("role");
    const approvalStatus = url.searchParams.get("approvalStatus");
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
    if (approvalStatus) filter.approvalStatus = approvalStatus === "true";
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
    await isAdminOrSuperAdmin();
    await connectToDB();

    const userData = await userInfo();
    const { _id, approvalStatus, isBanned, isDeleted } = await req.json();

    console.log("User passed: ", _id, approvalStatus, isBanned, isDeleted);

    if (!_id) {
      return new Response(JSON.stringify({ message: "User ID is required" }), { status: 400 });
    }

    const user = await User.findById(_id);
    console.log("Full user Info: ", user);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // Restore user from trash
    if (
      (isDeleted === false || isDeleted === "false") &&
      user.isDeleted &&
      user.trashDate !== null
    ) {
      user.isDeleted = false;
      user.trashDate = null;
      await user.save();
      await sendNotification(user.email, "user", "restored");

      return new Response(JSON.stringify({ message: "User restored from trash" }), { status: 200 });
    }

    // Update approvalStatus
    if (approvalStatus) {
      user.approvalStatus = approvalStatus;
      user.approvedBy = approvalStatus === "approved" ? userData.email : null;
      await user.save();
      await sendNotification(user.email, "user", approvalStatus);

      return new Response(JSON.stringify({ message: `User ${approvalStatus}` }), { status: 200 });
    }

    // Update ban status
    if (isBanned === true || isBanned === false || isBanned === "true" || isBanned === "false") {
      const isBannedBool = isBanned === true || isBanned === "true";
      user.isBanned = isBannedBool;
      user.bannedBy = isBannedBool ? userData.email : null;
      await user.save();
      await sendNotification(user.email, "user", isBannedBool ? "banned" : "unbanned");

      return new Response(
        JSON.stringify({ message: `User ${isBannedBool ? "banned" : "unbanned"}` }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ message: "No update action was provided" }),
      { status: 400 }
    );
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
    await isAdminOrSuperAdmin();

    const { _id } = await req.json();
    console.log("id: ", _id);

    // Find the user
    const user = await User.findById(_id);
    console.log("User to delete: ", user);
    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    if (user.isDeleted) {
      await User.findByIdAndDelete(_id);

      return new Response(
        JSON.stringify({ message: "User permanently deleted from the trash." }),
        { status: 200 }
      );
    }

    // Soft delete: mark user as deleted and set trash date
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
