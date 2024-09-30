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

  <!-- Reservation Data -->
  <n-card class="mt-2">
    <n-form
      ref="formRef"
      :label-width="100"
      :model="formValue"
      :rules="rules"
      class="font-belanosima-400"
      :style="isMobile ? 'font-size :10pt' : 'font-size :12pt'"
      size="small"
    >
      <n-form-item :span="2" label="Nota" label-placement="left">
        <div class="font-quicksand-400">
          {{ formValue.receiptNo }}
        </div>
      </n-form-item>

      <n-form-item :span="2" label="Jam Mulai" label-placement="left">
        <div class="font-quicksand-400">
          {{ `${selectedSchedule.schedule.time}:00` }}
        </div>
      </n-form-item>

      <n-form-item :span="2" label="Jenis" label-placement="left">
        <n-select
          v-if="stepReservation === 'reservation'"
          v-model:value="formValue.transactionType"
          placeholder="Pilih Cabang"
          :options="transactionTypes"
          @update:value="transactionTypeHandler"
        />
        <div v-else class="font-quicksand-400">
          {{
            formValue.transactionType === 0
              ? "Harian"
              : transactionTypes.find(
                  (type) => type.value === formValue.transactionType
                ).label
          }}
        </div>
      </n-form-item>

      <n-form-item
        :span="2"
        label="Durasi"
        label-placement="left"
        path="duration"
      >
        <n-input-number
          v-if="
            stepReservation === 'reservation' ||
            (stepReservation === 'edit' && formValue.status === 'pending')
          "
          v-model:value="formValue.duration"
          placeholder="Isi Durasi"
          :min="minHourRule"
          @update:value="calculatePrice"
        />
        <div v-else class="font-quicksand-400">
          {{ formValue.duration }}
        </div>
      </n-form-item>
      <n-form-item :span="2" label="Harga" label-placement="left">
        <div class="font-quicksand-400">
          {{ `Rp. ${formValue.price.toLocaleString("en-AU")}` }}
        </div>
      </n-form-item>
      <n-form-item label="Status" label-placement="left">
        <n-select
          v-if="
            (stepReservation === 'reservation' ||
              stepReservation === 'payment' ||
              stepReservation === 'edit') &&
            formValue.transactionType === 0
          "
          v-model:value="formValue.status"
          placeholder="Pilih Status"
          :options="allStatus"
        />
        <div v-else class="font-quicksand-400">
          {{
            allStatus.find((status) => status.value === formValue.status).label
          }}
        </div>
      </n-form-item>
      <n-form-item
        v-if="formValue.status === 'paid' && formValue.transactionType === 0"
        label="Pembayaran"
        label-placement="left"
      >
        <n-select
          v-if="
            stepReservation === 'reservation' ||
            stepReservation === 'payment' ||
            stepReservation === 'edit'
          "
          v-model:value="formValue.payment"
          placeholder="Pilih Pembayaran"
          :options="allPayment"
        />
        <div v-else class="font-quicksand-400">
          {{
            allPayment.find((payment) => payment.value === formValue.payment)
              .label
          }}
        </div>
      </n-form-item>

      <n-form-item
        v-if="
          formValue.status === 'paid' &&
          (formValue.payment === 'debit' || formValue.payment === 'transfer') &&
          formValue.transactionType === 0
        "
        label="Bank"
        label-placement="left"
      >
        <n-input
          v-if="
            stepReservation === 'reservation' ||
            stepReservation === 'payment' ||
            stepReservation === 'edit'
          "
          v-model:value="formValue.bank"
          placeholder="Isi Bank"
        />
        <div v-else class="font-quicksand-400">
          {{ formValue.bank }}
        </div>
      </n-form-item>

      <n-form-item
        v-if="
          formValue.status === 'paid' &&
          (formValue.payment === 'debit' || formValue.payment === 'transfer') &&
          formValue.transactionType === 0
        "
        label="No Pembayaran"
        label-placement="left"
      >
        <n-input
          v-if="
            stepReservation === 'reservation' ||
            stepReservation === 'payment' ||
            stepReservation === 'edit'
          "
          v-model:value="formValue.noPayment"
          placeholder="Isi No Pembayaran"
        />
        <div v-else class="font-quicksand-400">
          {{ formValue.noPayment }}
        </div>
      </n-form-item>
      <n-form-item label="Catatan" label-placement="left">
        <n-input
          v-if="stepReservation === 'reservation' || stepReservation === 'edit'"
          v-model:value="formValue.note"
          placeholder="Isi Catatan"
          type="textarea"
        />
        <div v-else class="font-quicksand-400">
          {{ formValue.note }}
        </div>
      </n-form-item>

      <n-form-item
        v-if="stepReservation === 'cancel' && formValue.status === 'paid'"
        label="Pembatalan"
        label-placement="left"
      >
        <n-select
          v-model:value="formValue.cancelType"
          placeholder="Pilih Cabang"
          :options="
            formValue.transactionType === 0 ? cancelType : cancelPackageType
          "
        />
      </n-form-item>
    </n-form>
  </n-card>

  <!-- Alert Message -->
  <n-alert
    v-if="isOvertime || isConflictReservation"
    title="Error"
    type="error"
    class="mt-2"
    closable
  >
    {{ errorMessage }}
    <div
      v-if="!isMobile"
      style="text-decoration: underline; cursor: pointer"
      class="flex justify-end"
      @click="() => (isViewDetail = !isViewDetail)"
    >
      {{ isViewDetail ? "Tutup detail" : "Lihat detail" }}
    </div>

    <n-table
      v-if="isViewDetail && formValue.transactionType === 0"
      :single-line="false"
      striped
      :style="
        isMobile
          ? 'font-size: 7px; margin-top:5px;'
          : 'font-size:14px; margin-top: 10px'
      "
    >
      <thead>
        <tr>
          <th class="font-belanosima-400" style="width: 3%">Jam</th>
          <th class="font-belanosima-400" style="width: 7%">Nota</th>
          <th class="font-belanosima-400" style="width: 10%">Nama</th>
          <th class="font-belanosima-400" style="width: 10%">HP</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="font-belanosima-400"
          v-for="(detail, index) in detailError"
          :key="index"
        >
          <td>
            {{ detail.hour }}
          </td>
          <td>
            {{ detail.receipt_no }}
          </td>
          <td>
            {{ detail.name }}
          </td>
          <td>
            {{ detail.hp }}
          </td>
        </tr>
      </tbody>
    </n-table>

    <div v-else-if="isViewDetail && formValue.transactionType > 0">
      <n-tag
        v-for="(error, index) in detailError"
        :key="index"
        type="error"
        closable
        round
        class="mr-2 mt-1"
      >
        {{ error }}
      </n-tag>
    </div>
  </n-alert>

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

  <!-- Action Button -->
  <div style="width: 100%" class="font-quicksand-400 mt-2 flex justify-between">
    <n-button
      v-if="
        (stepReservation === 'reservation' || stepReservation === 'edit') &&
        !isSaved
      "
      dashed
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      :loading="isLoading"
      @click="backStep"
    >
      Ganti Member
    </n-button>
    <n-button
      v-if="
        stepReservation === 'payment' ||
        stepReservation === 'cancel' ||
        stepReservation === 'view' ||
        ((stepReservation === 'reservation' || stepReservation === 'edit') &&
          isSaved)
      "
      dashed
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      :loading="isLoading"
      @click="closeHandler"
    >
      Tutup
    </n-button>
    <n-button
      v-if="stepReservation !== 'view'"
      :type="stepReservation !== 'cancel' ? 'primary' : 'error'"
      :size="isMobile ? 'tiny' : 'medium'"
      :loading="isLoading"
      :disabled="isOvertime || isSaved"
      @click="
        stepReservation === 'reservation' ||
        stepReservation === 'edit' ||
        stepReservation === 'payment'
          ? saveTransactionHandler()
          : showCancelConfirmation()
      "
    >
      {{ stepReservation !== "cancel" ? "Simpan" : "Batal" }}
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { FormInst, FormItemRule } from "naive-ui";
import { useMessage } from "naive-ui";
import CloseOutline from "~icons/ion/close-outline";
import { useGeneralStore } from "~/store/general";
import { APISoccerTransaction } from "~/composables/api/admin/transaction/soccer-transaction";
import { APISoccerPackageTransaction } from "~/composables/api/admin/transaction/soccer-package";
import { DataReference } from "~/constant/data-reference";

