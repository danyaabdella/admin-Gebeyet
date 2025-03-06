import NextAuth from 'next-auth';
import { options } from './options';
import { getServerSession } from 'next-auth';
import Admin from '@/models/Admin';
import SuperAdmin from '@/models/SuperAdmin';
import { connectToDB } from '../../../../utils/functions';

const handler = NextAuth(options)

export { handler as GET, handler as POST }


export async function role() {
  await connectToDB();
    const session = await getServerSession(options);

    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }

    let userInfo = await Admin.findOne({email: userEmail})
    if (!userInfo) {
        userInfo = await SuperAdmin.findOne({email: userEmail})
    }
    if(!userInfo) {
      return false;
    }
  
    return userInfo.role;
  }

  