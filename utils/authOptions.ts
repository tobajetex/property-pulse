import { connectDB } from "@/config/database";
import User from "@/models/User";
import GoogleProvider from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    // Called when user signs in
    async signIn({ profile }) {
      await connectDB();

      // Check if user exists
      const userExists = await User.findOne({ email: profile?.email });

      // If not, create a new user
      if (!userExists && profile?.email && profile?.name) {
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email,
          username,
          image: profile.image,
        });
      }

      return true;
    },

    // Called when session is created
    async session({ session }) {
      if (!session.user?.email) return session;

      await connectDB();

      const user = await User.findOne({ email: session.user.email });

      if (user) {
        session.user.id = user._id.toString();
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};
