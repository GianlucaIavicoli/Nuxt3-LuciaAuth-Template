import { generateIdFromEntropySize } from "lucia";
import { OAuth2RequestError } from "arctic";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code?.toString() ?? null;
  const state = query.state?.toString() ?? null;
  const storedState = getCookie(event, "github_oauth_state") ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    // Fetch the user's email from GitHub
    const githubEmailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      },
    );

    const githubUser: GitHubUser = await githubUserResponse.json();

    // Get the primary email from the GitHub user
    const githubUserEmails = await githubEmailResponse.json();
    const primaryEmail = githubUserEmails.find((email) => email.primary);

    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: primaryEmail.email.toLowerCase(),
      },
      include: {
        github: true,
      },
    });

    // If the user has already an account, but not linked to GitHub, link the accounts
    if (existingUser && !existingUser.github) {
      await prisma.gitHubUser.create({
        data: {
          id: generateIdFromEntropySize(10),
          githubId: githubUser.id,
          userId: existingUser.id,
        },
      });
    }

    // If the user has already an account, create a session and redirect
    if (existingUser) {
      // User already exists, create a session and redirect
      const session = await lucia.createSession(existingUser.id, {});
      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      );
      return sendRedirect(event, "/");
    }

    // If GitHubUser does not exist, create a new user and GitHubUser
    const userId = generateIdFromEntropySize(10);
    const randomNumber = Math.floor(Math.random() * 100000000);
    const username = `${githubUser.login.toLowerCase()}${randomNumber}`;
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        avatarUrl: githubUser.avatar_url,
        displayName: githubUser.name ? githubUser.name : githubUser.login,
        username: username,
        email: primaryEmail.email.toLowerCase(),
      },
    });
    await prisma.gitHubUser.create({
      data: {
        id: generateIdFromEntropySize(10),
        githubId: githubUser.id,
        userId: newUser.id,
      },
    });

    // Create a session for the new user and redirect
    const session = await lucia.createSession(newUser.id, {});
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    );
    return sendRedirect(event, "/");
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      throw createError({
        status: 400,
        message: "Invalid code",
      });
    }
    throw createError({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

interface GitHubUser {
  id: string;
  login: string;
  name: string | null;
  avatar_url: string;
}
