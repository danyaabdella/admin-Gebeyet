import { TimelineEvent } from "@/models/About";
import { connectToDB, isSuperAdmin } from "@/utils/functions";

export async function GET() {
  await connectToDB();
  // await isSuperAdmin();

  try {
    const data = await TimelineEvent.find();
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

export async function POST(req) {
    await connectToDB();
    await isSuperAdmin();  

    try {
    const body = await req.json();
    const data = await TimelineEvent.create(body);
    return new Response(JSON.stringify({ success: true, data }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}

export async function PUT(req) {
  await connectToDB();
  await isSuperAdmin();

  try {
    const body = await req.json(); // Get the updated timeline events data from the request body
    
    // Clear out the old timeline events
    await TimelineEvent.deleteMany({});

    // Insert the new timeline events into the database
    const updatedTimelineEvents = await TimelineEvent.insertMany(body);

    return new Response(JSON.stringify({ success: true, data: updatedTimelineEvents }), { status: 200 });
  } catch (error) {
    console.error("Error updating timeline events:", error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || "Error updating timeline events" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  await connectToDB();
  await isSuperAdmin();  
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await TimelineEvent.findByIdAndDelete(id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
