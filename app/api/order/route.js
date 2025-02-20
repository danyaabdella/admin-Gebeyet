import Order from "@/app/models/Order";
import { isAdmin } from "@/app/utils/functions";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        await isAdmin();

        // Initialize filter object
        let filter = {};

        // Extract query parameters
        const productId = searchParams.get('productId');
        const merchantId = searchParams.get('merchantId');
        const customerId = searchParams.get('customerId');
        const status = searchParams.get('status');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const merchantEmail = searchParams.get('merchantEmail');
        const customerEmail = searchParams.get('customerEmail');
        const state = searchParams.get('state');
        const city = searchParams.get('city');

        // Apply filters
        if (productId) filter["products.productId"] = new mongoose.Types.ObjectId(productId);
        if (merchantId) filter["merchantDetail.merchantId"] = new mongoose.Types.ObjectId(merchantId);
        if (customerId) filter["customerDetail.customerId"] = new mongoose.Types.ObjectId(customerId);
        if (status) filter.status = status;

        // Apply price range filter
        if (minPrice || maxPrice) {
            filter.totalPrice = {};
            if (minPrice) filter.totalPrice.$gte = Number(minPrice);
            if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
        }

        // Apply date range filter
        if (startDate || endDate) {
            filter.orderDate = {};
            if (startDate) filter.orderDate.$gte = new Date(startDate);
            if (endDate) filter.orderDate.$lte = new Date(endDate);
        }

        // Apply merchant email filter
        if (merchantEmail) filter["merchantDetail.merchantEmail"] = merchantEmail;

        // Apply customer email filter
        if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;

        // Apply state and city filters
        if (state) filter["customerDetail.address.state"] = state;
        if (city) filter["customerDetail.address.city"] = city;

        console.log("Filters: ", filter);

        // Fetch orders based on the filter
        const orders = await Order.find(filter).populate('customerDetail.customerId').populate('merchantDetail.merchantId').populate('products.productId');
        console.log("Orders: ", orders);

        return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await isAdmin(); // Ensure only admins can perform this action

        const body = await req.json();
        const { _id, status } = body;

        // Validate input
        if (!_id) {
            return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
        }

        // Fetch the order
        const order = await Order.findById(_id);

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Check if the status is being updated to "Refunded"
        if (status === "Refunded") {
            order.status = "Refunded"; 
            await order.save(); // Save the updated order
            return NextResponse.json({ message: "Order status updated to Refunded", order }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
        }
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
