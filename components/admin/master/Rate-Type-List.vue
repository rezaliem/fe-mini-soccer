<template>
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
        <th class="font-belanosima-400" style="width: 10%">Nama</th>
        <th v-if="!isMobile" class="font-belanosima-400" style="width: 20%">
          Jadwal
        </th>
        <th class="font-belanosima-400" style="width: 10%">Active</th>
        <th class="font-belanosima-400" style="width: 10%">Detail</th>
      </tr>
    </thead>
    <tbody>
      <n-skeleton v-if="isLoading" class="mt-1" />
      <tr
        v-else
        class="font-belanosima-400"
        v-for="(rateType, index) in allRateType"
        :key="index"
      >
        <td>
          {{ rateType.name }}
        </td>
        <td v-if="!isMobile">
          <n-tag
            v-for="(schedule, subIndex) in rateType.schedules"
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
          {{ rateType.active ? "YA" : "TIDAK" }}
        </td>
        <td>
          <n-button
            v-if="isAllowedUpdateRateType"
            type="primary"
            :size="isMobile ? 'tiny' : 'small'"
            @click="detailHandler(rateType.id)"
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
import debounce from "lodash.debounce";
import Eye from "~icons/ion/eye";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { APIMasterRateType } from "~/composables/api/admin/master/master-rate-type";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const isLoading = ref(false);

let allRateType = ref([]);

const isAllowedUpdateRateType = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "updateMasterRate")
    ? true
    : false;
});

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
});

onMounted(() => {
  pageChangeHandler();
});

const pageChangeHandler = async () => {
  isLoading.value = true;
  const responseAllMasterBranches = await APIMasterRateType(
    "getAllMasterRateType",
    null,
    { page: pagination.page, pageSize: pagination.pageSize }
  );

  if (responseAllMasterBranches.status === 200) {
    allRateType.value = responseAllMasterBranches.response;

    pagination.pageCount = responseAllMasterBranches.meta.pagination.pageCount;
  }
  isLoading.value = false;
};

const detailHandler = (id) => {
  navigateTo(`/admin/master/rate/${id}`);
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
