import NextAuth from 'next-auth';
import { options } from './options';
import { getServerSession } from 'next-auth';
import Admin from '../../../models/Admin';
import SuperAdmin from '../../../models/SuperAdmin';

const handler = NextAuth(options)

export { handler as GET, handler as POST }


export async function role() {
    const session = await getServerSession(options);
    console.log("session: ", session);

    const userEmail = session?.user?.email;
    if (!userEmail) {
      return false;
    }
    console.log("email: ", userEmail);

    let userInfo = await Admin.findOne({email: userEmail})
    if (!userInfo) {
        userInfo = await SuperAdmin.findOne({email: userEmail})
    }
    if(!userInfo) {
      return false;
    }
  
    return userInfo.role;
  }

  