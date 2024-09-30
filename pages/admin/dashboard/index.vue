<template>
  <NuxtLayout name="blank">
    <h1>Hallo</h1>
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
  middleware: ["auth"],
});
</script>

<style scoped></style>
