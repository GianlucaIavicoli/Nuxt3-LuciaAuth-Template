import { isWithinExpirationDate } from "oslo";
import { hash } from "@node-rs/argon2";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Get the token from the params
  const verificationToken = event.context.params?.token;

  const token = await prisma.emailVerificationToken.findFirst({
    where: {
      token: verificationToken,
    },
    include: {
      user: true,
    },
  });

  // Check if the token is valid and not expired
  if (!token || !isWithinExpirationDate(token.expiresAt)) {
    throw createError({
      statusCode: 400,
      message: "Token is invalid or expired",
      data: {
        token: "Token is invalid or expired",
      },
    });
  }

  // Get the user ID from the token
  const userId = token.user.id;

  // Start a transaction to update the user.emailVerified and delete the token
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
    }),
    prisma.emailVerificationToken.deleteMany({
      where: {
        token: verificationToken,
      },
    }),
  ]);

  // Invalidate the user's existing sessions and create a new session
  await lucia.invalidateUserSessions(userId);
  const session = await lucia.createSession(userId, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  return {
    ok: true,
  };
});
