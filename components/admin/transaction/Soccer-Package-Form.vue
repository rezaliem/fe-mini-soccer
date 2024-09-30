<template>
  <!-- Member Data -->
  <n-card>
    <n-form
      :label-width="80"
      class="font-belanosima-400"
      :style="isMobile ? 'font-size :10pt' : 'font-size :12pt'"
      size="small"
    >
      <n-grid :cols="isMobile ? 1 : 2" :x-gap="24">
        <n-form-item-gi :span="2" label="Kode" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.code }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="Nama" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.name }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="HP" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.hp }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="Alamat" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.address }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="Blacklist" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.blacklist ? "Ya" : "Tidak" }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="Kota" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.city }}
          </div>
        </n-form-item-gi>
        <n-form-item-gi label="Catatan" label-placement="left">
          <div class="font-quicksand-400">
            {{ selectedMember.note }}
          </div>
        </n-form-item-gi>
      </n-grid>
    </n-form>
  </n-card>

  <!-- Transaction Form -->
  <n-card class="mt-2">
    <n-form
      :label-width="80"
      :model="formValue"
      class="font-belanosima-400"
      :style="isMobile ? 'font-size :10pt' : 'font-size :12pt'"
      size="small"
    >
      <n-form-item label="Nota" label-placement="left">
        <div class="font-quicksand-600">
          {{ formValue.nota }}
        </div>
      </n-form-item>
      <n-form-item label="Paket" label-placement="left">
        <div
          v-if="stepPackage !== 'view' && stepPackage !== 'cancel'"
          class="font-quicksand-400"
        >
          <n-select
            v-model:value="formValue.selectedPackage.id"
            placeholder="Pilih Paket "
            :options="allActivedPackage"
            @update:value="changedPackageHandler"
          />
        </div>
        <div
          v-else-if="stepPackage === 'view' || stepPackage === 'cancel'"
          class="font-quicksand-400"
        >
          {{
            allActivedPackage.find(
              (pack) => pack.value === formValue.selectedPackage.id
            )?.label
          }}
        </div>
      </n-form-item>
      <n-form-item label="Jam" label-placement="left">
        <div class="font-quicksand-400">
          {{ `${formValue.selectedPackage.detail?.totalHours} jam` }}
        </div>
      </n-form-item>
      <n-form-item label="Min Jam" label-placement="left">
        <div class="font-quicksand-400">
          {{ `${formValue.selectedPackage.detail?.minHour} jam` }}
        </div>
      </n-form-item>
      <n-form-item label="Harga" label-placement="left">
        <div class="font-quicksand-400">
          {{
            `Rp. ${formValue.selectedPackage.detail?.price.toLocaleString(
              "en-AU"
            )}`
          }}
        </div>
      </n-form-item>
      <n-form-item
        v-if="stepPackage === 'view'"
        label="Active"
        label-placement="left"
      >
        <div class="font-quicksand-400">
          {{ formValue.active ? "Ya" : "Tidak" }}
        </div>
      </n-form-item>
    </n-form>
  </n-card>

  <n-dialog
    v-if="isCancelConfirmationShow"
    class="font-quicksand-400 mt-2"
    title="Konfirmasi pembatalan transaksi"
    content="Apakah anda yakin akan membatalkan transaksi ini?"
    type="error"
    bordered
    :closable="false"
    negative-text="Tidak"
    positive-text="Ya"
    @positive-click="handlePositiveClick"
    @negative-click="handleNegativeClick"
    style="width: 100%"
  />

  <div class="mt-2 flex justify-between">
    <n-button
      v-if="
        (stepPackage === 'package-transaction' || stepPackage === 'edit') &&
        !isSaved
      "
      dashed
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      @click="backStep"
    >
      Ganti Member
    </n-button>
    <n-button
      v-if="isSaved || stepPackage === 'view' || stepPackage === 'cancel'"
      dashed
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      @click="closeHandler"
    >
      Close
    </n-button>
    <n-button
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      :disabled="isSaved"
      @click="
        stepPackage === 'package-transaction' || stepPackage === 'edit'
          ? savePackageTransactionHandler()
          : showCancelConfirmation()
      "
    >
      {{ stepPackage !== "cancel" ? "Simpan" : "Batal" }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMessage } from "naive-ui";
import { useGeneralStore } from "~/store/general";
import { APIMasterPackage } from "~/composables/api/admin/master/master-package";
import { APISoccerPackageTransaction } from "~/composables/api/admin/transaction/soccer-package";
import { UserStore } from "~/store/admin/user/user.store";
import { DataReference } from "~/constant/data-reference";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const message = useMessage();
const { isMobile } = storeToRefs(UseGeneralStore);
const props = defineProps({
  selectedMember: {
    type: Object,
    default: null,
  },
  packageTransactionData: {
    type: Object,
    default: 0,
  },
  stepPackage: {
    type: String,
    default: "",
  },
});

