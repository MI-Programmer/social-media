import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getUser } from "@/actions/user";

export const middleware = async (request: NextRequest) => {
  const data = await getUser();

  if (data.status === "error") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/profile", "/posts/:postId*"],
};
