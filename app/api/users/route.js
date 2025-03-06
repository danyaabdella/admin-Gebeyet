import mongoose from "mongoose";
import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SuperAdmin from "../../../models/SuperAdmin";
import Admin from "../../../models/Admin";
import {role} from "../auth/[...nextauth]/route";

export async function GET(req) {
    const role1 = await role();
    try {
        mongoose.connect(process.env.MONGO_URL);

        const url = new URL(req.url);
        const _id = url.searchParams.get('_id');

        let filterUser = {};
        if (_id) {
            filterUser = { _id };
        } else {
            const session = await getServerSession(options);
            const email = session?.user?.email;
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
