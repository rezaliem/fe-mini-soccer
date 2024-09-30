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
      <div
        class="font-belanosima-400 flex items-center justify-between"
        style="font-size: 20px"
      >
        Transaksi Paket Soccer
        <n-button
          v-if="isAllowCreateSoccerPackage"
          type="primary"
          class="ml-2"
          :size="isMobile ? 'tiny' : 'medium'"
          @click="createPackageHandler"
        >
          <Document />
          Transaksi Paket Baru
        </n-button>
      </div>
      <div class="flex items-center justify-between">
        <n-form :label-width="80" :model="formValue">
          <n-grid :cols="isMobile ? 1 : 4" :x-gap="24">
            <n-form-item-gi label="Cabang">
              <n-select
                v-model:value="formValue.master_branch"
                placeholder="Pilih Cabang"
                :options="allActivedBranches"
                @update:value="
                  () => {
                    pagination.page = 1;
                    pageChangeHandler();
                  }
                "
              />
            </n-form-item-gi>
            <n-form-item-gi label="Tanggal">
              <n-date-picker
                v-model:value="formValue.date"
                type="daterange"
                format="dd-MM-yyyy"
                :class="isMobile ? 'mt-2' : 'ml-2'"
                style="width: 300px"
                @update:value="
                  () => {
                    pagination.page = 1;
                    pageChangeHandler();
                  }
                "
              />
            </n-form-item-gi>
          </n-grid>
        </n-form>
      </div>

      <n-table
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
            <th class="font-belanosima-400" style="width: 10%">Tanggal</th>
            <th v-if="!isMobile" class="font-belanosima-400" style="width: 10%">
              Nota
            </th>
            <th class="font-belanosima-400" style="width: 10%">Member</th>
            <th class="font-belanosima-400" style="width: 10%">Paket</th>
            <th class="font-belanosima-400" style="width: 10%">Harga</th>
            <th class="font-belanosima-400" style="width: 10%">Active</th>
            <th class="font-belanosima-400" style="width: 10%">Detail</th>
          </tr>
        </thead>
        <tbody>
          <n-skeleton v-if="isLoading" class="mt-1" />
          <tr
            v-else
            class="font-belanosima-400"
            v-for="(transaction, index) in packageTransactionData"
            :key="index"
          >
            <td>
              {{ transaction.date }}
            </td>
            <td v-if="!isMobile">
              {{ transaction.receiptNo }}
            </td>
            <td>
              {{ transaction.master_member.data.attributes.name }}
            </td>
            <td>
              <div>
                {{ transaction.master_package.data.attributes.name }}
              </div>
              <div class="font-quicksand-400">
                {{ `Sisa ${transaction.hourLeft} Jam` }}
              </div>
            </td>
            <td>
              {{ `Rp. ${transaction.price.toLocaleString("en-AU")}` }}
            </td>

            <td>
              {{ transaction.active ? "YA" : "TIDAK" }}
            </td>
            <td>
              <n-button
                v-if="isAllowUpdateSoccerPackage"
                type="primary"
                :size="isMobile ? 'tiny' : 'small'"
                @click="detailHandler(transaction.id)"
              >
                <Eye />
              </n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
      <div class="mt-1 flex justify-end">
        <n-pagination
          v-model:page="pagination.page"
          :page-count="pagination.pageCount"
          @update:page="pageChangeHandler"
        />
      </div>
    </div>

    <n-drawer
      v-model:show="showDrawer"
      :width="isMobile ? '85%' : stepPackage === 'member-list' ? '60%' : '40%'"
      placement="right"
    >
      <n-drawer-content
        :title="
          stepPackage === 'member-list'
            ? `Member cabang ${
                allActivedBranches.find(
                  (branch) => branch.value === formValue.master_branch
                ).label
              }`
            : stepPackage === 'new-member'
            ? 'Pendaftaran Anggota'
            : `Formulir Transaksi Paket ${
                allActivedBranches.find(
                  (branch) => branch.value === formValue.master_branch
                ).label
              }`
        "
      >
        <div
          v-if="stepPackage === 'member-list'"
          class="flex items-center justify-end"
        >
          <n-button
            type="primary"
            class="font-belanosima-400"
            :size="isMobile ? 'tiny' : 'medium'"
            @click="newMemberHandler"
          >
            Member Baru
          </n-button>
        </div>
        <AdminMasterMemberList
          v-if="stepPackage === 'member-list'"
          :origin-mode="originStepReservation"
          :id-branch="formValue.master_branch"
          @member-reservation="selectedMemberHandler"
        />
        <AdminMasterMemberCreate
          v-if="stepPackage === 'new-member'"
          :origin-mode="originStepReservation"
          :id-branch="formValue.master_branch"
          @back-step-reservation="backStepHandler"
          @member-reservation="selectedMemberHandler"
        />
        <AdminTransactionSoccerPackageForm
          v-if="
            stepPackage === 'package-transaction' ||
            stepPackage === 'view' ||
            stepPackage === 'edit' ||
            stepPackage === 'cancel'
          "
          :step-package="stepPackage"
          :selectedMember="selectedMemberPackageTransaction"
          :package-transaction-data="selectedPackageTransactionData"
          @back-step-package="backStepHandler"
          @close-drawer="closeDrawer"
          @refresh-soccer-package-transaction="pageChangeHandler"
        />
        <AdminTransactionSoccerPackageMenuBox
          v-if="stepPackage === 'view-menu'"
          :id-package-transaction="selectedPackageIdTransaction"
          @menu-handler="selectedMenuHandler"
        />
      </n-drawer-content>
    </n-drawer>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGeneralStore } from "~/store/general";
