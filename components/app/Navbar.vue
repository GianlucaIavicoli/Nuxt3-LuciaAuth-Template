<template>
  <nav class="navbar bg-base-100 shadow-lg">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost text-xl">LuciaAuth-Template</NuxtLink>
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1 gap-2">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/">About</NuxtLink></li>
        <li><NuxtLink to="/">Contact</NuxtLink></li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
          <div class="w-10 rounded-full">
            <img
              :alt="user.username"
              :src="user.avatarUrl ? user.avatarUrl : '/img/user.png'"
            />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 min-w-24 gap-2 rounded-box bg-base-300 p-2 shadow"
        >
          <li>
            <NuxtLink to="/" class="justify-start gap-3">
              <Icon name="material-symbols:person-outline-rounded" size="20" />
              <p>Profile</p>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/" class="justify-start gap-3">
              <Icon name="solar:settings-outline" size="20" />
              Settings
            </NuxtLink>
          </li>
          <li>
            <button @click="logout" class="justify-start gap-3">
              <Icon name="solar:logout-2-outline" size="20" />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
const user = useAuthenticatedUser();

async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await navigateTo("/auth/login");
}
</script>

<style></style>
