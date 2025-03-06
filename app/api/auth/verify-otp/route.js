import { verifyOtp } from '../../../../utils/sendOtp';
import { getServerSession } from 'next-auth';
import { options } from '../[...nextauth]/options';

export async function POST(req) {
    const { email, otp } = await req.json();
    try {
        await verifyOtp(email, otp);
        const session = await getServerSession(options);
        return Response.json({ message: 'Login successful', session });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 400 });
    }
}
