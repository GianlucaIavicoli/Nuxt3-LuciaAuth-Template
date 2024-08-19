import { isWithinExpirationDate } from "oslo";
import { hash } from "@node-rs/argon2";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { PrismaClient } from "@prisma/client";
import { confirmResetPasswordValidationSchema } from "~/validations/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  // Parse and validate the request body using the schema
  const body = await readBody(event);
  const validatedData = await confirmResetPasswordValidationSchema.parse(body);

  // Check for validation errors
  if (validatedData.errors.length > 0) {
    let newErrors: Record<string, string> = {};
    validatedData.errors.forEach((error: any) => {
      newErrors[error.path] = error.errors[0];
    });
    throw createError({
      statusCode: 400,
      message: "Validation failed",
      data: newErrors,
    });
  }

  // Get the password from the validated data
  const { password } = validatedData.value;

  // Get the token from the params
  const verificationToken = event.context.params?.token;
  const token = await prisma.passwordResetToken.findFirst({
    where: {
      token: verificationToken,
    },
  });
  // Get the user ID from the token
  const userId = token?.userId;

  if (token) {
    await prisma.passwordResetToken.delete({
      where: {
        token: verificationToken,
      },
    });
  }

  if (!token || !isWithinExpirationDate(token.expiresAt)) {
    throw createError({
      statusCode: 400,
      message: "Token is invalid or expired",
      data: {
        token: "Token is invalid or expired",
      },
    });
  }

  const passwordHash = await hash(password, {
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 2,
    outputLen: 32,
  });

  const transaction = await prisma.$transaction([
    prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      },
    }),
    prisma.session.deleteMany({
      where: {
        userId: userId,
      },
    }),
  ]);

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
