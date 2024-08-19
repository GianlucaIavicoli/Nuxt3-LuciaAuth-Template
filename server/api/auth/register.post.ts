import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { registerValidationSchema } from "~/validations/auth";

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
  // Parse and validate the request body using the schema
  const body = await readBody(event);
  const validatedData = await registerValidationSchema.parse(body);

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

  // Get the username, email, and password from the validated data
  const { username, email, password } = validatedData.value;

  // Check if username already exists
  const usernameExists = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (usernameExists) {
    throw createError({
      message: "Username already registered",
      statusCode: 400,
      data: {
        username: "Username already registered",
      },
    });
  }

  // Check if email already exists
  const emailExists = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (emailExists) {
    throw createError({
      message: "Email already registered",
      statusCode: 400,
      data: {
        email: "Email already registered",
      },
    });
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  const userId = generateIdFromEntropySize(10); // 16 characters long

  // Create a new user
  const user = await prisma.user.create({
    data: {
      id: userId,
      username: username.toLowerCase(),
      password: passwordHash,
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    throw createError({
      message: "Failed to create user",
      statusCode: 500,
    });
  }

  const session = await lucia.createSession(user.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );

  return {
    ok: true,
  }
});
