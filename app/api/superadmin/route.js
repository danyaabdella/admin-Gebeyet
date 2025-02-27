
import SuperAdmin from "../../models/SuperAdmin";
import argon2 from "argon2";
import { connectToDB } from "@/app/utils/functions";

export async function POST(req) {
  try {
    await connectToDB();

    const { email, fullname, password, phone } = await req.json();

    if (!email || !fullname || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const existingUser = await SuperAdmin.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "SuperAdmin already exists" }), { status: 409 });
    }

    const hashedPassword = await argon2.hash(password);

    const newSuperAdmin = new SuperAdmin({
      email,
      fullname,
      password: hashedPassword,
      phone,
    });

    await newSuperAdmin.save();

    return new Response(JSON.stringify({ message: "SuperAdmin created successfully" }), { status: 201 });
  } catch (error) {
    console.error("Error creating SuperAdmin:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}