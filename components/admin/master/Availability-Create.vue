<template>
  <div class="font-belanosima-400">
    <div class="flex items-center">
      <div
        :style="
          isMobile
            ? 'min-width: 50px; font-size: 12px'
            : 'min-width: 100px; font-size: 16px'
        "
      >
        Cabang
      </div>

      <n-select
        v-if="!props.isEditMode"
        v-model:value="formValue.master_branch"
        placeholder="Pilih Cabang"
        :options="allActivedBranches"
      />
      <div v-else>
        {{ editForm.branchName }}
      </div>
    </div>
    <div class="mt-3 flex items-center">
      <div
        :style="
          isMobile
            ? 'min-width: 50px; font-size: 12px'
            : 'min-width: 100px; font-size: 16px'
        "
      >
        Tanggal
      </div>

      <n-date-picker
        v-if="!props.isEditMode"
        v-model:value="formValue.date"
        type="daterange"
        format="dd-MM-yyyy"
      />
      <div v-else>
        {{ editForm.date }}
      </div>
    </div>
    <div class="mt-3 flex items-center">
      <div
        :style="
          isMobile
            ? 'min-width: 50px; font-size: 12px'
            : 'min-width: 100px; font-size: 16px'
        "
      >
        Status
      </div>

      <n-switch v-model:value="formValue.open" />
    </div>
    <div v-if="formValue.open" class="mt-3 flex items-center">
      <div
        :style="
          isMobile
            ? 'min-width: 50px; font-size: 12px'
            : 'min-width: 100px; font-size: 16px'
        "
      >
        Tipe Harga
      </div>

      <n-select
        v-model:value="formValue.master_rate_type"
        placeholder="Pilih Tipe Harga"
        :options="allRateTypes"
        @update:value="setSchedule"
      />
    </div>
    <n-grid
      class="mt-3"
      v-if="formValue.open"
      :cols="isMobile ? 2 : 4"
      x-gap="20"
    >
      <n-gi
        v-for="(schedule, index) in scheduleRateType"
        :key="index"
        class="mb-4"
      >
        <div
          style="
            box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.2);
            padding-inline: 5px;
            padding-block: 5px;
            border-radius: 15px;
          "
          class="font-belanosima-400"
        >
          <div
            class="flex justify-center"
            :style="isMobile ? 'font-size:10pt' : 'font-size:14pt'"
          >
            {{ `${schedule.time}:00` }}
          </div>
          <div class="mt-2 flex justify-center">
            {{ `Rp. ${schedule.price.toLocaleString("en-AU")}` }}
          </div>
        </div>
      </n-gi>
    </n-grid>

    <div
      class="flex justify-end"
      :style="formValue.open ? 'width : 100%' : 'width: 50%'"
    >
      <n-button
        type="primary"
        class="mt-2"
        :size="isMobile ? 'tiny' : 'medium'"
        :loading="isLoading"
        @click="saveAvailabilityHandler"
      >
        Simpan
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMessage } from "naive-ui";
import { DataReference } from "~/constant/data-reference";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { GeneralFunction } from "~/composables/general";
import { APIMasterRateType } from "~/composables/api/admin/master/master-rate-type";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";
import { APIMasterAvailability } from "~/composables/api/admin/master/master-availability";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const UserStoreInstance = UserStore();
const message = useMessage();

const isLoading = ref(false);

const formValue = reactive({
  id: null,
  date: <[number, number]>[Date.now(), Date.now()],
  open: true,
  master_rate_type: null,
  master_branch: null,
  users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
});

const allRateTypes = ref([]);
const allActivedBranches = ref([]);
const scheduleRateType = ref([]);

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
  idSelectedAvailability: {
    type: Number,
    default: 0,
  },
});

const editForm = reactive({
  branchName: null,
  date: null,
});

const emit = defineEmits(["refreshAvailabilityList"]);

onMounted(async () => {
  if (props.isEditMode) {
    const responseSelectedAvailability = await APIMasterAvailability(
      "getSelectedMasterAvailability",
      null,
      props.idSelectedAvailability
    );

    editForm.branchName =
      responseSelectedAvailability.response.master_branch.data.attributes.name;
    formValue.master_branch =
      responseSelectedAvailability.response.master_branch.data.id;
    editForm.date = responseSelectedAvailability.response.date;
    formValue.date = [
      Date.parse(responseSelectedAvailability.response.date),
      Date.parse(responseSelectedAvailability.response.date),
    ];
    formValue.open = responseSelectedAvailability.response.open;
    formValue.master_rate_type =
      responseSelectedAvailability.response.master_rate_type.data?.id;
  }

  const responseRateTypes = await APIMasterRateType(
    "getActivedMasterRateType",
    null,
    null
  );

  if (responseRateTypes.status === 200) {
    allRateTypes.value = responseRateTypes.response.map((type) => ({
      label: type.name,
      value: type.id,
    }));

    if (!props.isEditMode || (props.isEditMode && !formValue.open)) {
      formValue.master_rate_type = allRateTypes.value[0].value;
      setSchedule();
    }
    if (formValue.open) setSchedule();
  }

  if (!props.isEditMode) {
    const responseActivedBranches = await APIMasterBranch(
      "getActivedMasterBranch",
      null,
      null
    );

    if (responseActivedBranches.status === 200) {
      allActivedBranches.value = responseActivedBranches.response.map(
        (branch) => ({
          label: branch.name,
          value: branch.id,
        })
      );
      formValue.master_branch = allActivedBranches.value[0].value;
    }
  }
});

const setSchedule = async () => {
  const selectedRateType = await APIMasterRateType(
    "getSelectedMasterRateType",
    null,
    formValue.master_rate_type
  );

  scheduleRateType.value = [];
  if (selectedRateType.status === 200) {
    scheduleRateType.value = selectedRateType.response.schedules;
  }
};

const saveAvailabilityHandler = async () => {
  const responseNewAvailability = await APIMasterAvailability(
    "postNewMasterAvailability",
    formValue,
    null
  );

  if (responseNewAvailability.status === 200) {
    emit("refreshAvailabilityList", formValue);

    message.success(DataReference.successMessage, {
      duration: DataReference.messageDuration,
    });
  }
};
</script>

<style scoped></style>
