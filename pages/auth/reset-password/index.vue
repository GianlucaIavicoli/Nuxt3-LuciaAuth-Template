<script lang="ts" setup>
import { useForm, useField } from "vee-validate";
import { sendResetPasswordValidationSchema } from "~/validations/auth";
import type { SendResetPasswordFormData } from "~/validations/auth";

definePageMeta({
  layout: "auth",
});

useHead({
  title: "Reset password",
  meta: [
    {
      name: "description",
      content: "Reset password",
    },
  ],
});

const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: sendResetPasswordValidationSchema,
});

const { value: email } = useField("email");
const isLoading = ref(false);
const isResetPasswordSent = ref(false);

const onSubmit = handleSubmit(async (values: SendResetPasswordFormData) => {
  isLoading.value = true;
  try {
    // If validation passes, send the request
    const response: Response = await $fetch("/api/auth/reset-password", {
      method: "POST",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    });

    isLoading.value = false;
  } catch (error: any) {
    const errors = error.data.data;

    // Set the errors
    setErrors(errors);
    isLoading.value = false;
  }
  isResetPasswordSent.value = true;
});
</script>

<template>
  <div class="flex flex-col gap-4 py-16" v-if="!isResetPasswordSent">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">
      Reset Password
    </h1>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <div class="input input-bordered flex items-center gap-2">
          <Icon name="material-symbols:mail-rounded" size="20" />
          <input
            v-model="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            class="grow"
            :disabled="isLoading"
          />
        </div>
        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">
            {{ errors.email }}
          </span>
        </div>
      </label>

      <button
        class="btn btn-primary mt-4 flex gap-2 text-base"
        type="submit"
        :disabled="isLoading"
      >
        Continue
        <Icon name="line-md:loading-twotone-loop" size="24" v-if="isLoading" />
      </button>
    </form>

    <p class="text-muted-foreground text-center text-sm">
      Have you remembered your password?
      <NuxtLink href="/auth/login" class="link link-primary font-bold">Login now</NuxtLink>
    </p>
  </div>

  <div class="flex flex-col gap-4 max-w-sm py-16 px-4" v-else>
    <h1 class="mb-2 text-center text-3xl font-bold text-white">
      Reset Password
    </h1>
    <p class="text-center text-white">
      If the email exists in our system, we will send you an email with
      instructions to reset your password.
    </p>
    <p class="text-muted-foreground text-center text-sm">
      Have you remembered your password?
      <NuxtLink href="/auth/login" class="link link-primary font-bold">Login now</NuxtLink>
    </p>
  </div>
</template>
