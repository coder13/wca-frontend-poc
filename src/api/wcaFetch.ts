export const API_URL = "http://localhost:3000/api/v0";

export const wcaFetch = async <T>(url: string, token?: string) => {
  const res = await fetch(API_URL + url, {
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },
  });
  return res.json() as T;
};
