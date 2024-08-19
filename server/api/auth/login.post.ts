import { verify } from "@node-rs/argon2";
import { PrismaClient } from "@prisma/client";
import { loginValidationSchema } from "~/validations/auth";

const prisma = new PrismaClient();

export default eventHandler(async (event) => {
  // Parse and validate the request body using the schema
  const body = await readBody(event);
  const validatedData = await loginValidationSchema.parse(body);

  // Check for validation errors
  if (validatedData.errors.length > 0) {
    let newErrors: Record<string, string> = {};
    validatedData.errors.forEach((error: any) => {
      newErrors[error.path] = error.errors[0];
    });
    return {
      statusCode: 400,
      message: "Validation failed",
      data: newErrors,
    };
  }

  // Get the username, email, and password from the validated data
  const { email, password } = validatedData.value;

  const existingUser = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (!existingUser) {
    throw createError({
      message: "Email not registered",
      statusCode: 400,
      data: {
        email: "Email not registered",
      },
    });
  }

  const validPassword = await verify(existingUser.password, password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });

  if (!validPassword) {
    throw createError({
      message: "Incorrect password",
      statusCode: 400,
      data: {
        password: "Incorrect password",
      },
    });
  }

  const session = await lucia.createSession(existingUser.id, {});
  appendHeader(
    event,
    "Set-Cookie",
    lucia.createSessionCookie(session.id).serialize(),
  );
});
