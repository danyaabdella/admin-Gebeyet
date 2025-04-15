import { connectToDB, isAdminOrSuperAdmin } from "@/utils/functions";
import Auction from "@/models/Auction";
import { ObjectId } from "mongodb";

// PUT: Update auction status
export async function PUT(req) {
  try {
    await connectToDB();
    await isAdminOrSuperAdmin();

    const { auctionId, adminApproval } = await req.json();

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return new Response(JSON.stringify({ message: "Auction not found" }), { status: 404 });
    }

    const status = adminApproval === "approved" ? "active" : "cancelled";

    auction.adminApproval = adminApproval;
    auction.status = status;
    await auction.save();

    return new Response(JSON.stringify({ message: "Auction status updated successfully" }), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "Error updating auction" }),
      { status: 500 }
    );
  }
}

// GET: Fetch all auctions (admin/superadmin)
export async function GET(req) {
  try {
    await connectToDB();
    await isAdminOrSuperAdmin();

    const url = new URL(req.url);
    const _id = url.searchParams.get("_id");
    const status = url.searchParams.get("status");
    const adminApproval = url.searchParams.get("adminApproval");

    let filter = {};

    if (_id) filter._id = new ObjectId(_id);
    if (status) filter.status = status;
    if (adminApproval) filter.adminApproval = adminApproval;

    const auctions = await Auction.find(filter);
    return new Response(JSON.stringify(auctions), { status: 200 });

  } catch (error) {
    return new Response(
      JSON.stringify({ message: error.message || "Error fetching auctions" }),
      { status: 500 }
    );
  }
}
