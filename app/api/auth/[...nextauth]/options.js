import CredentialsProvider from 'next-auth/providers/credentials';
import argon2 from 'argon2';
import Admin from '../../../models/Admin';
import SuperAdmin from '../../../models/SuperAdmin';
import { connectToDB } from '../../../utils/functions';

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password:', type: 'password', placeholder: 'your-secure-password' },
      },
      async authorize(credentials) {
        await connectToDB();

        let admin = await Admin.findOne({ email: credentials?.email }) || 
                    await SuperAdmin.findOne({ email: credentials?.email });
                    
        if (!admin || !(await argon2.verify(admin.password, credentials.password))) {
          throw new Error('Invalid email or password');
        }
        console.log('email', admin.email);
        return { id: admin._id.toString(), email: admin.email, role: admin.role || 'user' };
      },
    }),
  ],
};