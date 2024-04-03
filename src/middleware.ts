import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware() {
  console.log(6);

  // fetch the user
  const cookieStore = cookies();
  const cookie = cookieStore.get("_WcaOnRails_session");

  const res = await fetch("http://localhost:3000/api/v0/users/token", {
    headers: {
      "Content-Type": "application/json",
      ...(cookie && {
        Cookie: `_WcaOnRails_session=${encodeURIComponent(cookie.value || "")}`,
      }),
    },
  });

  const setCookie = res.headers.getSetCookie()[0].split(";")[0].split("=")[1];
  console.log(21, setCookie);

  if (setCookie) {
    const response = NextResponse.next();
    response.cookies.set({
      name: "_WcaOnRails_session",
      value: setCookie,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  }
}

export const config = {
  matcher: "/",
};
