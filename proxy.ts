import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    if (req.nextUrl.pathname.includes("/hub") && !req.nextauth.token?.user) {
      return NextResponse.rewrite(
        new URL(
          "/login/?message=Please log in first before proceeding.",
          req.url,
        ),
      );
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token?.user,
    },
  },
);

export const config = { matcher: ["/hub/:path*"] };
