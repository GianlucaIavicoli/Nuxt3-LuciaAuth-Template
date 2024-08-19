<script lang="ts" setup>
import { useForm, useField } from "vee-validate";
import { registerValidationSchema } from "~/validations/auth";
import type { RegisterFormData } from "~/validations/auth";

definePageMeta({
  title: "Register",
  description: "Create an account",
  layout: "auth",
});

const { handleSubmit, errors, setErrors } = useForm({
  validationSchema: registerValidationSchema,
});

const { value: username } = useField("username");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");
const { value: privacyPolicy } = useField("privacyPolicy");

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isLoading = ref(false);

const onSubmit = handleSubmit(async (values: RegisterFormData) => {
  isLoading.value = true;
  try {
    // If validation passes, send the request
    const response: Response = await $fetch("/api/auth/register", {
      method: "POST",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    });

    isLoading.value = false;
    // Navigate to the home page on success

    // If the response is ok, send the email verification
    if (response.ok) {
      await $fetch("/api/auth/email-verification", {
        method: "POST",
        body: {
          email: values.email,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    await navigateTo("/protected");
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
      Create an account
    </h1>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Username</span>
        </div>

        <label class="input input-bordered flex items-center gap-2">
          <Icon name="material-symbols:person" size="20" />
          <input
            v-model="username"
            name="username"
            type="text"
            placeholder="example"
            class="grow"
            :disabled="isLoading"
          />
        </label>

        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">
            {{ errors.username }}
          </span>
        </div>
      </label>

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

        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">{{
            errors.confirmPassword
          }}</span>
        </div>
      </label>

      <div class="form-control">
        <label class="label cursor-pointer justify-start gap-4">
          <input
            name="privacyPolicy"
            v-model="privacyPolicy"
            type="checkbox"
            class="checkbox-primary checkbox"
            :disabled="isLoading"
          />
          <span class="label-text"
            >I accept the
            <span class="text-primary underline"> Privacy Policy </span>
          </span>
        </label>
        <div class="label">
          <span class="label-text-alt w-full text-sm text-red-500">{{
            errors.privacyPolicy
          }}</span>
        </div>
      </div>

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
      <div class="flex gap-4 justify-center">
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
      Already registered?
      <NuxtLink href="/auth/login" class="text-primary">Sign In</NuxtLink>
    </p>
  </div>
</template>
