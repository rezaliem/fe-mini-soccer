<template>
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
    </n-grid>
  </n-form>
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
        <th class="font-belanosima-400" style="width: 10%">No Nota</th>
        <th class="font-belanosima-400" style="width: 10%">Tanggal</th>
        <th class="font-belanosima-400" style="width: 10%">Jam</th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="font-belanosima-400"
        v-for="(pack, index) in selectedSchedulePackage"
        :key="index"
      >
        <td>
          {{ pack.receiptNo }}
        </td>
        <td>
          {{ moment(pack.dateReservation).format("DD-MM-YYYY") }}
        </td>
        <td>
          <n-tag
            v-for="(detail, subIndex) in pack.detail_soccer_transactions.data"
            :key="subIndex"
            size="small"
            class="ml-1 mb-1"
            :type="subIndex % 2 === 0 ? 'success' : 'info'"
          >
            {{ `${detail.attributes.hour}:00` }}
          </n-tag>
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
  <n-button
    class="mt-2"
    dashed
    type="primary"
    :size="isMobile ? 'tiny' : 'medium'"
    @click="closeHandler"
  >
    Tutup
  </n-button>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import moment from "moment";
import { useGeneralStore } from "~/store/general";
import { APISoccerTransaction } from "~/composables/api/admin/transaction/soccer-transaction";

const UseGeneralStore = useGeneralStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const props = defineProps({
  packageTransactionId: {
    type: Number,
    default: 0,
  },
});

const selectedSchedulePackage = ref([]);
const selectedMember = reactive({
  name: "",
  code: "",
});

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
});

const emit = defineEmits(["closeDrawer"]);

onMounted(async () => {
  pageChangeHandler();
});
const pageChangeHandler = async () => {
  const responseSoccerTransaction = await APISoccerTransaction(
    "getTransactionByReceiptNo",
    null,
    {
      packageTransactionId: props.packageTransactionId,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }
  );

  if (responseSoccerTransaction.status) {
    selectedSchedulePackage.value = responseSoccerTransaction.response;
    selectedMember.name =
      responseSoccerTransaction.response[0].master_member.data.attributes.name;
    selectedMember.code =
      responseSoccerTransaction.response[0].master_member.data.attributes.code;
    pagination.pageCount = responseSoccerTransaction.meta.pagination.pageCount;
  }
};

const closeHandler = () => {
  emit("closeDrawer");
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
