export async function POST(req) {
    try {
      const { title, currency, bulk_data } = await req.json();
  
      if (!title || !currency || !bulk_data || bulk_data.length === 0) {
        return new Response(
          JSON.stringify({ error: "Title, currency, and bulk_data are required." }),
          { status: 400 }
        );
      }
  
      if (bulk_data.length > 100) {
        return new Response(
          JSON.stringify({ error: "Bulk data cannot exceed 100 transactions per batch." }),
          { status: 400 }
        );
      }
  
      const chapaSecretKey = process.env.CHAPA_SECRET_KEY; // Store this in .env
  
      const response = await fetch("https://api.chapa.co/v1/bulk-transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${chapaSecretKey}`,
        },
        body: JSON.stringify({
          title,
          currency,
          bulk_data,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        return new Response(JSON.stringify(result), { status: 200 });
      } else {
        return new Response(JSON.stringify(result), { status: 400 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

  export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const batch_id = searchParams.get("batch_id");
  
      if (!batch_id) {
        return new Response(JSON.stringify({ error: "Batch ID is required." }), { status: 400 });
      }
  
      const chapaSecretKey = process.env.CHAPA_SECRET_KEY;
  
      const response = await fetch(`https://api.chapa.co/v1/transfers?batch_id=${batch_id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${chapaSecretKey}`,
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        return new Response(JSON.stringify(result), { status: 200 });
      } else {
        return new Response(JSON.stringify(result), { status: 400 });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }
  