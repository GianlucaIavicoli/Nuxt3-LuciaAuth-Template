import { generateIdFromEntropySize } from "lucia";
import { OAuth2RequestError } from "arctic";
import { PrismaClient } from "@prisma/client";
import { google } from "~/server/utils/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { state = null, code = null } = query;

  const codeVerifier = getCookie(event, "codeVerifier") ?? null;
  const storedState = getCookie(event, "google_oauth_state") ?? null;

  if (
    !code ||
    !codeVerifier ||
    !state ||
    !storedState ||
    state !== storedState
  ) {
    throw createError({
      status: 400,
      message: "Invalid state or code",
    });
  }

  try {
    const { accessToken, idToken } = await google.validateAuthorizationCode(
      code,
      codeVerifier,
    );

    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const googleUser: GoogleUser = await googleUserResponse.json();

    // Check if a user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: googleUser.email.toLowerCase(),
      },
      include: {
        google: true,
      }
    });

    // If the user has already an account, but not linked to Google, link the accounts
    if (existingUser && !existingUser.google) {
      await prisma.googleUser.create({
        data: {
          id: generateIdFromEntropySize(10),
          googleId: googleUser.id,
          userId: existingUser.id,
        },
      });
    }

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

    // If GoogleUser does not exist, create a new user and GoogleUser
    const userId = generateIdFromEntropySize(10);

    // Since we don't have a username from Google, we'll generate one
    const randomNumber = Math.floor(Math.random() * 100000000); // 8 random numbers
    const username = `${googleUser.given_name || googleUser.family_name}${randomNumber}`;

    const newUser = await prisma.user.create({
      data: {
        id: userId,
        avatarUrl: googleUser.picture,
        displayName: googleUser.name ? googleUser.name : googleUser.given_name,
        username: username.toLowerCase(),
        email: googleUser.email.toLowerCase(),
      },
    });
    await prisma.googleUser.create({
      data: {
        id: generateIdFromEntropySize(10),
        googleId: googleUser.id,
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
    return sendRedirect(event, "/protected");
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

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}
