
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Define which routes require authentication
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout/:path*",
  ],
};