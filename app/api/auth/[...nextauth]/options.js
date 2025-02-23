// import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import argon2 from 'argon2';  
import Admin from '../../../models/Admin';
import SuperAdmin from '../../../models/SuperAdmin';

export const options = {
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password:', type: 'password', placeholder: 'your-secure-password' },
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URL);

        // Check for Admin or SuperAdmin
        let admin = await Admin.findOne({ email: credentials?.email });

        if (!admin) {
          admin = await SuperAdmin.findOne({ email: credentials?.email });
        }

        if (!admin) {
          throw new Error('Invalid email or password'); // Corrected error throwing
        }

        const isPasswordValid = await argon2.verify(admin.password, credentials.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        // Return the user object with role
        return { id: admin._id, email: admin.email, role: admin.role || null }; // Corrected to use `admin`
      },
    }),
  ],
};
