import { generateState } from "arctic";

export default defineEventHandler(async (event) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["user:email"],
  });
  const maxAge = 60 * 60 * 24 * 30; // 1 month in seconds

  setCookie(event, "github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: maxAge,
    sameSite: "lax",
  });
  return sendRedirect(event, url.toString());
});
