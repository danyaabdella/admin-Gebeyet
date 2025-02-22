import { v4 as uuidv4 } from 'uuid';
import Order from '../../models/Order';
import { isAdmin } from '../../utils/functions';
import { NextResponse } from 'next/server';

const CHAPA_SECRET_KEY = "CHASECK_TEST-s6oBbGS04bRkcXLT7P6x2do2EKcCXfJ6";

export async function POST(req) {
    try {
        await isAdmin();
        const body = await req.json();

        // Extract required fields from the request body
        const { _id, account_name, account_number, amount, currency, bank_code } = body;

        // Generate a unique reference of 20 characters
        const reference = `mr_tx_${uuidv4().split('-')[0]}`;  // Get the first part of UUID and prepend

        // Ensure reference is 20 characters long
        const referenceFinal = reference.substring(0, 20);

        // Validate required fields
        if (!account_name || !account_number || !amount || !currency || !bank_code) {
            return NextResponse.json(
                { message: "All fields (account_name, account_number, amount, currency, bank_code) are required" },
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
                reference: referenceFinal,  // Use 20-character reference
                bank_code
            })
        });

        const result = await response.json();

        // Handle Chapa's response
        if (result.status === "success") {
            const order = await Order.findById(_id);
            order.merchantDetail.merchantRefernce = referenceFinal;
            order.paymentStatus = "Paid To Merchant";
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