const UseGeneralStore = useGeneralStore();
const message = useMessage();
const { isMobile } = storeToRefs(UseGeneralStore);
const formRef = ref<FormInst | null>(null);
const props = defineProps({
  selectedMember: {
    type: Object,
    default: null,
  },
  selectedSchedule: {
    type: Object,
    default: null,
  },
  idBranch: {
    type: Number,
    default: 0,
  },
  stepReservation: {
    type: String,
    default: "",
  },
  transactionData: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits([
  "backStepReservation",
  "refreshSoccerSchedule",
  "closeDrawer",
]);
const isLoading = ref(false);

const formValue = reactive({
  duration: 1,
  price: 0,
  status: "pending",
  note: null,
  bank: "",
  noPayment: "",
  payment: "transfer",
  transactionType: 0,
  cancelType: "cancel-paid",
  receiptNo: "",
});

const minHourRule = ref(1);

const rules = reactive({
  duration: {
    validator(rule: FormItemRule, value: number) {
      return value >= minHourRule.value;
    },
    trigger: ["blur", "change"],
    message: `Minimal durasi ${minHourRule.value} jam`,
  },
});

const allStatus = ref([
  {
    label: "Pending",
    value: "pending",
  },
  // {
  //   label: "Batal",
  //   value: "expired",
  // },
  {
    label: "Lunas",
    value: "paid",
  },
]);

const allPayment = ref([
  {
    label: "Transfer",
    value: "transfer",
  },
  {
    label: "Debit",
    value: "debit",
  },
  {
    label: "Cash",
    value: "cash",
  },
]);

const cancelType = ref([
  { label: "Non-Refund", value: "cancel-paid" },
  {
    label: "Refund",
    value: "cancel-refund",
  },
]);

const cancelPackageType = ref([
  { label: "Non-Refund 1 Reservasi", value: "cancel-paid-reservation" },
  {
    label: "Refund 1 Reservasi",
    value: "cancel-refund-reservation",
  },
  { label: "Non-Refund 1 Paket", value: "cancel-paid-package" },
  {
    label: "Refund 1 Paket",
    value: "cancel-refund-package",
  },
]);

const transactionTypes = ref([]);

let closedTime = 0;
const reservedTimeAndPrice = ref([]);

const isOvertime = ref(false);

onMounted(async () => {
  closedTime =
    props.selectedSchedule.rateAvailability
      .map((schedule) => schedule.time)
      .reduce((prev, curr) => (prev > curr ? prev : curr)) + 1;
  transactionTypes.value.push({
    label: "Harian",
    value: 0,
  });

  const responseActivedPackage = await APISoccerPackageTransaction(
    "getSoccerPackageTransactionByIdMember",
    null,
    {
      id: props.selectedMember.id,
    }
  );

  if (responseActivedPackage.status === 200) {
    if (props.stepReservation === "reservation")
      responseActivedPackage.response.forEach((pack) => {
        transactionTypes.value.push({
          label: `${pack.master_package.data.attributes.name} - Sisa ${pack.hourLeft} Jam`,
          value: pack.id,
          data: pack,
        });
      });
    else
      responseActivedPackage.response.forEach((pack) => {
        transactionTypes.value.push({
          label: `${pack.master_package.data.attributes.name} - Sisa ${pack.hourLeft} Jam`,
          value: pack.id,
          data: pack,
        });
      });
  }

  if (props.stepReservation !== "reservation") {
    formValue.receiptNo = props.transactionData.receiptNo;
    formValue.duration =
      props.transactionData.detail_soccer_transactions.data.length;
    formValue.note = props.transactionData.note;
    formValue.status =
      props.stepReservation === "payment"
        ? "paid"
        : props.transactionData.status;

    formValue.payment =
      props.stepReservation === "edit" && props.transactionData.payment
        ? props.transactionData.payment
        : "transfer";
    formValue.bank = props.transactionData.bank;
    formValue.noPayment = props.transactionData.noPayment;

    formValue.transactionType =
      props.transactionData.soccer_package_transaction.data?.id || 0;

    formValue.cancelType =
      formValue.transactionType === 0
        ? "cancel-paid"
        : "cancel-paid-reservation";
  }

  if (
    props.stepReservation === "reservation" ||
    props.stepReservation === "edit"
  ) {
    formValue.transactionType = 0;
  }
  calculatePrice();
});

const calculatePrice = () => {
  const endTime = props.selectedSchedule.schedule.time + formValue.duration;
  reservedTimeAndPrice.value = [];

  if (endTime > closedTime) {
    isOvertime.value = true;
    errorMessage.value = DataReference.errorMessageOperationalHour;
  } else isOvertime.value = false;

  if (formValue.transactionType === 0) formValue.price = 0;
  for (
    let index = props.selectedSchedule.schedule.time;
    index < endTime;
    index++
  ) {
    const singleSchedule = props.selectedSchedule.rateAvailability.find(
      (time) => time.time === index
    );
    reservedTimeAndPrice.value.push({
      hour: index,
      price: singleSchedule.price,
    });
    if (singleSchedule && formValue.transactionType === 0)
      formValue.price += singleSchedule.price;
  }
};

const backStep = () => {
  emit("backStepReservation", props.stepReservation);
};

const isConflictReservation = ref(false);
const isSaved = ref(false);
const errorMessage = ref(null);
const detailError = ref([]);
const isViewDetail = ref(false);
const isCancelConfirmationShow = ref(false);

const saveTransactionHandler = async () => {
  formRef.value?.validate(async (error) => {
    isConflictReservation.value = false;
    isViewDetail.value = false;
    detailError.value = [];

    if (!error) {
      if (props.stepReservation === "reservation") {
        const responseNewSoccerTransaction = await APISoccerTransaction(
          "createSoccerTransaction",
          {
            header: {
              dateReservation: props.selectedSchedule.date,
              master_availability: props.selectedSchedule.master_availability,
              master_member: props.selectedMember.id,
              master_branch: props.idBranch,
              status: formValue.status,
              payment: formValue.payment,
              bank: formValue.bank,
              note: formValue.note,
              noPayment: formValue.noPayment,
              transactionType: formValue.transactionType,
            },
            detail: {
              reservedTimeAndPrice: reservedTimeAndPrice.value,
            },
          },
          null
        );

        if (responseNewSoccerTransaction.status === 400) {
          isConflictReservation.value = true;
          detailError.value = responseNewSoccerTransaction.details;
          errorMessage.value = responseNewSoccerTransaction.response;
        } else if (responseNewSoccerTransaction.status === 200) {
          formValue.receiptNo = responseNewSoccerTransaction.response.receiptNo;

          message.success(DataReference.successMessage, {
            duration: DataReference.messageDuration,
          });
          emit("refreshSoccerSchedule", {
            transactionType: formValue.transactionType,
          });
          isSaved.value = true;
        }
      } else if (props.stepReservation === "payment") {
        const responseNewSoccerTransaction = await APISoccerTransaction(
          "updatePayment",
          {
            status: formValue.status,
            payment: formValue.payment,
            bank: formValue.bank,
            noPayment: formValue.noPayment,
          },
          { idHeader: props.transactionData.id }
        );
        if (responseNewSoccerTransaction.status === 200) {
          message.success(DataReference.successMessage, {
            duration: DataReference.messageDuration,
          });
          emit("refreshSoccerSchedule", {
            transactionType: 0,
          });
          isSaved.value = true;
        }
      } else if (props.stepReservation === "edit") {
        const responseUpdatedTransaction = await APISoccerTransaction(
          "updateSoccerTransaction",
          {
            header: {
              master_availability: props.selectedSchedule.master_availability,
              master_member: props.selectedMember.id,
              master_branch: props.idBranch,
              status: formValue.status,
              payment: formValue.payment,
              bank: formValue.bank,
              note: formValue.note,
              noPayment: formValue.noPayment,
            },
            detail: {
              reservedTimeAndPrice: reservedTimeAndPrice.value,
            },
          },
          { idHeader: props.transactionData.id }
        );

        if (responseUpdatedTransaction.status === 400) {
          isConflictReservation.value = true;
          detailError.value = responseUpdatedTransaction.details;
          errorMessage.value = responseUpdatedTransaction.response;
        } else if (responseUpdatedTransaction.status === 200) {
          message.success(DataReference.successMessage, {
            duration: DataReference.messageDuration,
          });
          emit("refreshSoccerSchedule", {
            transactionType: 0,
          });
          isSaved.value = true;
        }
      }
    }
  });
};

const cancelTransactionHandler = async () => {
  let responseNewSoccerTransaction;
  if (formValue.transactionType === 0)
    responseNewSoccerTransaction = await APISoccerTransaction(
      "updatePayment",
      {
        status:
          formValue.status == "pending" ? "expired" : formValue.cancelType,
      },
      { idHeader: props.transactionData.id }
    );
  else
    responseNewSoccerTransaction = await APISoccerPackageTransaction(
      "cancelSoccerPackageTransaction",
      {
        transactionType: formValue.transactionType,
        receipt: props.transactionData.receiptNo,
        status: formValue.cancelType,
      },
      { idHeader: props.transactionData.id }
    );

  if (responseNewSoccerTransaction.status === 200) {
    message.success(DataReference.cancelMessage, {
      duration: DataReference.messageDuration,
    });
    emit("refreshSoccerSchedule", {
      transactionType: 0,
    });
    isSaved.value = true;
  }
};

const closeHandler = () => {
  emit("closeDrawer");
};

const showCancelConfirmation = () => {
  isCancelConfirmationShow.value = true;
};

const handlePositiveClick = () => {
  cancelTransactionHandler();
  isCancelConfirmationShow.value = false;
};

const handleNegativeClick = () => {
  isCancelConfirmationShow.value = false;
};

const transactionTypeHandler = () => {
  let selectedTransactionType;
  if (formValue.transactionType !== 0) {
    selectedTransactionType = transactionTypes.value.find(
      (type) => type.value === formValue.transactionType
    );

    formValue.duration =
      selectedTransactionType.data.master_package.data.attributes.minHour;
    minHourRule.value =
      selectedTransactionType.data.master_package.data.attributes.minHour;
    rules.duration.message = `Minimal durasi ${minHourRule.value} jam`;
    formValue.price = selectedTransactionType.data.price;
    formValue.status = "paid";
  } else {
    formValue.duration = 1;
    minHourRule.value = 1;
    rules.duration.message = `Minimal durasi ${minHourRule.value} jam`;
  }
  calculatePrice();
};
</script>

<style scoped>
.font-quicksand-400 {
  font-family: "quicksand", sans-serif;
  font-weight: 400;
}

.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}

.n-drawer-container th {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  color: white;
  background: #b0914f;
}
</style>
