const CHAPA_SECRET_KEY = "CHASECK_TEST-RUwJBcglJUtks3uEyM5mRQHYLqtbCmQE"

export async function GET() {
    try {
        // Load the API key from environment variables
        const API_KEY = process.env.CHAPA_SECRET_KEY; // Get from environment variables

        if (!API_KEY) {
            throw new Error("CHAPA_SECRET_KEY is not defined in environment variables.");
        }

        // Log the API Key (For debugging purposes, remove this in production!)
        console.log("Authorization Header:", `Bearer ${API_KEY}`);

        // Fetch the bank details from Chapa API
        const response = await fetch("https://api.chapa.co/v1/banks", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        // Log the response for debugging
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);

        if (!response.ok) {
            throw new Error(`Failed to fetch banks: ${response.statusText}`);
        }

        // Parse the response data
        const data = await response.json();
        console.log("Bank List:", data); // Log the bank list

        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.error("Error fetching banks:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch banks", details: error.message }), { status: 500 });
    }
}

