<template>
  <NuxtLayout name="blank">
    <div class="flex min-h-full">
      <AdminAuthLoginForm />
      <AdminAuthLoginBanner />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ["auth"],
});
</script>

<style scoped></style>
