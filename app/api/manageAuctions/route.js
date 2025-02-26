
import { MongoClient } from 'mongodb';

    export async function PUT(req) {
        try {
            const user = role();
            if(!user){
                return new Response(JSON.stringify({message: "unauthorized"}),
                {status: 401}
            );      
            }
            const client = await MongoClient.connect("MONGO_URL", { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db("marketplace");
            const auctionCollection = db.collection("auctions");

            const {auctionId, status} = await req.json();
            
            const auction = await auctionCollection.findOne({ id:auctionId});
            if (!auction) return new Response (JSON.stringify({message: "no auction with specified id"}));
            auction.status = status;
            await auction.save();
            return new Response(JSON.stringify({message: "auction status updated"}));
        } catch (error) {
            console.error("Error updating auction:", error.message);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
        finally {
            await client.close();
        }
    }