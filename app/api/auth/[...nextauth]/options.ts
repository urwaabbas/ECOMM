import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await dbConnect();

        const normalizedEmail = credentials.email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
          throw new Error("No user found with this email");
        }

        if (!user.passwordHash) {
          throw new Error(
            "This account uses Google login. Please sign in with Google.",
          );
        }

        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

        if (!isPasswordMatch) {
          throw new Error("Invalid password");
        }

        if (!user.isVerified) {
          throw new Error(
            "Please verify your email before logging in. Check your inbox.",
          );
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image || null,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          await dbConnect();

          const normalizedEmail = user.email!.toLowerCase();
          const existingUser = await User.findOne({ email: normalizedEmail });

          if (existingUser) {
            if (!existingUser.googleId) {
              existingUser.googleId = profile?.sub;
              existingUser.image = user.image || existingUser.image;
              existingUser.isVerified = true;
              await existingUser.save();
            }
            user.id = existingUser._id.toString();
            (user as any).role = existingUser.role;
            (user as any).image = existingUser.image;
          } else {
            const newUser = await User.create({
              name: user.name,
              email: normalizedEmail,
              googleId: profile?.sub,
              image: user.image,
              authProvider: "google",
              isVerified: true,
              role: "user",
            });
            user.id = newUser._id.toString();
            (user as any).role = newUser.role;
            (user as any).image = newUser.image;
          }

          return true;
        } catch (error: any) {
          console.error("Google signIn error:", error?.message);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.image = (user as any).image;
      }
      if (account?.provider === "google") {
        token.provider = "google";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).image = token.image;
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};