<template>
  <NuxtLayout name="blank">
    <div
      :style="
        isMobile
          ? 'padding-inline: 20px; padding-block:10px '
          : 'padding-inline: 100px; padding-block: 30px'
      "
      class="font-belanosima-400"
    >
      <AdminTransactionSoccerTransactionSchedule class="mt-3" />
      <!-- <n-tabs
        default-value="soccer-list"
        justify-content="space-evenly"
        class="font-quicksand-600"
        type="line"
        size="large"
        :style="
          isMobile
            ? 'padding-inline: 10px; padding-block:10px'
            : 'padding-inline: 20px; padding-block:20px'
        "
      >
        <n-tab-pane name="soccer-list" tab="Daftar Transaksi Soccer">
        </n-tab-pane>
        <n-tab-pane name="soccer-daily-schedule" tab="Jadwal Harian Soccer">

        </n-tab-pane>
      </n-tabs> -->
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

definePageMeta({
  layout: false,
  middleware: ["auth"],
});

const isAllowCreateSoccerTransaction = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "insertSoccerTransaction")
    ? true
    : false;
});
</script>

<style scoped>
.font-quicksand-600 {
  font-family: "quicksand", sans-serif;
  font-weight: 600;
}

.font-quicksand-500 {
  font-family: "quicksand", sans-serif;
  font-weight: 500;
}

.font-quicksand-400 {
  font-family: "quicksand", sans-serif;
  font-weight: 400;
}

.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}
</style>
