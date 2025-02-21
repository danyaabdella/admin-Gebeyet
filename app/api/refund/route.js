import Order from '../../models/Order';
import { isAdmin } from '../../utils/functions';

export async function POST(req) {
    try {
      await isAdmin();

      const { tx_ref, amount, reason } = await req.json();
  
      if (!tx_ref || !reason) {
        return new Response(
          JSON.stringify({ error: "Transaction reference and reason are required." }),
          { status: 400 }
        );
      }
  
      const chapaSecretKey = process.env.CHAPA_SECRET_KEY; 
  
      const response = await fetch(`https://api.chapa.co/v1/refund/${tx_ref}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${chapaSecretKey}`,
        },
        body: new URLSearchParams({
          reason: reason,
          amount: amount || "", // If not provided, full amount is refunded
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const order = await Order.findById(_id);
        order.paymentStatus = "Refunded";
        await order.save();

        return new Response(JSON.stringify(result), { status: 200 });
      } else {
        return new Response(JSON.stringify(result), { status: 400 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  