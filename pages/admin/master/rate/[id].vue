<template>
  <NuxtLayout name="blank">
    <div
      :style="
        isMobile
          ? 'padding-inline: 20px; padding-block:10px '
          : 'padding-inline: 100px; padding-block: 30px'
      "
    >
      <n-grid :cols="1">
        <n-gi>
          <div
            class="font-belanosima-400 flex items-center justify-between"
            style="font-size: 20px"
          >
            Master Tipe Harga
            <n-button
              type="primary"
              class="ml-2"
              :size="isMobile ? 'tiny' : 'medium'"
              @click="() => navigateTo('/admin/master/rate/rate-type')"
            >
              <List />
              Daftar Tipe Harga
            </n-button>
          </div>
        </n-gi>
        <n-gi></n-gi>
        <n-gi class="mt-2">
          <div
            style="
              box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);
              padding-inline: 20px;
              padding-block: 20px;
              border-radius: 15px;
            "
            class="font-belanosima-400"
          >
            <AdminMasterRateTypeListCreate />
          </div>
        </n-gi>
      </n-grid>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import List from "~icons/ion/list";
import { useGeneralStore } from "~/store/general";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

definePageMeta({
  layout: false,
  middleware: ["auth"],
});
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
