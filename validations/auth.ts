import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;

  confirmPassword: string;
}

export const registerValidationSchema = toTypedSchema(
  z
    .object({
      username: z
        .string({ message: "The username field is required" })
        .min(5, { message: "Username must be at least 5 characters long" }),
      email: z
        .string({ message: "The email field is required" })
        .email({ message: "Invalid email address" }),
      password: z
        .string({ message: "The password field is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must not exceed 16 characters" })
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmPassword: z.string({
        message: "The confirm password field is required",
      }),
      privacyPolicy: z
        .boolean({ message: "You must accept the privacy policy" })
        .refine((value) => value === true, {
          message: "You must accept the privacy policy",
        }),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      },
    ),
);

export interface LoginFormData {
  email: string;
  password: string;
}

export const loginValidationSchema = toTypedSchema(
  z.object({
    email: z
      .string({ message: "The email field is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string({ message: "The password field is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(16, { message: "Password must not exceed 16 characters" }),
  }),
);

export interface SendResetPasswordFormData {
  email: string;
}

export const sendResetPasswordValidationSchema = toTypedSchema(
  z.object({
    email: z
      .string({ message: "The email field is required" })
      .email({ message: "Invalid email address" }),
  }),
);

export interface ConfirmResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export const confirmResetPasswordValidationSchema = toTypedSchema(
  z
    .object({
      password: z
        .string({ message: "The password field is required" })
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(16, { message: "Password must not exceed 16 characters" })
        .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      confirmPassword: z.string({
        message: "The confirm password field is required",
      }),
    })
    .refine(
      (values) => {
        return values.password === values.confirmPassword;
      },
      {
        message: "Passwords do not match",
      },
    ),
);
