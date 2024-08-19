<script lang="ts" setup>
useSeoMeta({
  title: "Nuxt LuciaAuth Template",
  description:
    "A Nuxt.js Authentication template (login, register, email validation, reset password and oauth) using Lucia-Auth, Prisma, PostgreSQL andMailtrap.",
});

const user = useUser();

async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await navigateTo("/");
}
</script>

<template>
  <main class="flex flex-col items-start justify-start">
    <AppHero />
  </main>
</template>
