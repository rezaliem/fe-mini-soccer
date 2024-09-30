<template>
  <n-form
    ref="formRef"
    :label-width="80"
    :model="formValue"
    :rules="rules"
    :style="isMobile ? 'width: 100%;' : 'width:50%'"
  >
    <n-form-item label="Nama Tipe Harga" path="name">
      <n-input
        v-model:value="formValue.name"
        placeholder="Isi Nama Tipe Harga"
      />
    </n-form-item>
    <n-form-item label="Jam Operational">
      <n-grid :cols="isMobile ? 1 : 2" x-gap="20">
        <n-gi>
          <n-select
            v-model:value="formValue.open"
            placeholder="Pilih Jam Buka"
            :options="openHoursList"
            @update:value="
              () => {
                fillOperationalHours();
                setSchedules();
              }
            "
          />
        </n-gi>
        <n-gi :class="isMobile ? 'mt-2' : ''">
          <n-select
            v-model:value="formValue.close"
            placeholder="Pilih Jam Tutup"
            :options="closeHoursList"
            @update:value="setSchedules"
          />
        </n-gi>
      </n-grid>
    </n-form-item>
    <n-form-item label="Minimum Harga">
      <n-input-number
        v-model:value="minimumPrice"
        placeholder="Isi Minimum Harga"
      />
      <n-button
        type="primary"
        class="ml-2"
        @click="setMinimumPrice"
        :size="isMobile ? 'small' : 'medium'"
      >
        Set minimum harga
      </n-button>
    </n-form-item>
    <n-form-item label="Aktif">
      <n-switch v-model:value="formValue.active" />
    </n-form-item>
  </n-form>

  <n-grid :cols="isMobile ? 2 : 6" x-gap="20">
    <n-gi
      v-for="(schedule, index) in formValue.schedules"
      :key="index"
      class="mb-4"
    >
      <div
        :style="
          isMobile
            ? ' box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2); padding-inline: 5px; padding-block: 20px;border-radius: 15px;'
            : ' box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2); padding-inline: 20px; padding-block: 20px;border-radius: 15px;'
        "
        class="font-belanosima-400"
      >
        <div
          class="flex justify-center"
          :style="isMobile ? 'font-size:10pt' : 'font-size:14pt'"
        >
          {{ `${schedule.time}:00` }}
        </div>
        <div class="mt-2">
          <n-input-number
            v-model:value="schedule.price"
            placeholder="Isi Minimum Harga"
          />
        </div>
      </div>
    </n-gi>
  </n-grid>
  <div class="flex justify-end">
    <n-button
      type="primary"
      class="mt-2"
      :size="isMobile ? 'tiny' : 'medium'"
      @click="() => (isClearFields ? clearTheForm() : saveRateTypeHandler())"
      :loading="isLoading"
    >
      {{ isClearFields ? "Baru" : "Simpan" }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { FormInst } from "naive-ui";
import { useMessage } from "naive-ui";
import { DataReference } from "~/constant/data-reference";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { APIMasterRateType } from "~/composables/api/admin/master/master-rate-type";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);
const route = useRoute();
const message = useMessage();

const formRef = ref<FormInst | null>(null);

const isEditMode = ref(route.params.id !== "new" ? true : false);

const formValue = reactive({
  id: null,
  name: null,
  open: 0,
  close: 1,
  schedules: [],
  active: true,
  users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
});

const rules = reactive({
  name: {
    required: true,
    message: "Silakan isi nama cabang",
    trigger: "blur",
  },
});

const openHoursList = ref([]);
const closeHoursList = ref([]);
const minimumPrice = ref(0);

onMounted(async () => {
  for (let index = 0; index < 24; index++) {
    openHoursList.value.push({
      label: `${index}:00`,
      value: index,
    });
  }

  if (isEditMode.value) {
    isLoading.value = true;
    const selectedRateType = await APIMasterRateType(
      "getSelectedMasterRateType",
      null,
      route.params.id
    );
    if (selectedRateType.status === 200) {
      formValue.id = selectedRateType.response.id;
      formValue.name = selectedRateType.response.name;
      const minHour = selectedRateType.response.schedules
        .map((schedule) => schedule.time)
        .reduce((prev, curr) => (prev < curr ? prev : curr));
      const maxHour = selectedRateType.response.schedules
        .map((schedule) => schedule.time)
        .reduce((prev, curr) => (prev > curr ? prev : curr));

      formValue.open = minHour;
      formValue.close = maxHour;
      formValue.schedules = selectedRateType.response.schedules;
      formValue.active = selectedRateType.response.active;
      formValue.users_permissions_user =
        UserStoreInstance.getUserInfoDetail().id;
    }
    isLoading.value = false;
  }

  fillOperationalHours();

  if (!isEditMode.value) setSchedules();
});

const fillOperationalHours = () => {
  closeHoursList.value = [];
  if (formValue.open >= formValue.close) formValue.close = formValue.open + 1;
  for (let index = formValue.open + 1; index <= 24; index++) {
    closeHoursList.value.push({
      label: `${index}:00`,
      value: index,
    });
  }
};

const setMinimumPrice = () => {
  formValue.schedules = [];
  for (let index = formValue.open; index < formValue.close; index++) {
    formValue.schedules.push({
      time: index,
      price: minimumPrice.value,
    });
  }
};

const setSchedules = () => {
  formValue.schedules = [];
  for (let index = formValue.open; index < formValue.close; index++) {
    formValue.schedules.push({
      time: index,
      price: minimumPrice.value,
    });
  }
};

const isClearFields = ref(false);
const isLoading = ref(false);

const saveRateTypeHandler = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      isLoading.value = true;
      let apiResponse;
      const payload = {};
      Object.keys(formValue).forEach((key) => {
        if (key !== "id") payload[key] = formValue[key];
      });

      if (!isEditMode.value)
        apiResponse = await APIMasterRateType(
          "postNewMasterRateType",
          payload,
          null
        );
      else
        apiResponse = await APIMasterRateType(
          "putSelectedMasterRateType",
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
    } else {
      message.error(DataReference.errorMessage, {
        duration: DataReference.messageDuration,
      });
    }
  });
};

const clearTheForm = () => {
  formValue.id = null;
  formValue.name = null;
  formValue.open = 0;
  formValue.close = 1;
  formValue.schedules = [];
  formValue.users_permissions_user = UserStoreInstance.getUserInfoDetail().id;
  isClearFields.value = false;
  isEditMode.value = false;
  fillOperationalHours();
  setSchedules();
  navigateTo("/admin/master/rate/new");
};
</script>

<style scoped></style>
