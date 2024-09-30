<template>
  <div
    :class="isMobile ? 'flex-cols' : 'flex'"
    :style="
      isMobile
        ? 'font-size: 7px; margin-top:3px;'
        : 'font-size:14px; margin-top: 5px'
    "
  >
    <n-select
      v-if="originMode === 'master-member'"
      v-model:value="selectedBranch"
      placeholder="Pilih Cabang"
      :options="allActivedBranches"
      :style="!isMobile ? 'width: 200px' : 'width: 100%'"
      @update:value="
        () => {
          pagination.page = 1;
          pageChangeHandler();
        }
      "
    />

    <n-input
      :class="
        isMobile &&
        (originMode === 'master-member' || originMode === 'package-transaction')
          ? 'mt-2'
          : ''
      "
      class="font-belanosima-400 ml-2"
      v-model:value="memberKeySearch"
      @keyup="() => debounceInput()"
    ></n-input>
  </div>
  <n-table
    id="table-member"
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
        <th class="font-belanosima-400" style="width: 15%">Kode / Nama</th>
        <th class="font-belanosima-400" style="width: 20%">Alamat</th>
        <th class="font-belanosima-400" style="width: 10%">HP</th>
        <th v-if="!isMobile" class="font-belanosima-400" style="width: 20%">
          Catatan
        </th>
        <th class="font-belanosima-400" style="width: 10%">Blacklist</th>
        <th
          v-if="originMode === 'master-member'"
          class="font-belanosima-400"
          style="width: 5%"
        >
          Detail
        </th>
      </tr>
    </thead>
    <tbody>
      <n-skeleton v-if="isLoading" class="mt-1" />
      <tr
        v-else
        class="font-belanosima-200"
        v-for="(member, index) in allMembers"
        :key="index"
        style="cursor: pointer"
        @click="selectedMemberReservation(member)"
      >
        <td>
          <div>{{ member.code }}</div>
          <div>
            {{ member.name }}
          </div>
        </td>
        <td>
          <div>
            {{ member.address }}
          </div>
          <div>
            {{ member.city }}
          </div>
        </td>
        <td>
          {{ member.hp }}
        </td>
        <td v-if="!isMobile">
          {{ member.note }}
        </td>
        <td>
          {{ member.blacklist ? "YA" : "TIDAK" }}
        </td>
        <td v-if="originMode === 'master-member'">
          <n-button
            v-if="isAllowedUpdateMember"
            type="primary"
            :size="isMobile ? 'tiny' : 'small'"
            @click="detailHandler(member.id)"
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
import { APIMasterMember } from "~/composables/api/admin/master/master-member";
import { APIMasterBranch } from "~/composables/api/admin/master/master-branch";

const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();
const { isMobile } = storeToRefs(UseGeneralStore);

const isLoading = ref(false);

let allMembers = ref([]);

const isAllowedUpdateMember = computed(() => {
  const grantedList = UserStoreInstance.getUserActiveGranted();
  return grantedList.find((action) => action === "updateMasterMember")
    ? true
    : false;
});

const pagination = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
});

const memberKeySearch = ref(null);

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
const allActivedBranches = ref([]);
const selectedBranch = ref(0);

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
    selectedBranch.value =
      props.originMode === "master-member"
        ? allActivedBranches.value[0].value
        : props.idBranch;
  }

  pageChangeHandler();
});

const debounceInput = debounce(() => {
  pagination.page = 1;
  pageChangeHandler();
}, 1000);

const pageChangeHandler = async () => {
  isLoading.value = true;
  let responseAllMasterMembers;

  // if (
  //   props.originMode !== "reservation" &&
  //   props.originMode !== "edit" &&
  //   props.originMode !== "packageTransaction"
  // )
  //   responseAllMasterMembers = await APIMasterMember(
  //     memberKeySearch.value !== null && memberKeySearch.value !== ""
  //       ? "getFilteredActiveMember"
  //       : "getAllMasterMember",
  //     null,
  //     {
  //       keyMember: memberKeySearch.value,
  //       page: pagination.page,
  //       pageSize: pagination.pageSize,
  //     }
  //   );
  // else
  responseAllMasterMembers = await APIMasterMember(
    memberKeySearch.value !== null && memberKeySearch.value !== ""
      ? "getFilteredActiveMemberByBranch"
      : "getAllMasterMemberByBranch",
    null,
    {
      keyMember: memberKeySearch.value,
      page: pagination.page,
      pageSize: pagination.pageSize,
      idBranch: selectedBranch.value,
    }
  );

  if (responseAllMasterMembers.status === 200) {
    allMembers.value = responseAllMasterMembers.response;

    pagination.pageCount = responseAllMasterMembers.meta.pagination.pageCount;
  }
  isLoading.value = false;
};

const detailHandler = (id) => {
  navigateTo(`/admin/master/member/${id}`);
};

const emit = defineEmits(["memberReservation", "refreshMemberList"]);

const selectedMemberReservation = (member) => {
  if (
    props.originMode === "reservation" ||
    props.originMode === "edit" ||
    props.originMode === "package-transaction"
  ) {
    emit("memberReservation", { member, mode: props.originMode });
  }
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

.n-drawer-container th {
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  color: white;
  background: #b0914f;
}

.n-drawer-container #table-member tr:hover td {
  background: #cccccc;
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
.font-belanosima-200 {
  font-family: "belanosima", sans-serif;
  font-weight: lighter;
}
</style>
