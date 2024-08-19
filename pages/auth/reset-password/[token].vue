<script lang="ts" setup>
import { useForm, useField } from "vee-validate";
import { confirmResetPasswordValidationSchema } from "~/validations/auth";
import type { ConfirmResetPasswordFormData } from "~/validations/auth";

definePageMeta({
  layout: "auth",
  validate: async (route) => {
    // Check if the id is a valid hash
    return (
      typeof route.params.token === "string" &&
      /^[a-zA-Z0-9]{40}$/.test(route.params.token)
    );
  },
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
  validationSchema: confirmResetPasswordValidationSchema,
});

const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");
const isLoading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const isResetPassowordCompleted = ref(false);
const isTokenInvalid = ref(false);

const route = useRoute();

const onSubmit = handleSubmit(async (values: ConfirmResetPasswordFormData) => {
  isLoading.value = true;

  try {
    // If validation passes, send the request
    const response: Response = await $fetch(
      `/api/auth/reset-password/${route.params.token}`,
      {
        method: "POST",
        body: values,
        headers: {
          "Content-Type": "application/json",
          "Referrer-Policy": "strict-origin",
        },
      },
    );

    isLoading.value = false;

    if (response.ok) {
      isResetPassowordCompleted.value = true;
      await navigateTo("/");
    }
  } catch (error: any) {
    // Check if the token is invalid
    if (error.data.data.token) {
      isTokenInvalid.value = true;
      return;
    }

    // Get the validation errors
    const errors = error.data.data;

    // Set the errors
    setErrors(errors);
    isLoading.value = false;
  }
});
</script>

<template>
  <!-- If the token is valid -->
  <div class="flex flex-col gap-4" v-if="!isTokenInvalid">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">
      Reset Password
    </h1>
    <p>Enter a new password for your account.</p>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Password</span>
        </div>

        <label class="input input-bordered flex items-center gap-2">
          <Icon name="material-symbols:key-vertical-rounded" size="20" />
          <input
            v-model="password"
            name="password"
            placeholder="password"
            class="grow"
            :type="showPassword ? 'text' : 'password'"
            :disabled="isLoading"
          />
          <button
            type="button"
            class="flex items-center justify-center"
            @click="showPassword = !showPassword"
          >
            <Icon name="mdi:eye" size="20" v-if="!showPassword" />
            <Icon name="mdi:eye-off" size="20" v-else />
          </button>
        </label>

        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">{{
            errors.password
          }}</span>
        </div>
      </label>

      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Confirm Password</span>
        </div>

        <label class="input input-bordered flex items-center gap-2">
          <Icon name="material-symbols:key-vertical-rounded" size="20" />
          <input
            v-model="confirmPassword"
            name="confirmPassword"
            placeholder="confirmPassword"
            class="grow"
            :type="showConfirmPassword ? 'text' : 'password'"
            :disabled="isLoading"
          />
          <button
            type="button"
            class="flex items-center justify-center"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <Icon name="mdi:eye" size="20" v-if="!showConfirmPassword" />
            <Icon name="mdi:eye-off" size="20" v-else />
          </button>
        </label>
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
      <NuxtLink href="/auth/register" class="text-primary">Login now</NuxtLink>
    </p>
  </div>

  <!-- If the token is invalid -->
  <div class="flex flex-col gap-4" v-else-if="isTokenInvalid">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">
      Reset Password
    </h1>
    <p class="text-center text-white">The reset password link is invalid.</p>
    <p class="text-muted-foreground text-center text-sm">
      Have you remembered your password?
      <NuxtLink href="/auth/login" class="text-primary">Login now</NuxtLink>
    </p>
  </div>
</template>
