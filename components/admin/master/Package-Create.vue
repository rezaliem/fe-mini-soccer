<template>
  <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
    <n-form-item label="Nama Paket" path="name">
      <n-input v-model:value="formValue.name" placeholder="Isi Nama Paket" />
    </n-form-item>
    <n-form-item label="Harga Paket">
      <n-input-number
        v-model:value="formValue.price"
        placeholder="Isi Kota Paket"
      />
    </n-form-item>
    <n-form-item label="Total Jam">
      <n-input-number
        v-model:value="formValue.totalHours"
        placeholder="Isi Total Jam"
      />
    </n-form-item>
    <n-form-item label="Min Jam / Game">
      <n-input-number
        v-model:value="formValue.minHour"
        placeholder="Isi Minimal Jam"
      />
    </n-form-item>
    <n-form-item label="Aktif" path="active">
      <n-switch v-model:value="formValue.active" />
    </n-form-item>
    <n-form-item class="flex justify-end">
      <n-button
        type="primary"
        class="mt-2"
        @click="() => (isClearFields ? clearTheForm() : savePackageHandler())"
        :size="isMobile ? 'tiny' : 'medium'"
        :loading="isLoading"
      >
        {{ isClearFields ? "Baru" : "Simpan" }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { FormInst } from "naive-ui";
import { useMessage } from "naive-ui";
import { DataReference } from "~/constant/data-reference";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { GeneralFunction } from "~/composables/general";
import { MasterPackageInterface } from "~/composables/api/admin/master/package-interface";
import { APIMasterPackage } from "~/composables/api/admin/master/master-package";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const formRef = ref<FormInst | null>(null);
const UserStoreInstance = UserStore();
const route = useRoute();
const message = useMessage();

const isEditMode = ref(route.params.id !== "new" ? true : false);

const formValue = reactive<MasterPackageInterface>({
  id: 0,
  name: "",
  price: 0,
  totalHours: 0,
  minHour: 2,
  active: true,
  users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
});

const rules = reactive({
  name: {
    required: true,
    message: "Silakan isi nama paket",
    trigger: "blur",
  },
});

const isLoading = ref(false);
const isClearFields = ref(false);

onMounted(async () => {
  if (isEditMode.value) {
    isLoading.value = true;
    const selectedBranch = await APIMasterPackage(
      "getSelectedMasterPackage",
      null,
      route.params.id
    );
    if (selectedBranch.status === 200) {
      Object.keys(formValue).forEach((key) => {
        formValue[key] = selectedBranch.response[key];
      });
      formValue.users_permissions_user =
        UserStoreInstance.getUserInfoDetail().id;
    }
    isLoading.value = false;
  }
});

const savePackageHandler = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      isLoading.value = true;
      let apiResponse;

      const payload = {};
      Object.keys(formValue).forEach((key) => {
        if (key !== "id") payload[key] = formValue[key];
      });

      if (!isEditMode.value)
        apiResponse = await APIMasterPackage(
          "postNewMasterPackage",
          payload,
          null
        );
      else
        apiResponse = await APIMasterPackage(
          "putSelectedMasterPackage",
          payload,
          route.params.id
        );

      if (apiResponse.status === 200) {
        message.success(DataReference.successMessage, {
          duration: DataReference.messageDuration,
        });
        isClearFields.value = true;
      }
      isLoading.value = false;
    } else
      message.error(DataReference.errorMessage, {
        duration: DataReference.messageDuration,
      });
  });
};

const clearTheForm = () => {
  GeneralFunction.clearForm(formValue, true);
  isClearFields.value = false;
  isEditMode.value = false;
  navigateTo("/admin/master/package/new");
};
</script>

<style scoped></style>
