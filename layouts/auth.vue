<template>
  <div class="grid min-h-[100vh] place-content-center">
    <slot />
    <SpeedInsights/>
  </div>
</template>

<script lang="ts" setup>
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<style></style>
