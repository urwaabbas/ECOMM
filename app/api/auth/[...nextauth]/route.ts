// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "./options";


const handler = NextAuth(authOptions);

// Only export HTTP handlers!
export { handler as GET, handler as POST };