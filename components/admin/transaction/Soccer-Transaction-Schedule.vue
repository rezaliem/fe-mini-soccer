<template>
  <div class="flex items-center justify-between">
    <n-form :label-width="80" :model="formValue">
      <n-grid :cols="isMobile ? 1 : 4" :x-gap="24">
        <n-form-item-gi label="Cabang">
          <n-select
            v-model:value="formValue.master_branch"
            placeholder="Pilih Cabang"
            :options="allActivedBranches"
            @update:value="getAvailability()"
          />
        </n-form-item-gi>
        <n-form-item-gi label="Tanggal">
          <n-date-picker
            v-model:value="formValue.date"
            type="date"
            format="dd-MM-yyyy"
            :class="isMobile ? 'mt-2' : 'ml-2'"
            style="width: 300px"
            @update:value="getAvailability()"
          />
        </n-form-item-gi>
      </n-grid>
    </n-form>
    <n-button
      type="primary"
      :size="isMobile ? 'tiny' : 'medium'"
      @click="getAvailability"
    >
      <refreshCircle />
    </n-button>
  </div>
  <div v-if="soccerDailyAvailability.status === 'open'" class="mt-3">
    <div
      :style="
        isMobile
          ? 'min-width: 50px; font-size: 12px'
          : 'min-width: 100px; font-size: 16px'
      "
    >
      {{ `Tipe Harga : ${soccerDailyAvailability.rateName}` }}
    </div>
    <n-grid class="mt-3" :cols="isMobile ? 2 : 6" x-gap="20">
      <n-gi
        v-for="(schedule, index) in soccerDailyAvailability.rateAvailability"
        :key="index"
        class="boxInner mb-4"
      >
        <AdminTransactionSoccerBoxAvailability
          :schedule="schedule"
          @availability-selected-handler="availabilitySelectedHandler"
        />
      </n-gi>
    </n-grid>
  </div>

  <n-drawer
    v-model:show="showDrawer"
    :width="
      isMobile ? '85%' : stepReservation === 'member-list' ? '60%' : '40%'
    "
    placement="right"
  >
    <n-drawer-content
      :title="
        stepReservation === 'member-list'
          ? `Member cabang ${
              allActivedBranches.find(
                (branch) => branch.value === formValue.master_branch
              ).label
            }`
          : stepReservation === 'new-member'
          ? 'Pendaftaran Anggota'
          : `Formulir Reservasi Cabang ${
              allActivedBranches.find(
                (branch) => branch.value === formValue.master_branch
              ).label
            }`
      "
    >
      <div
        v-if="stepReservation === 'member-list'"
        class="flex items-center justify-end"
      >
        <n-button
          type="primary"
          class="font-belanosima-400"
          :size="isMobile ? 'tiny' : 'medium'"
          @click="memberBaruHandler"
        >
          Member Baru
        </n-button>
      </div>
      <AdminMasterMemberList
        v-if="stepReservation === 'member-list'"
        :origin-mode="originStepReservation"
        :id-branch="formValue.master_branch"
        @member-reservation="selectedMemberReservation"
      />
      <AdminMasterMemberCreate
        v-if="stepReservation === 'new-member'"
        :origin-mode="originStepReservation"
        :id-branch="formValue.master_branch"
        @back-step-reservation="changeMemberHandler"
        @member-reservation="selectedMemberReservation"
      />
      <AdminTransactionSoccerTransactionForm
        v-if="
          stepReservation === 'reservation' ||
          stepReservation === 'payment' ||
          stepReservation === 'edit' ||
          stepReservation === 'cancel' ||
          stepReservation === 'view'
        "
        :selected-member="selectedMember"
        :selected-schedule="selectedSchedule"
        :id-branch="formValue.master_branch"
        :step-reservation="stepReservation"
        :transaction-data="selectedTransactionData"
        @back-step-reservation="changeMemberHandler"
        @refresh-soccer-schedule="
          ({ transactionType }) => {
            getAvailability();
            if (transactionType > 0) {
              selectedPackageTransactionId = transactionType;
              stepReservation = 'viewPackageSchedule';
            }
          }
        "
        @close-drawer="closeDrawer"
      />
      <AdminTransactionSoccerMenuBox
        v-if="
          stepReservation === 'pending-menu' || stepReservation === 'paid-menu'
        "
        :step-reservation="stepReservation"
        :selected-schedule="selectedSchedule"
        @menu-handler="selectedMenuHandler"
      />

      <AdminTransactionSoccerPackageSchedule
        v-if="stepReservation === 'viewPackageSchedule'"
        :package-transaction-id="selectedPackageTransactionId"
        @close-drawer="closeDrawer"
      />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import moment from "moment";
