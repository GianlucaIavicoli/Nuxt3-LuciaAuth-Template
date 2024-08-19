import { TimeSpan, createDate } from "oslo";
import { generateIdFromEntropySize } from "lucia";
import { PrismaClient } from "@prisma/client";
import { sendResetPasswordValidationSchema } from "~/validations/auth";
import { MailtrapClient } from "mailtrap";

const prisma = new PrismaClient();

async function createPasswordResetLink(userId: string): Promise<string> {
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: userId,
    },
  });
  const token = generateIdFromEntropySize(25); // 40 character
  const expiresAt = createDate(new TimeSpan(2, "h")); // 2 hours from now

  await prisma.passwordResetToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  const config = useRuntimeConfig();
  const origin = config.origin;
  const verificationLink = `${origin}/auth/reset-password/${token}`;

  return verificationLink;
}

async function sendPasswordResetEmail(
  username: string,
  email: string,
  verificationLink: string,
) {
  const config = useRuntimeConfig();
  const mailtrapEndpoint = config.mailtrapEndpoint;
  const mailtrapSender = config.mailtrapSender;
  const mailtrapPassword = config.mailtrapPassword;
  const mailtrapTemplateUuidResetPassword =
    config.mailtrapTemplateUuidResetPassword;

  const companyName = config.companyName;
  const companySupportEmail = config.companySupportEmail;

  const client = new MailtrapClient({
    token: mailtrapPassword,
    endpoint: mailtrapEndpoint,
  });

  const emailSent = await client.send({
    from: { name: companyName, email: mailtrapSender },
    to: [{ email }],
    template_uuid: mailtrapTemplateUuidResetPassword,
    template_variables: {
      username,
      verificationLink,
      companySupportEmail,
      companyName,
    },
  });
}

export default defineEventHandler(async (event) => {
  // Parse and validate the request body using the schema
  const body = await readBody(event);
  const validatedData = await sendResetPasswordValidationSchema.parse(body);

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

  // Get the email from the validated data
  const { email } = validatedData.value;

  // Check if email already exists
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  // If user exists, create a password reset token and send the email
  if (user) {
    const verificationLink = await createPasswordResetLink(user.id);
    await sendPasswordResetEmail(user.username, email, verificationLink);
  }
});
