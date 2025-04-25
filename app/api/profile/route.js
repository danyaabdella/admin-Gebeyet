import { options } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SuperAdmin from "@/models/SuperAdmin";
import Admin from "@/models/Admin";
import {role} from "../auth/[...nextauth]/route";
import argon2 from "argon2";
import { connectToDB } from "@/utils/functions";

export async function GET(req) {
    const role1 = await role();
  
    try {
      connectToDB();
  
      const url = new URL(req.url);
      const _id = url.searchParams.get('_id');
      const email = url.searchParams.get('email');
  
      let filterUser = {};
  
      if (_id) {
        filterUser = { _id };
      } else if (email) {
        filterUser = { email };
      } else {
        return new Response(JSON.stringify({ error: "No _id or email provided" }), { status: 400 });
      }
  
      let user = await SuperAdmin.findOne(filterUser).lean();
      if (!user) {
        user = await Admin.findOne(filterUser).lean();
      }
  
      if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
      }
  
      return new Response(JSON.stringify(user), { status: 200 });
    } catch (error) {
      console.error("Error fetching user data:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
  
export async function PUT(req) {
  try {
    await connectToDB()

    const session = await getServerSession(options)
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const email = session.user.email
    const { fullname, image, phone, currentPassword, newPassword } = await req.json()

    let user = await SuperAdmin.findOne({ email })
    if (!user) {
      user = await Admin.findOne({ email })
    }
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
    }

    const updateData = {}
    if (fullname) updateData.fullname = fullname
    if (image) updateData.image = image
    if (phone) updateData.phone = phone

    if (newPassword) {
      if (!currentPassword) {
        return new Response(JSON.stringify({ error: "Current password is required" }), { status: 400 })
      }

      const isPasswordValid = await argon2.verify(user.password, currentPassword)
      if (!isPasswordValid) {
        return new Response(JSON.stringify({ error: "Incorrect current password" }), { status: 400 })
      }

      updateData.password = await argon2.hash(newPassword)
    }

    // Update user
    const updatedUser = await (user.__proto__.constructor).findOneAndUpdate(
      { email },
      updateData,
      { new: true }
    )

    return new Response(
      JSON.stringify({ message: "Profile updated successfully", user: updatedUser }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating profile:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 })
  }
}