const allActivedPackage = ref([]);
const formValue = reactive({
  nota: "",
  selectedPackage: {
    id: 0,
    detail: null,
  },
  active: true,
});

onMounted(async () => {
  const responseActivedPackage = await APIMasterPackage(
    "getActivedMasterPackage",
    null,
    null
  );

  if (responseActivedPackage.status === 200) {
    allActivedPackage.value = responseActivedPackage.response.map((pack) => ({
      label: `${pack.name} - ${pack.totalHours} Jam`,
      value: pack.id,
      data: pack,
    }));
    formValue.selectedPackage.id = allActivedPackage.value[0].value;
    formValue.selectedPackage.detail = allActivedPackage.value[0].data;
  }

  if (
    props.stepPackage === "view" ||
    props.stepPackage === "edit" ||
    props.stepPackage === "cancel"
  ) {
    formValue.nota = props.packageTransactionData.receiptNo;
    formValue.selectedPackage.id =
      props.packageTransactionData.master_package.data.id;
    formValue.selectedPackage.detail =
      props.packageTransactionData.master_package.data.attributes;
    formValue.active = props.packageTransactionData.active;
  }
});

const changedPackageHandler = () => {
  formValue.selectedPackage.detail = allActivedPackage.value.find(
    (pack) => pack.value === formValue.selectedPackage.id
  ).data;
};

const isSaved = ref(false);
const emit = defineEmits([
  "refreshSoccerPackageTransaction",
  "closeDrawer",
  "backStepPackage",
]);
const isCancelConfirmationShow = ref(false);

const savePackageTransactionHandler = async () => {
  if (props.stepPackage === "package-transaction") {
    const responseNewPackageTransaction = await APISoccerPackageTransaction(
      "createSoccerPackageTransaction",
      {
        master_member: props.selectedMember.id,
        master_package: formValue.selectedPackage.id,
        active: formValue.active,
        hourLeft: formValue.selectedPackage.detail?.totalHours,
        price: formValue.selectedPackage.detail?.price,
        users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
      },
      null
    );
    if (responseNewPackageTransaction.status === 200) {
      formValue.nota = responseNewPackageTransaction.response.receiptNo;
      message.success(DataReference.successMessage, {
        duration: DataReference.messageDuration,
      });
      emit("refreshSoccerPackageTransaction");
      isSaved.value = true;
    }
  } else if (props.stepPackage === "edit") {
    const responseUpdatedPackageTransaction = await APISoccerPackageTransaction(
      "updateSoccerPackageTransaction",
      {
        master_member: props.selectedMember.id,
        master_package: formValue.selectedPackage.id,
        hourLeft: formValue.selectedPackage.detail?.totalHours,
        price: formValue.selectedPackage.detail?.price,
        users_permissions_user: UserStoreInstance.getUserInfoDetail().id,
      },
      { idPackageTransaction: props.packageTransactionData.id }
    );

    if (responseUpdatedPackageTransaction.status === 200) {
      message.success(DataReference.successMessage, {
        duration: DataReference.messageDuration,
      });
      emit("refreshSoccerPackageTransaction");
      isSaved.value = true;
    }
  }
};

const backStep = () => {
  emit("backStepPackage", { originMode: props.stepPackage });
};

const closeHandler = () => {
  emit("closeDrawer");
};

const showCancelConfirmation = () => {
  isCancelConfirmationShow.value = true;
};

const cancelPackageTransactionHandler = async () => {
  const responseCancelPackageTransaction = await APISoccerPackageTransaction(
    "updateSoccerPackageTransaction",
    {
      active: false,
    },
    { idPackageTransaction: props.packageTransactionData.id }
  );

  if (responseCancelPackageTransaction.status === 200) {
    message.success(DataReference.successMessage, {
      duration: DataReference.messageDuration,
    });
    emit("refreshSoccerPackageTransaction");
    isSaved.value = true;
  }
};

const handlePositiveClick = () => {
  cancelPackageTransactionHandler();
  isCancelConfirmationShow.value = false;
};

const handleNegativeClick = () => {
  isCancelConfirmationShow.value = false;
};
</script>

<style scoped>
.font-quicksand-400 {
  font-family: "quicksand", sans-serif;
  font-weight: 400;
}

.font-quicksand-600 {
  font-family: "quicksand", sans-serif;
  font-weight: 600;
}

.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}
</style>
