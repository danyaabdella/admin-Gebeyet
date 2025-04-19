import { Location } from "@/models/About";
import { connectToDB, isSuperAdmin } from "@/utils/functions";

export async function GET() {
  await connectToDB();
  // await isSuperAdmin();

  try {
    const data = await Location.find();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

export async function POST(req) {
  await connectToDB();
  // await isSuperAdmin();

  try {
    const body = await req.json();
    const data = await Location.create(body);
    return new Response(JSON.stringify({ success: true, data }), {
      status: 201,
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

export async function PUT(req) {
  await connectToDB();
  // await isSuperAdmin();

  try {
    const body = await req.json();
    const { id, ...rest } = body;
    const data = await Location.findByIdAndUpdate(id, rest, { new: true });
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

