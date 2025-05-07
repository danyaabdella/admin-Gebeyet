import Order from '@/models/Order';
import Product from '@/models/Product';
import { isAdminOrSuperAdmin } from '@/utils/functions';

const CHAPA_SECRET_KEY = "CHASECK_TEST-PIpkm0VxDsgQJcS6nXB3K9Ttx98AzUZ8"

export async function POST(req) {
    try {
        await isAdminOrSuperAdmin();

        const { tx_ref, reason, amount } = await req.json();
        console.log("Data from client: ", tx_ref, reason);

        if (!tx_ref || !reason) {
            return new Response(
                JSON.stringify({ error: "Transaction reference and reason are required." }),
                { status: 400 }
            );
        }

        const chapaSecretKey = CHAPA_SECRET_KEY;

        const response = await fetch(`https://api.chapa.co/v1/refund/${tx_ref}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${chapaSecretKey}`,
            },
            body: new URLSearchParams({
                reason: reason,
                amount: amount,
            }),
        });
        const result = await response.json();
        console.log("Result: ", result);

        // Fetch the order using transactionRef
        const order = await Order.findOne({ transactionRef: tx_ref });
        if (!order) {
            return new Response(
                JSON.stringify({ error: "Order not found" }),
                { status: 404 }
            );
        }

        // Handle test mode refund
        if (result.message === "Refunds can only be processed in live mode") {
            // Update product quantities for refund
            if (order.products && order.products.length > 0) {
                for (const orderProduct of order.products) {
                    const { productId, quantity } = orderProduct;

                    // Fetch the product
                    const product = await Product.findById(productId);
                    if (!product) {
                        console.error(`Product with ID ${productId} not found during refund`);
                        continue; // Skip if product not found, log error
                    }

                    // Add back the quantity and decrease soldQuantity
                    product.quantity += quantity;
                    product.soldQuantity -= quantity;

                    // Ensure soldQuantity doesn't go negative
                    if (product.soldQuantity < 0) product.soldQuantity = 0;

                    await product.save();
                }
            }

            // Update order status
            order.paymentStatus = "Refunded";
            order.refundReason = reason; 
            await order.save();

            return new Response(
                JSON.stringify({ message: "Refund processed in test mode", order }),
                { status: 200 }
            );
        }

        // Handle live mode refund success
        if (response.ok) {
            // Update product quantities for refund
            if (order.products && order.products.length > 0) {
                for (const orderProduct of order.products) {
                    const { productId, quantity } = orderProduct;

                    // Fetch the product
                    const product = await Product.findById(productId);
                    if (!product) {
                        console.error(`Product with ID ${productId} not found during refund`);
                        continue; // Skip if product not found, log error
                    }

                    // Add back the quantity and decrease soldQuantity
                    product.quantity += quantity;
                    product.soldQuantity -= quantity;

                    // Ensure soldQuantity doesn't go negative
                    if (product.soldQuantity < 0) product.soldQuantity = 0;

                    await product.save();
                }
            }

            // Update order status
            order.paymentStatus = "Refunded";
            order.refundReason = reason; // Optionally store the refund reason
            await order.save();

            return new Response(JSON.stringify(result), { status: 200 });
        } else {
            return new Response(JSON.stringify(result), { status: 400 });
        }
    } catch (error) {
        console.error("Error processing refund:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}