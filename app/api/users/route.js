import { getServerSession } from "next-auth";
import  options  from "../auth/options";
import User from "../../models/User";
import { role } from "../auth/[...nextauth]/route";
import { connectToDB, sendNotification } from "../../utils/functions";


export async function GET(req) {
    try {
        await connectToDB();

        // Get user session
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // Check if user is SuperAdmin or Admin
        const userRole = await role();
        if (userRole !== "superadmin" && userRole !== "admin") {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        }

        // Extract role query parameter
        const url = new URL(req.url);
        const userRoleFilter = url.searchParams.get("role"); // ?role=merchant OR ?role=customer

        if (!userRoleFilter || !["merchant", "customer"].includes(userRoleFilter)) {
            return new Response(JSON.stringify({ error: "Invalid role provided" }), { status: 400 });
        }

        // Fetch users based on the role
        const users = await User.find({ role: userRoleFilter });

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDB();
        
        const session = await getServerSession(options);
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // Check if user is SuperAdmin or Admin
        const userRole = await role( req );
        if (userRole !== "superadmin" && userRole !== "admin") {
            return new Response(JSON.stringify({ error: "Access Denied" }), { status: 403 });
        }

        // Get request body
        const { userId, newRole, isBanned } = await req.json();
        if (!userId || (!newRole && isBanned === undefined)) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        // Handle role change
        if (newRole && ["customer", "merchant"].includes(newRole)) {
            user.role = newRole;
        }

        // Handle banning/unbanning merchants
        if (isBanned !== undefined && user.role === "merchant") {
            user.isBanned = isBanned;
            
            if (isBanned) {
                await sendNotification(user.email, "user", "banned");
            } else {
                await sendNotification(user.email, "user", "restored");
            }
        }

        // Save changes
        await user.save();

        return new Response(JSON.stringify({ message: "User updated successfully", user }), { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
