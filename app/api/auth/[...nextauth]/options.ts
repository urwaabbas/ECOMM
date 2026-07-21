import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
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

        const storedPassword =
          (user as any).password ?? (user as any).passwordHash ?? "";
        let isPasswordCorrect = false;

        if (
          typeof storedPassword === "string" &&
          storedPassword.startsWith("$2")
        ) {
          isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            storedPassword,
          );
        } else if (typeof storedPassword === "string") {
          isPasswordCorrect = credentials.password === storedPassword;

          if (isPasswordCorrect) {
            const hashedPassword = await bcrypt.hash(credentials.password, 10);
            await User.updateOne(
              { _id: (user as any)._id },
              { password: hashedPassword, passwordHash: hashedPassword },
            );
          }
        }

        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
