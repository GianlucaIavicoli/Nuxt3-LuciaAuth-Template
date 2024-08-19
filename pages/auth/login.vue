<script lang="ts" setup>
import { useForm, useField } from "vee-validate";
import { loginValidationSchema } from "~/validations/auth";
import type { LoginFormData } from "~/validations/auth";

definePageMeta({
  title: "Login",
  description: "Create an account",
  layout: "auth",
});

useHead({
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Create an account",
    },
  ],
});

const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: loginValidationSchema,
});

const { value: email } = useField("email");
const { value: password } = useField("password");

const showPassword = ref(false);
const isLoading = ref(false);

const onSubmit = handleSubmit(async (values: LoginFormData) => {
  isLoading.value = true;
  try {
    // If validation passes, send the request
    await $fetch("/api/auth/login", {
      method: "POST",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    });

    isLoading.value = false;
    // Navigate to the home page on success
    await navigateTo("/");
  } catch (error: any) {
    const errors = error.data.data;

    // Set the errors
    setErrors(errors);
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex flex-col gap-4 py-16">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">
      Login to your account
    </h1>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">

      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Email</span>
        </div>
        <label class="input input-bordered flex items-center gap-2">
          <Icon name="material-symbols:mail-rounded" size="20" />
          <input
            v-model="email"
            name="email"
            type="email"
            placeholder="example@example.com"
            class="grow"
            :disabled="isLoading"
          />
        </label>
        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">
            {{ errors.email }}
          </span>
        </div>
      </label>

      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Password</span>
          <NuxtLink to="/auth/reset-password" class="label-text-alt text-primary">Forgot password?</NuxtLink>
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

      <button
        class="btn btn-primary mt-4 flex gap-2 text-base"
        type="submit"
        :disabled="isLoading"
      >
        Continue
        <Icon name="line-md:loading-twotone-loop" size="24" v-if="isLoading" />
      </button>
    </form>

    <div class="flex flex-col border-opacity-50">
      <div class="divider text-xs">OR CONTINUE WITH</div>
      <div class="flex justify-center gap-4">
        <a
          href="/login/github"
          class="btn btn-outline btn-neutral grow"
          @click="handleGithubSubmit"
        >
          Github
          <Icon name="mdi:github" size="24" />
        </a>
        <a
          href="/login/google"
          class="btn btn-outline btn-error grow"
          @click="handleGoogleSubmit"
        >
          Google
          <Icon name="logos:google-icon" size="20" />
        </a>
      </div>
    </div>

    <p class="text-muted-foreground text-center text-sm">
      Don't have an account?
      <NuxtLink href="/auth/register" class="text-primary">Register now</NuxtLink>
    </p>
  </div>
</template>
