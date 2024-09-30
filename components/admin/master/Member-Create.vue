<template>
  <n-form
    ref="formRef"
    :label-width="80"
    :model="formValue"
    :rules="rules"
    class="font-belanosima-400"
  >
    <n-form-item label="Kode" label-placement="left">
      <div style="font-size: 14pt">
        {{ formValue.code }}
      </div>
    </n-form-item>
    <n-form-item label="Cabang" path="cabang">
      <n-select
        v-if="
          props.originMode !== 'reservation' &&
          props.originMode !== 'edit' &&
          props.originMode !== 'package-transaction'
        "
        v-model:value="formValue.master_branch"
        placeholder="Pilih Cabang"
        :options="brachesList"
      />
      <div
        v-else-if="
          brachesList.length > 0 &&
          (props.originMode === 'reservation' ||
            props.originMode === 'edit' ||
            props.originMode === 'package-transaction')
        "
      >
        {{ brachesList.find((branch) => branch.value === idBranch).label }}
      </div>
    </n-form-item>
    <n-form-item label="Nama Member" path="name">
      <n-input v-model:value="formValue.name" placeholder="Isi Nama Member" />
    </n-form-item>
    <n-form-item label="Alamat Member" path="address">
      <n-input
        v-model:value="formValue.address"
        placeholder="Isi Alamat Member"
      />
    </n-form-item>
    <n-form-item label="Kota Member" path="city">
      <n-input v-model:value="formValue.city" placeholder="Isi Kota Member" />
    </n-form-item>
    <n-form-item label="HP Member" path="hp">
      <n-input v-model:value="formValue.hp" placeholder="Isi HP Member" />
    </n-form-item>
    <n-form-item label="Catatan Member" path="note">
      <n-input
        v-model:value="formValue.note"
        placeholder="Isi Catatan Member"
        type="textarea"
      />
    </n-form-item>
    <n-form-item label="Blacklist" path="blacklist">
      <n-switch v-model:value="formValue.blacklist" />
    </n-form-item>
    <n-form-item>
      <div
        style="width: 100%"
        :class="
          props.originMode === 'reservation' ||
          props.originMode === 'edit' ||
          props.originMode === 'package-transaction'
            ? 'flex justify-between'
            : 'flex justify-end'
        "
      >
        <n-button
          v-if="
            props.originMode === 'reservation' ||
            props.originMode === 'edit' ||
            props.originMode === 'package-transaction'
          "
          dashed
          @click="backStep"
          :size="isMobile ? 'tiny' : 'medium'"
          :loading="isLoading"
        >
          Kembali
        </n-button>
        <n-button
          type="primary"
          @click="() => (isClearFields ? clearTheForm() : saveBranchHandler())"
          :size="isMobile ? 'tiny' : 'medium'"
          :loading="isLoading"
        >
          {{ isClearFields ? "Baru" : "Simpan" }}
        </n-button>
      </div>
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
import { MasterMemberInterface } from "~/composables/api/admin/master/member-interface";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";
import { APIMasterMember } from "~/composables/api/admin/master/master-member";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const formRef = ref<FormInst | null>(null);
const UserStoreInstance = UserStore();
const route = useRoute();
const message = useMessage();

const isEditMode = ref(route.params.id !== "new" ? true : false);

const isLoading = ref(false);
const isClearFields = ref(false);

const formValue = reactive<MasterMemberInterface>({
  name: null,
  address: null,
  blacklist: false,
  city: null,
  hp: null,
  note: null,
  master_branch: null,
  initial: null,
  code: null,
  id: null,
  users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
});

const rules = reactive({
  name: {
    required: true,
    message: "Silakan isi nama member",
    trigger: "blur",
  },
  address: {
    required: true,
    message: "Silakan isi alamat member",
    trigger: "blur",
  },
  city: {
    required: true,
    message: "Silakan isi kota member",
    trigger: "blur",
  },
  hp: {
    required: true,
    message: "Silakan isi hp member",
    trigger: "blur",
  },
});

const brachesList = ref([]);

const props = defineProps({
  originMode: {
    type: String,
    default: null,
  },
  idBranch: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["backStepReservation", "memberReservation"]);

onMounted(async () => {
  const responseActivedBranch = await APIMasterBranch(
    isEditMode.value ? "getAllMasterBranchDDL" : "getActivedMasterBranch",
    null,
    null
  );

  if (responseActivedBranch.status === 200) {
    brachesList.value = responseActivedBranch.response.map((branch) => ({
      label: branch.name,
      value: branch.id,
    }));

    formValue.master_branch =
      props.originMode === "reservation" ||
      props.originMode === "edit" ||
      props.originMode === "package-transaction"
        ? props.idBranch
        : brachesList.value[0].value;
  }

  if (
    isEditMode.value &&
    props.originMode !== "reservation" &&
    props.originMode !== "edit" &&
    props.originMode !== "package-transaction"
  ) {
    isLoading.value = true;

    const selectedBranch = await APIMasterMember(
      "getSelectedMasterMember",
      null,
      route.params.id
    );

    if (selectedBranch.status === 200) {
      Object.keys(formValue).forEach((key) => {
        if (
          selectedBranch.response[key] &&
          typeof selectedBranch.response[key] === "object"
        ) {
          formValue[key] = selectedBranch.response[key].data.id;
        } else formValue[key] = selectedBranch.response[key];
      });
      formValue.users_permissions_user =
        UserStoreInstance.getUserInfoDetail().id;
    }

    isLoading.value = false;
  }
});

const saveBranchHandler = () => {
  formRef.value?.validate(async (error) => {
    if (!error) {
      isLoading.value = true;
      let apiResponse;

      const payload = {};
      Object.keys(formValue).forEach((key) => {
        if (key !== "id") payload[key] = formValue[key];
      });

      if (
        !isEditMode.value ||
        props.originMode === "reservation" ||
        props.originMode === "edit" ||
        props.originMode === "package-transaction"
      )
        apiResponse = await APIMasterMember(
          "postNewMasterMember",
          payload,
          null
        );
      else
        apiResponse = await APIMasterMember(
          "putSelectedMasterMember",
          payload,
          route.params.id
        );

      if (apiResponse.status === 200) {
        formValue.code = apiResponse.response.code;
        if (
          props.originMode === "reservation" ||
          props.originMode === "edit" ||
          props.originMode === "package-transaction"
        ) {
          emit("memberReservation", {
            member: apiResponse.response,
            mode: props.originMode,
          });
        }

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
  GeneralFunction.clearForm(formValue, false);
  formValue.master_branch = brachesList.value[0].value;
  isClearFields.value = false;
  isEditMode.value = false;
  navigateTo("/admin/master/member/new");
};

const backStep = () => {
  emit("backStepReservation", props.originMode);
};
</script>

<style scoped>
.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}
</style>
