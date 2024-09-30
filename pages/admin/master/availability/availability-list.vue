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
        Master Ketersediaan

        <n-button
          v-if="isAllowedCreateAvailability"
          type="primary"
          class="ml-2"
          :size="isMobile ? 'tiny' : 'medium'"
          @click="setAvailability"
        >
          <Document />
          Set Ketersediaan
        </n-button>
      </div>
      <AdminMasterAvailabliltyList
        class="mt-2"
        @refresh-availability-list="refreshAvailabilityHandler"
        @detail-availability-handler="detailAvailabilityHandler"
      />
    </div>
    <n-drawer
      v-model:show="showDrower"
      :width="isMobile ? '85%' : '40%'"
      placement="right"
    >
      <n-drawer-content title="Set Ketersediaan">
        <AdminMasterAvailabilityCreate
          :is-edit-mode="isEditMode"
          :id-selected-availability="idSelectedAvailability"
          @refresh-availability-list="refreshAvailabilityList"
        />
      </n-drawer-content>
    </n-drawer>
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

const isAllowedCreateAvailability = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "insertMasterAvailability")
    ? true
    : false;
});

const showDrower = ref(false);

const setAvailability = () => {
  isEditMode.value = false;
  showDrower.value = true;
};

let functionRefreshAvailability = Function;

const refreshAvailabilityHandler = (functionCategoryHandler) => {
  functionRefreshAvailability = functionCategoryHandler;
};

const refreshAvailabilityList = (params) => {
  functionRefreshAvailability(params);
  showDrower.value = false;
};

const isEditMode = ref(false);
const idSelectedAvailability = ref(0);

const detailAvailabilityHandler = (idAvailability) => {
  isEditMode.value = true;
  idSelectedAvailability.value = idAvailability;
  showDrower.value = true;
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