import refreshCircle from "~icons/ion/refresh-circle";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { SoccerDailyAvailabilityInterface } from "~/composables/api/admin/transaction/soccer-transaction-interface";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";
import { APIMasterAvailability } from "~/composables/api/admin/master/master-availability";
import { APISoccerTransaction } from "~/composables/api/admin/transaction/soccer-transaction";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const UserStoreInstance = UserStore();

// User Roles

const formValue = reactive({
  master_branch: 0,
  date: Date.now(),
});

const showDrawer = ref(false);

const allActivedBranches = ref([]);
const soccerDailyAvailability = reactive<SoccerDailyAvailabilityInterface>({
  master_availability: 0,
  status: null,
  rateName: null,
  rateAvailability: [],
});

const selectedPackageTransactionId = ref(0);

onMounted(async () => {
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

  getAvailability();
});

const clearSoccerDailyAvailability = () => {
  Object.keys(soccerDailyAvailability).forEach((key) => {
    if (Array.isArray(soccerDailyAvailability[key]))
      soccerDailyAvailability[key] = [];
    else soccerDailyAvailability[key] = null;
  });
};

const getAvailability = async () => {
  clearSoccerDailyAvailability();
  const responseDailyAvailability = await APIMasterAvailability(
    "getDailyAvailability",
    null,
    {
      branchId: formValue.master_branch,
      date: moment(formValue.date).format("YYYY-MM-DD"),
    }
  );

  if (responseDailyAvailability.status === 200) {
    Object.keys(responseDailyAvailability.response).forEach((key) => {
      soccerDailyAvailability[key] = responseDailyAvailability.response[key];
    });
  }
};

const selectedSchedule = ref(null);

const availabilitySelectedHandler = async (schedule) => {
  if (schedule.status === "available") {
    stepReservation.value = "member-list";
  } else if (schedule.reservedBy?.status === "pending")
    stepReservation.value = "pending-menu";
  else stepReservation.value = "paid-menu";

  let responseHeaderTransaction = null;

  if (schedule.status !== "available") {
    responseHeaderTransaction = await APISoccerTransaction(
      "getHeaderTransaction",
      null,
      { idHeader: schedule.reservedBy.id_header }
    );
  }

  selectedSchedule.value = {
    date: formValue.date,
    master_availability: soccerDailyAvailability.master_availability,
    schedule,
    rateAvailability: soccerDailyAvailability.rateAvailability,
    package: responseHeaderTransaction
      ? responseHeaderTransaction.response.soccer_package_transaction.data
        ? true
        : false
      : false,
  };

  showDrawer.value = true;
};

const stepReservation = ref("member-list");
const selectedMember = reactive({
  id: "",
  name: "",
  code: "",
  address: "",
  hp: "",
  city: "",
  note: "",
  blacklist: false,
});

const originStepReservation = ref("reservation");

const changeMemberHandler = (originStep) => {
  originStepReservation.value = originStep;
  stepReservation.value = "member-list";
};

const selectedMemberReservation = ({ member, mode }) => {
  stepReservation.value = mode;
  Object.keys(selectedMember).forEach((key) => {
    selectedMember[key] = member[key];
  });
};

const memberBaruHandler = () => {
  stepReservation.value = "new-member";
};

const selectedTransactionData = ref(null);

const selectedMenuHandler = async (menuOption) => {
  const responseHeaderTransaction = await APISoccerTransaction(
    "getHeaderTransaction",
    null,
    { idHeader: selectedSchedule.value.schedule.reservedBy.id_header }
  );

  if (responseHeaderTransaction.status === 200) {
    selectedTransactionData.value = responseHeaderTransaction.response;
    stepReservation.value = menuOption;
    Object.keys(selectedMember).forEach((key) => {
      selectedMember[key] =
        responseHeaderTransaction.response.master_member.data.attributes[key];
    });
    selectedMember.id =
      responseHeaderTransaction.response.master_member.data.id;
  }
};

const closeDrawer = () => {
  showDrawer.value = false;
};
</script>

<style scoped>
.boxInner:hover {
  -webkit-transform: scale(1.1);
  -moz-transform: scale(1.1);
  -ms-transform: scale(1.1);
  -o-transform: scale(1.1);
  transform: scale(1.1);
}

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
