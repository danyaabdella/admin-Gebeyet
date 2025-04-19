import { connectToDB, isAdminOrSuperAdmin, userInfo } from "@/utils/functions";
import Ad from "@/models/Ad";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

const chapaSecretKey = "CHASECK_TEST-RUwJBcglJUtks3uEyM5mRQHYLqtbCmQE";

export const POST = async (req) => {
  await connectToDB();
  
//   await isAdminOrSuperAdmin();
  const user = await userInfo();
  const { product, merchantDetail, startsAt, endsAt, price, location } = await req.json();

  if (!product || !merchantDetail || !startsAt || !endsAt || !price ||!location) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  const newAd = new Ad({
    product,
    merchantDetail,
    startsAt,
    endsAt,
    price,
    approvalStatus: "PENDING", 
    location: location
  });

  try {
    await newAd.save();
    const fullName = merchantDetail.merchantName?.split(" ") || [];
    const firstName = fullName[0] || "";
    const lastName = fullName.slice(1).join(" ") || "";
    const tx_ref = uuidv4().replace(/-/g, "").slice(0, 15);

    const paymentPayload = {
      amount: price,
      currency: "ETB",
      email: merchantDetail.merchantEmail,
      first_name: firstName,
      last_name: lastName,
      phone_number: merchantDetail.phoneNumber,
      tx_ref,
      callback_url: "https://localhost:3000/callback",
      return_url: `https://localhost:3000/${tx_ref}`,
      customization: {
        title: "Payment for Ad Placement",
        description: `Payment for the ad related to product: ${product.productName}`,
      },
    };

    const response = await fetch("https://api.chapa.co/v1/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${chapaSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentPayload),
    });

    const data = await response.json();
    if (data.status) {
      return new Response(
        JSON.stringify({
          message: "Ad created and payment initialized successfully",
        //   checkout_url: data.data.checkout_url,
        }),
        { status: 201 }
      );
    } else {
      return new Response(
        JSON.stringify({
          error: "Payment initialization failed",
          details: data.message || "Unknown error",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error creating ad or initializing payment", details: error.message }), { status: 500 });
  }
};

export const GET = async (req) => {
  await connectToDB();
  await isAdminOrSuperAdmin(req);

  const url = new URL(req.url);
  const center = url.searchParams.get("center"); // e.g., "9.03-38.74"
  const radius = parseInt(url.searchParams.get("radius")) || 50000;
  const page = parseInt(url.searchParams.get("page")) || 1;
  const limit = parseInt(url.searchParams.get("limit")) || 15;
  const status = url.searchParams.get("status");

  console.log("Filters: ", center, radius, page, limit, status);

  const filter = {};
  if (status) filter.approvalStatus = status;

  try {
    if (center) {
      const [lat, lng] = center.split("-").map(Number);

      const result = await Ad.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: [lng, lat] }, // Note: [lng, lat]!
            distanceField: "distance",
            maxDistance: radius,
            spherical: true,
            query: filter,
          }
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $sort: { createdAt: -1 } },
              { $skip: (page - 1) * limit },
              { $limit: limit }
            ]
          }
        }
      ]);

      const ads = result[0]?.data || [];
      const total = result[0]?.metadata[0]?.total || 0;

      console.log("total ads (geo):", total);

      return new Response(
        JSON.stringify({
          ads,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
          },
        }),
        { status: 200 }
      );

    } else {
      const ads = await Ad.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await Ad.countDocuments(filter);

      console.log("total ads (non-geo):", total);

      return new Response(
        JSON.stringify({
          ads,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAds: total,
          },
        }),
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching ads:", error);
    return new Response(
      JSON.stringify({ error: "Error fetching ads", details: error.message }),
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  await connectToDB();
  await isAdminOrSuperAdmin();

  const { _id, action, reason, description, tx_ref, amount } = await req.json();

  console.log("update infos: ", _id, action, reason, description, tx_ref, amount);

  if (!_id) {
    return new Response(JSON.stringify({ error: "Missing ad ID" }), { status: 400 });
  }

  const ad = await Ad.findById(_id);
  if (!ad) {
    return new Response(JSON.stringify({ error: "Ad not found" }), { status: 404 });
  }

  if (ad.approvalStatus !== "PENDING") {
    return new Response(JSON.stringify({ error: "Ad is already processed" }), { status: 400 });
  }

  if (action === "APPROVE") {
    ad.approvalStatus = "APPROVED";
    ad.isActive = true;
    await ad.save();
    return new Response(JSON.stringify({ message: "Ad approved successfully" }), { status: 200 });
  }

  if (action === "REJECT") {
    // Mark as rejected
    ad.approvalStatus = "REJECTED";
    ad.rejectionReason = { reason, description: description };
    ad.isActive = false;

    // Call refund API
    try {
      const refundRes = await fetch(`https://api.chapa.co/v1/refund/${tx_ref}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${chapaSecretKey}`,
        },
        body: new URLSearchParams({
          reason,
          amount: amount?.toString() || "", // refund full amount if not provided
        }),
      });

      const result = await refundRes.json();

      if (
        result.message 
        // === "Refunds can only be processed in live mode" ||
        // result.message?.toLowerCase().includes("refund")
      ) {
        await ad.save();
        return new Response(JSON.stringify({ message: "Ad rejected and refund initiated" }), { status: 200 });
      } else {
        return new Response(
          JSON.stringify({ error: "Ad rejected, but refund failed", details: result }),
          { status: 500 }
        );
      }
    } catch (err) {
      return new Response(JSON.stringify({ error: "Refund API error", details: err.message }), {
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
};
