<script lang="ts" setup>
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
  title: "Verify Email",
  meta: [
    {
      name: "description",
      content: "Verify Email",
    },
  ],
});

const route = useRoute();

const isLoading = ref(false);
const isVerifyEmailCompleated = ref(false);
const isTokenInvalid = ref(false);

const onSubmit = async () => {
  isLoading.value = true;

  try {
    // If validation passes, send the request
    const response: Response = await $fetch(
      `/api/auth/email-verification/${route.params.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Referrer-Policy": "strict-origin",
        },
      },
    );

    isLoading.value = false;
    if (response.ok) {
      isVerifyEmailCompleated.value = true;
      await navigateTo("/protected");
    }
  } catch (error: any) {
    // Check if the token is invalid
    if (error.data.data.token) {
      isTokenInvalid.value = true;
      return;
    }

    // Set the errors
    isLoading.value = false;
  }
};
</script>

<template>
  <!-- If the token is valid -->
  <div class="flex flex-col gap-4" v-if="!isTokenInvalid">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">Verify Email</h1>
    <p>Continue to verify your email address.</p>
    <form @submit.prevent="onSubmit" class="flex flex-col gap-2">
      <button
        class="btn btn-primary mt-4 flex gap-2 text-base"
        type="submit"
        :disabled="isLoading"
      >
        Verify Email
        <Icon name="line-md:loading-twotone-loop" size="24" v-if="isLoading" />
      </button>
    </form>
  </div>

  <!-- If the token is invalid -->
  <div class="flex flex-col gap-4" v-else-if="isTokenInvalid">
    <h1 class="mb-2 text-center text-3xl font-bold text-white">Verify Email</h1>
    <p class="text-center text-white">The verify email link is invalid.</p>
  </div>
</template>
