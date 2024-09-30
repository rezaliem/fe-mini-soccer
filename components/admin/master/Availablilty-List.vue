<template>
  <div class="mt-3" :class="isMobile ? '' : 'flex'">
    <n-select
      v-model:value="selectedBranch"
      placeholder="Pilih Cabang"
      :options="allBranches"
      style="width: 300px"
      @update:value="
        () => {
          pagination.page = 1;
          pageChangeHandler();
        }
      "
    />
    <n-date-picker
      v-model:value="date"
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
        <th class="font-belanosima-400" style="width: 10%">Cabang</th>
        <th class="font-belanosima-400" style="width: 10%">Date</th>
        <th class="font-belanosima-400" style="width: 10%">Status</th>
        <th class="font-belanosima-400" :style="isMobile ? 'width: 20%' : ''">
          Tipe Harga
        </th>
        <th class="font-belanosima-400" style="width: 10%">Detail</th>
      </tr>
    </thead>
    <tbody>
      <n-skeleton v-if="isLoading" class="mt-1" />
      <tr
        v-else
        class="font-belanosima-400"
        v-for="(availability, index) in allAvailability"
        :key="index"
      >
        <td>
          {{ availability.master_branch.data.attributes.name }}
        </td>
        <td>
          {{ availability.date }}
        </td>

        <td>
          {{ availability.open ? "BUKA" : "TUTUP" }}
        </td>
        <td>
          <div>
            {{
              availability.open
                ? availability.master_rate_type.data.attributes.name
                : "-"
            }}
          </div>
          <n-tag
            v-if="availability.open && !isMobile"
            v-for="(schedule, subIndex) in availability.master_rate_type.data
              .attributes.schedules"
            :key="subIndex"
            size="small"
            class="ml-1 mb-1"
            :type="subIndex % 2 === 0 ? 'success' : 'info'"
          >
            {{
              `${schedule.time}:00 Rp. ${schedule.price.toLocaleString(
                "en-AU"
              )}`
            }}
          </n-tag>
        </td>
        <td>
          <n-button
            v-if="isAllowedUpdateAvailability"
            type="primary"
            :size="isMobile ? 'tiny' : 'small'"
            @click="detailHandler(availability.id)"
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
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import moment from "moment";
import Eye from "~icons/ion/eye";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";
import { APIMasterAvailability } from "~/composables/api/admin/master/master-availability";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const isLoading = ref(false);

let allBranches = ref([]);
let allAvailability = ref([]);
const selectedBranch = ref(null);
const date = ref<[number, number]>([Date.now(), Date.now()]);

const emit = defineEmits([
  "refreshAvailabilityList",
  "detailAvailabilityHandler",
]);

const isAllowedUpdateAvailability = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "updateMasterAvailability")
    ? true
    : false;
});

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
});

onMounted(async () => {
  const responseActivedBranches = await APIMasterBranch(
    "getActivedMasterBranch",
    null,
    null
  );

  if (responseActivedBranches.status === 200) {
    allBranches.value = responseActivedBranches.response.map((branch) => ({
      label: branch.name,
      value: branch.id,
    }));
    allBranches.value.push({
      label: "Semua Cabang",
      value: 0,
    });
    selectedBranch.value = allBranches.value[0].value;
  }

  pageChangeHandler();

  emit("refreshAvailabilityList", refreshAvailability);
});

const pageChangeHandler = async () => {
  isLoading.value = true;
  const responseAvailability = await APIMasterAvailability(
    "getSelectedAvailabilityByBranch",
    null,
    {
      id: selectedBranch.value,
      startDate: moment(date.value[0]).format("YYYY-MM-DD"),
      endDate: moment(date.value[1]).format("YYYY-MM-DD"),
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
  );

  if (responseAvailability.status === 200) {
    allAvailability.value = responseAvailability.response;

    pagination.pageCount = responseAvailability.meta.pagination.pageCount;
  }
  isLoading.value = false;
};

const refreshAvailability = (params) => {
  date.value = params.date;
  selectedBranch.value = params.master_branch;
  pagination.page = 1;
  pageChangeHandler();
};

const detailHandler = (id) => {
  emit("detailAvailabilityHandler", id);
};
</script>

<style scoped>
.custom-hr {
  border-top: 1px solid #b0914f;
}

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
