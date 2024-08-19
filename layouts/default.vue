<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
  <div class="wrapper">
    <AppNavbar />
    <main class="grid h-full place-content-center py-10 px-4">
      <slot />
    </main>
    <AppFooter />
    <!-- Vercel Insights -->
    <SpeedInsights />
  </div>
</template>

<style>
.wrapper {
  min-height: 100vh;
  display: grid;
  grid-template-areas:
    "nav"
    "main"
    "footer";

  grid-template-rows: auto 1fr auto;
}

nav {
  grid-area: nav;
}

main {
  grid-area: main;
}

footer {
  grid-area: footer;
}
</style>
