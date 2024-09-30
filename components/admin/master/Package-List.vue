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
        <th class="font-belanosima-400" style="width: 20%">Nama</th>
        <th class="font-belanosima-400" style="width: 20%">Harga</th>
        <th class="font-belanosima-400" style="width: 20%">Total Jam</th>
        <th class="font-belanosima-400" style="width: 10%">Active</th>
        <th class="font-belanosima-400" style="width: 10%">Detail</th>
      </tr>
    </thead>
    <tbody>
      <n-skeleton v-if="isLoading" class="mt-1" />
      <tr
        v-else
        class="font-belanosima-400"
        v-for="(pack, index) in allPackages"
        :key="index"
      >
        <td>
          {{ pack.name }}
        </td>
        <td>
          {{ `Rp. ${pack.price.toLocaleString("en-AU")}` }}
        </td>
        <td>
          {{ `${pack.totalHours} Jam` }}
        </td>
        <td>
          {{ pack.active ? "YA" : "TIDAK" }}
        </td>
        <td>
          <n-button
            v-if="isAllowedUpdatePackage"
            type="primary"
            :size="isMobile ? 'tiny' : 'small'"
            @click="detailHandler(pack.id)"
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
import Eye from "~icons/ion/eye";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";
import { APIMasterPackage } from "~/composables/api/admin/master/master-package";
import { GeneralFunction } from "~/composables/general";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const isLoading = ref(false);

let allPackages = ref([]);

const isAllowedUpdatePackage = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "updateMasterPackage")
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
  const responseAllMasterPackage = await APIMasterPackage(
    "getAllMasterPackage",
    null,
    { page: pagination.page, pageSize: pagination.pageSize }
  );

  if (responseAllMasterPackage.status === 200) {
    allPackages.value = responseAllMasterPackage.response;

    pagination.pageCount = responseAllMasterPackage.meta.pagination.pageCount;
  }
  isLoading.value = false;
};

const detailHandler = (id) => {
  navigateTo(`/admin/master/package/${id}`);
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
