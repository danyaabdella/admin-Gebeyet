import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admin";
import SuperAdmin from "@/models/SuperAdmin";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await mongoose.connect(process.env.MONGO_URL);

        // Try to find the user in the Admin schema
        let user = await Admin.findOne({ email: credentials.email });

        // If not found, check in the SuperAdmin schema
        if (!user) {
          user = await SuperAdmin.findOne({ email: credentials.email });
        }

        // If no user is found in either schema
        if (!user) {
          throw new Error("No user found with this email");
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user data (including role from the schema)
        return { id: user._id, email: user.email, role: user.role || 'admin' };  // Returning role along with user data
      },
    }),
  ],
  session: {
    jwt: true, // Use JWT for session management
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;  // Store role in JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.role = token.role;  // Attach role to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
