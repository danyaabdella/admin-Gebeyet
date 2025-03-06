import Admin from "@/models/Admin";
import { generateOtp, sendOtpEmail, storeOtp } from "../../../../utils/sendOtp"
import SuperAdmin from "@/models/SuperAdmin";
import { connectToDB } from "../../../../utils/functions";

export async function POST(req) {
    await connectToDB();
    const { email, password } = await req.json();
    let user = await Admin.findOne({ email }) || await SuperAdmin.findOne({ email });
    if (!user) return Response.json({ error: 'Invalid email' }, { status: 400 });
    
    const otp = generateOtp();
    await sendOtpEmail(email, otp);
    await storeOtp(email, otp);
    return Response.json({ message: 'OTP sent' });
}