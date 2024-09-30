<template>
  <NuxtLayout name="blank">
    <div
      :style="
        isMobile
          ? 'padding-inline: 20px; padding-block:10px '
          : 'padding-inline: 100px; padding-block: 30px'
      "
    >
      <div
        class="font-belanosima-400 flex items-center justify-between"
        style="font-size: 20px"
      >
        Master Tipe Harga
        <n-button
          v-if="isAllowedCreateRateType"
          type="primary"
          class="ml-2"
          :size="isMobile ? 'tiny' : 'medium'"
          @click="createMasterHandler"
        >
          <Document />
          Tipe Harga Baru
        </n-button>
      </div>
      <AdminMasterRateTypeList class="mt-2" />
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeneralStore } from "~/store/general";
import Document from "~icons/ion/document";
import { UserStore } from "~/store/admin/user/user.store";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

definePageMeta({
  layout: false,
  middleware: ["auth"],
});

const isAllowedCreateRateType = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "insertMasterRate")
    ? true
    : false;
});

const createMasterHandler = async () => {
  await navigateTo("/admin/master/rate/new");
};
</script>

<style scoped>
.font-quicksand-600 {
  font-family: "quicksand", sans-serif;
  font-weight: 600;
}

.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}
</style>
