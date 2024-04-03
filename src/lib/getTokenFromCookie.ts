import { API_URL } from "@/api/wcaFetch";
import { cookies } from "next/headers";

export const getTokenFromCookie = async () => {
  const cookieStore = cookies();
  const cookie = cookieStore.get("_WcaOnRails_session");

  const res = await fetch(`${API_URL}/users/me/token`, {
    headers: {
      "Content-Type": "application/json",
      ...(cookie && {
        Cookie: `_WcaOnRails_session=${encodeURIComponent(cookie.value || "")}`,
      }),
    },
  });

  if (!res.ok) {
    return undefined;
  }

  const authTokenHeader = res.headers.get("Authorization");

  if (!authTokenHeader) {
    return undefined;
  }

  const token = authTokenHeader.split(" ")[1];
  return token;
};
