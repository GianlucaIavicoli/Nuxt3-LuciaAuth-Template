import { generateState } from "arctic";

import { generateCodeVerifier } from "arctic";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });
  const maxAge = 60 * 60 * 24 * 30; // 1 month in seconds

  setCookie(event, "google_oauth_state", state, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: maxAge,
    sameSite: "lax",
  });

  setCookie(event, "codeVerifier", codeVerifier, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: maxAge,
    sameSite: "lax",
  });
  return sendRedirect(event, url.toString());
});