import Document from "~icons/ion/document";
import Eye from "~icons/ion/eye";
import moment from "moment";
import { UserStore } from "~/store/admin/user/user.store";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";
import { MasterMemberInterface } from "~/composables/api/admin/master/member-interface";
import { APISoccerPackageTransaction } from "~/composables/api/admin/transaction/soccer-package";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const isAllowCreateSoccerPackage = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "insertSoccerPackage")
    ? true
    : false;
});

const isAllowUpdateSoccerPackage = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "updateSoccerPackage")
    ? true
    : false;
});

definePageMeta({
  layout: false,
  middleware: ["auth"],
});

const stepPackage = ref("member-list");
const originStepReservation = ref("package-transaction");
const showDrawer = ref(false);
const allActivedBranches = ref([]);

const formValue = reactive({
  master_branch: 0,
  date: <[number, number]>[Date.now(), Date.now()],
});

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

  pageChangeHandler();
});

const createPackageHandler = () => {
  stepPackage.value = "member-list";
  showDrawer.value = true;
};

const selectedMemberPackageTransaction = reactive<MasterMemberInterface>({
  address: "",
  blacklist: false,
  city: "",
  code: "",
  hp: "",
  id: 0,
  initial: "",
  master_branch: 0,
  name: "",
  note: "",
  users_permissions_user: 0,
});

const selectedMemberHandler = ({ member, mode }) => {
  stepPackage.value = mode;
  Object.keys(selectedMemberPackageTransaction).forEach((key) => {
    if (member[key]) selectedMemberPackageTransaction[key] = member[key];
  });
};

const closeDrawer = () => {
  showDrawer.value = false;
};
const newMemberHandler = () => {
  stepPackage.value = "new-member";
};

const backStepHandler = ({ originMode }) => {
  originStepReservation.value = originMode;
  stepPackage.value = "member-list";
};

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
});
const isLoading = ref(false);

const packageTransactionData = ref([]);

const pageChangeHandler = async () => {
  isLoading.value = true;
  const responseAvailability = await APISoccerPackageTransaction(
    "getSoccerPackageTransaction",
    null,
    {
      id: formValue.master_branch,
      startDate: moment(formValue.date[0]).format("YYYY-MM-DD"),
      endDate: moment(formValue.date[1]).format("YYYY-MM-DD"),
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
  );

  if (responseAvailability.status === 200) {
    packageTransactionData.value = responseAvailability.response;
    pagination.pageCount = responseAvailability.meta.pagination.pageCount;
  }
  isLoading.value = false;
};

const selectedPackageIdTransaction = ref(0);
const selectedPackageTransactionData = ref(null);

const detailHandler = (idTransaction) => {
  selectedPackageIdTransaction.value = idTransaction;
  stepPackage.value = "view-menu";
  showDrawer.value = true;
};

const selectedMenuHandler = async (menuOption) => {
  const responsePackageTransaction = await APISoccerPackageTransaction(
    "getSoccerPackageTransactionByIdTransaction",
    null,
    { idTransaction: selectedPackageIdTransaction.value }
  );

  if (responsePackageTransaction.status === 200) {
    Object.keys(selectedMemberPackageTransaction).forEach((key) => {
      selectedMemberPackageTransaction[key] =
        responsePackageTransaction.response.master_member.data.attributes[key];
    });
    selectedMemberPackageTransaction.id =
      responsePackageTransaction.response.master_member.data.id;

    selectedPackageTransactionData.value = responsePackageTransaction.response;
  }
  stepPackage.value = menuOption;
};
</script>

<style scoped>
table {
  table-layout: fixed;
}

th {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  color: white;
  background: #b0914f;
}

.font-belanosima-400 {
  font-family: "belanosima", sans-serif;
  font-weight: 400;
}
.font-quicksand-400 {
  font-family: "quicksand", sans-serif;
  font-weight: 400;
}
</style>
