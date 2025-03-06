import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SuperAdmin from "../../models/SuperAdmin";
import Admin from "../../models/Admin";
import {role} from "../auth/[...nextauth]/route";
import argon2 from "argon2";
import { connectToDB } from "../../utils/functions";

export async function GET(req) {
    const role1 = await role();
    console.log("role of user: ", role1);
    try {
        connectToDB();

        const url = new URL(req.url);
        const _id = url.searchParams.get('_id');

        let filterUser = {};
        if (_id) {
            filterUser = { _id };
        } else {
            const session = await getServerSession(options);
            console.log("session in server:", session);
            const email = session?.user?.email;
            console.log("email in server: ", email);
            if (!email) {
                return new Response(JSON.stringify({ error: "No session found" }), { status: 401 });
            }
            filterUser = { email };
        }

        let user = await SuperAdmin.findOne(filterUser).lean();
        if (!user) {
           user = await Admin.findOne(filterUser).lean();
        }

        return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
        console.error('Error fetching user data:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToDB();

        const session = await getServerSession(options);
        if (!session?.user?.email) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const email = session.user.email;
        const { fullname, img, phone, password } = await req.json();

        // Only allow updates for these fields
        const updateData = {};
        if (fullname) updateData.fullname = fullname;
        if (img) updateData.img = img;
        if (phone) updateData.phone = phone;
        if (password) {
            updateData.password = await argon2.hash(password);
        }

        let user = await SuperAdmin.findOneAndUpdate({ email }, updateData, { new: true });
        if (!user) {
            user = await Admin.findOneAndUpdate({ email }, updateData, { new: true });
        }

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Profile updated successfully", user }), { status: 200 });
    } catch (error) {
        console.error("Error updating profile:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
