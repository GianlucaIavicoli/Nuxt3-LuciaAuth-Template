import { TimeSpan, createDate } from "oslo";
import { generateIdFromEntropySize } from "lucia";
import { PrismaClient } from "@prisma/client";
import { sendResetPasswordValidationSchema } from "~/validations/auth";
import { MailtrapClient } from "mailtrap";

const prisma = new PrismaClient();

async function createEmailVerificationLink(
  userId: string,
  email: string,
): Promise<string> {
  // optionally invalidate all existing tokens
  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId: userId,
    },
  });

  const token = generateIdFromEntropySize(25); // 40 characters long
  const expiresAt = createDate(new TimeSpan(2, "h")); // Expires in 2 hours

  await prisma.emailVerificationToken.create({
    data: {
      token,
      userId,
      email,
      expiresAt, // Expires in 2 hours
    },
  });

  const config = useRuntimeConfig();
  const origin = config.origin;
  const verificationLink = `${origin}/auth/email-verification/${token}`;

  return verificationLink;
}

async function sendVerificationEmail(
  username: string,
  email: string,
  verificationLink: string,
) {
  const config = useRuntimeConfig();
  const mailtrapEndpoint = config.mailtrapEndpoint;
  const mailtrapSender = config.mailtrapSender;
  const mailtrapPassword = config.mailtrapPassword;
  const mailtrapTemplateUuidVerifyEmail =
    config.mailtrapTemplateUuidVerifyEmail;

  const companyName = config.companyName;
  const companySupportEmail = config.companySupportEmail;

  const client = new MailtrapClient({
    token: mailtrapPassword,
    endpoint: mailtrapEndpoint,
  });

  const emailSent = await client.send({
    from: { name: companyName, email: mailtrapSender },
    to: [{ email }],
    template_uuid: mailtrapTemplateUuidVerifyEmail,
    template_variables: {
      username,
      verificationLink,
      companySupportEmail,
      companyName,
    },
  });
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { email } = body;

  // Check if email already exists
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  // If user exists, create a password reset token and send the email
  if (user) {
    // Generate the email verification link
    const verificationLink = await createEmailVerificationLink(
      user.id,
      user.email,
    );
    // Send the email
    await sendVerificationEmail(user.username, user.email, verificationLink);
  }

  return {
    ok: true,
  };
});
