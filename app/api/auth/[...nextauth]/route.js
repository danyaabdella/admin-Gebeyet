import NextAuth from 'next-auth';
import { options } from './options';
import { getServerSession } from 'next-auth';
import Admin from '@/models/Admin';
import SuperAdmin from '@/models/SuperAdmin';
import { connectToDB } from '../../../../utils/functions';


const handler = NextAuth(options);
export { handler as GET, handler as POST };

// Function to get user role
export async function role(req) {
  await connectToDB();
  const session = await getServerSession(req, options);

  if (!session?.user?.email) {
    return null;
  }

  const user = await Admin.findOne({ email: session.user.email }) || 
               await SuperAdmin.findOne({ email: session.user.email });

  return user?.role || null;
}

  