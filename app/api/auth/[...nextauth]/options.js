import CredentialsProvider from 'next-auth/providers/credentials';
import mongoose from 'mongoose';
import argon2 from 'argon2';
import Admin from '@/models/Admin';
import SuperAdmin from '@/models/SuperAdmin';

export const options = {
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email:', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password:', type: 'password', placeholder: 'your-secure-password' },
        otp: { label: 'OTP:', type: 'text', placeholder: '123456' },
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URL);

        let user = await Admin.findOne({ email: credentials?.email }) || await SuperAdmin.findOne({ email: credentials?.email });

        if (!user) throw new Error('Invalid email or password');

        const isPasswordValid = await argon2.verify(user.password, credentials.password);
        if (!isPasswordValid) throw new Error('Invalid email or password');

        return { id: user._id, email: user.email, role: user.role || null };
      },
    }),
  ],
};
