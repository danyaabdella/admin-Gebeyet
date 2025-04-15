import Order from "@/models/Order";
import { isAdminOrSuperAdmin } from "@/utils/functions";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      await isAdminOrSuperAdmin();
  
      const id = searchParams.get('id');
  
      if (id) {
        const order = await Order.findById(id);
        if (!order) {
          return new Response(JSON.stringify({ success: false, message: "Order not found" }), { status: 404 });
        }
        return new Response(JSON.stringify({ success: true, order }), { status: 200 });
      } else {
        const orders = await Order.find();
        return new Response(JSON.stringify({ success: true, orders }), { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
    }
  }
  
export async function PUT(req) {
    try {
        await isAdminOrSuperAdmin(); 
        
        const body = await req.json();
        const { _id, paymentStatus } = body;

        // Validate input
        if (!_id) {
            return NextResponse.json({ error: "Order ID is required", status: "fail" }, { status: 400 });
        }

        if (![ "Refunded", "Paid To Merchant" ].includes(paymentStatus)) {
            return NextResponse.json({ error: "Invalid payment status", status: "fail" }, { status: 400 });
        }

        // Fetch the order
        const order = await Order.findById(_id);
        if (!order) {
            return NextResponse.json({ error: "Order not found", status: "fail" }, { status: 404 });
        }

        // Prevent updating if the order is already in the desired status
        if (order.paymentStatus === paymentStatus) {
            return NextResponse.json({ error: `Order is already marked as ${paymentStatus}`, status: "fail" }, { status: 400 });
        }

        // Update the payment status
        order.paymentStatus = paymentStatus;
        await order.save(); // Save the updated order

        return NextResponse.json({ message: `Order status updated to ${paymentStatus}`, order, status: "success" }, { status: 200 });
    } catch (error) {
        console.error("Error updating order:", error);
        return NextResponse.json({ error: "Internal Server Error", status: "fail" }, { status: 500 });
    }
}


// Initialize filter object
        // let filter = {};

        // // Extract query parameters
        // const productId = searchParams.get('productId');
        // const merchantId = searchParams.get('merchantId');
        // const customerId = searchParams.get('customerId');
        // const status = searchParams.get('status');
        // const minPrice = searchParams.get('minPrice');
        // const maxPrice = searchParams.get('maxPrice');
        // const startDate = searchParams.get('startDate');
        // const endDate = searchParams.get('endDate');
        // const merchantEmail = searchParams.get('merchantEmail');
        // const customerEmail = searchParams.get('customerEmail');
        // const state = searchParams.get('state');
        // const city = searchParams.get('city');

        // Apply filters
        // if (productId) filter["products.productId"] = new mongoose.Types.ObjectId(productId);
        // if (merchantId) filter["merchantDetail.merchantId"] = new mongoose.Types.ObjectId(merchantId);
        // if (customerId) filter["customerDetail.customerId"] = new mongoose.Types.ObjectId(customerId);
        // if (status) filter.status = status;

        // // Apply price range filter
        // if (minPrice || maxPrice) {
        //     filter.totalPrice = {};
        //     if (minPrice) filter.totalPrice.$gte = Number(minPrice);
        //     if (maxPrice) filter.totalPrice.$lte = Number(maxPrice);
        // }

        // // Apply date range filter
        // if (startDate || endDate) {
        //     filter.orderDate = {};
        //     if (startDate) filter.orderDate.$gte = new Date(startDate);
        //     if (endDate) filter.orderDate.$lte = new Date(endDate);
        // }

        // Apply merchant email filter
        // if (merchantEmail) filter["merchantDetail.merchantEmail"] = merchantEmail;

        // Apply customer email filter
        // if (customerEmail) filter["customerDetail.customerEmail"] = customerEmail;

        // // Apply state and city filters
        // if (state) filter["customerDetail.address.state"] = state;
        // if (city) filter["customerDetail.address.city"] = city;

        // console.log("Filters: ", filter);

        // Fetch orders based on the filter