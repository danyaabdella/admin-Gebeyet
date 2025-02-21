import Order from '../../models/Order';
import { isAdmin } from '../../utils/functions';
import { NextResponse } from 'next/server';

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY; // Store your Chapa secret key in environment variables

export async function POST(req) {
    try {
        await isAdmin();
        const body = await req.json();

        // Extract required fields from the request body
        const { _id, account_name, account_number, amount, currency, reference, bank_code } = body;

        // Validate required fields
        if (!account_name || !account_number || !amount || !currency || !reference || !bank_code) {
            return NextResponse.json(
                { message: "All fields (account_name, account_number, amount, currency, reference, bank_code) are required" },
                { status: 400 }
            );
        }

        // Make a request to Chapa's Transfer endpoint
        const response = await fetch('https://api.chapa.co/v1/transfers', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                account_name,
                account_number,
                amount,
                currency,
                reference,
                bank_code
            })
        });

        const result = await response.json();

        // Handle Chapa's response
        if (result.status === "success") {
            const order = await Order.findById(_id);
            order.merchantDetail.merchantRefernce = reference;
            order.status = "Paid To Merchant";
            await order.save();

            return NextResponse.json({ message: "Transfer Queued Successfully", data: result.data }, { status: 200 });
        } else {
            return NextResponse.json({ message: result.message, status: "failed", data: null }, { status: 400 });
        }
    } catch (error) {
        console.error("Error initiating transfer:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}