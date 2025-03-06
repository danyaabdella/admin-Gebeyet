import { MongoClient, ObjectId } from 'mongodb';
import { role } from '../auth/[...nextauth]/route';

    export async function PUT(req) {
        try {
            const user = await role();
            if(!user){
                return new Response(JSON.stringify({message: "unauthorized"}),
                {status: 401}
            );      
            }
            const client = await MongoClient.connect("MONGO_URL", { useNewUrlParser: true, useUnifiedTopology: true });
            const db = client.db("marketplace");
            const auctionCollection = db.collection("auctions");

            const {auctionId, adminApproval} = await req.json();
            
            const auction = await auctionCollection.findOne({ _id: new ObjectId(auctionId) });
            if (!auction) {
                return new Response(JSON.stringify({ message: "No auction with specified ID" }), { status: 404 });
            }
    
            const status = adminApproval === "approved" ? "active" : "cancelled";
    
            await auctionCollection.updateOne(
                { _id: new ObjectId(auctionId) },
                { $set: { adminApproval, status } }
            );
            return new Response(JSON.stringify({message: "auction status updated"}));
        } catch (error) {
            console.error("Error updating auction:", error.message);
            return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
        }
        finally {
            if (client) await client.close();
        }
    }