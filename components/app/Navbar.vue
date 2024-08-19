<template>
  <nav class="navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
        >
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li>
            <a
              href="https://github.com/GianlucaIavicoli/Nuxt3-LuciaAuth-Template#features"
              target="_blank"
              >Features</a
            >
          </li>
          <li>
            <a
              href="https://github.com/GianlucaIavicoli/Nuxt3-LuciaAuth-Template"
              target="_blank"
              >Documentation</a
            >
          </li>
        </ul>
      </div>
      <NuxtLink to="/" class="btn btn-ghost pl-0 text-xl sm:pl-2"
        >Nuxt Lucia</NuxtLink
      >
    </div>
    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal gap-2 px-1">
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li>
          <a
            href="https://github.com/GianlucaIavicoli/Nuxt3-LuciaAuth-Template#features"
            target="_blank"
            >Features</a
          >
        </li>
        <li>
          <a
            href="https://github.com/GianlucaIavicoli/Nuxt3-LuciaAuth-Template"
            target="_blank"
            >Documentation</a
          >
        </li>
      </ul>
    </div>
    <div class="navbar-end">
      <div class="dropdown dropdown-end" v-if="user">
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
          class="menu dropdown-content menu-sm z-[1] mt-3 min-w-24 gap-2 rounded-box bg-base-200 p-2 shadow"
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
      <NuxtLink to="/auth/login" class="btn btn-primary" v-else>Login</NuxtLink>
    </div>
  </nav>
</template>

<script lang="ts" setup>
const user = useUser();

async function logout() {
  await $fetch("/api/auth/logout", {
    method: "POST",
  });
  await navigateTo("/");
}
</script>

<style></style>
