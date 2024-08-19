<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

useSeoMeta({
  title: "Protected - User Info",
  description: "User information",
});

const user = useAuthenticatedUser();

async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await navigateTo("/");
}
</script>

<template>
  <div class="card min-w-56 bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title justify-center text-center">User info:</h2>
      <div class="flex flex-col gap-4 rounded-md px-2 py-4">
        <img
          :src="user.avatarUrl ? user.avatarUrl : '/img/user.png'"
          :alt="user.username"
          class="size-20 rounded-full"
        />
        <p>ID: {{ user.id }}</p>
        <p>Display name: {{ user.displayName }}</p>
        <p>Username: {{ user.username }}</p>
        <p>Email: {{ user.email }}</p>
        <div class="flex items-center gap-4">
          Email Verified:
          <div
            class="badge"
            :class="[user.emailVerified ? 'badge-success' : 'badge-error']"
          >
            {{ user.emailVerified ? "Yes" : "No" }}
          </div>
        </div>
        <p>Role: {{ user.role }}</p>
        <p>
          Created at:
          {{ new Date(user.createdAt).toDateString() }}
        </p>
      </div>
      <div class="card-actions justify-start">
        <button @click.prevent="logout" class="btn btn-primary">Logout</button>
      </div>
    </div>
  </div>
</template>
