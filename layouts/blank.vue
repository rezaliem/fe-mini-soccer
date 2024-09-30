<template>
  <div class="h-full w-full">
    <div
      class="navbar"
      :style="
        isMobile
          ? 'padding-inline: 10px; padding-block: 5px'
          : 'padding-inline: 100px; padding-block: 5px'
      "
    >
      <n-space
        :justify="isMobile ? 'center' : 'space-between'"
        align="center"
        class="min-h-content"
      >
        <img
          v-if="!isMobile"
          src="~/assets/images/logo.png"
          alt=""
          srcset=""
          style="width: 200px; cursor: pointer"
          @click="backToHomePage"
        />

        <n-menu
          class="font-comfortaa"
          v-model:value="activeKey"
          :mode="isMobile ? 'vertical' : 'horizontal'"
          :options="menuOptions"
          style="font-size: 14px; font-weight: 200"
        />
      </n-space>
    </div>

    <n-dialog-provider>
      <n-message-provider placement="top">
        <slot />
      </n-message-provider>
    </n-dialog-provider>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { MenuOption } from "naive-ui";
import { h, Component } from "vue";
import { NButton, NIcon, NSpace, NText } from "naive-ui";
import FileTrayStacked from "~icons/ion/file-tray-stacked";
import _ from "lodash";
import Apps from "~icons/ion/apps";
import Server from "~icons/ion/server";
import Receipt from "~icons/ion/receipt";
import Exit from "~icons/ion/exit";
import { useGeneralStore } from "~/store/general";
import { UserStore } from "~/store/admin/user/user.store";

const NuxtLink = defineNuxtLink({});
const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const activeKey = ref(null);

const userIsAuthenticated = useCookie("user.isAuthenticated");
const UseGeneralStore = useGeneralStore();
const UserStoreInstance = UserStore();

const { isMobile } = storeToRefs(UseGeneralStore);

const defaultMenu = [
  {
    label: "Master",
    key: "master",
    id: 2,
    icon: renderIcon(Server),
    children: [
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/branch/branch-list",
            },
            () => "Cabang"
          ),
        key: "master-branch",
        path: "/admin/master/branch/branch-list",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/member/member-list",
            },
            () => "Member"
          ),
        key: "master-member",
        path: "/admin/master/member/member-list",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/rate/rate-type",
            },
            () => "Tipe Harga"
          ),
        key: "master-rate",
        path: "/admin/master/rate/rate-type",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/availability/availability-list",
            },
            () => "Ketersediaan"
          ),
        key: "master-availability",
        path: "/admin/master/availability/availability-list",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/package/package-list",
            },
            () => "Paket"
          ),
        key: "master-package",
        path: "/admin/master/package/package-list",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/master/password",
            },
            () => "Ganti Password"
          ),
        key: "password",
        path: "/admin/master/password",
      },
    ],
  },
  {
    label: "Transaksi",
    key: "transaction",
    id: 2,
    icon: renderIcon(Server),
    children: [
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/transaction/soccer-package-list",
            },
            () => "Paket Mini Soccer"
          ),
        key: "soccer-package",
        path: "/admin/transaction/soccer-package-list",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/transaction/soccer-transaction-list",
            },
            () => "Sewa Mini Soccer"
          ),
        key: "soccer-transaction",
        path: "/admin/transaction/soccer-transaction-list",
      },
    ],
  },
  {
    label: "Laporan",
    key: "report",
    id: 3,
    icon: renderIcon(Server),
    children: [
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/report/soccer-daily-report",
            },
            () => "Laporan Soccer Harian"
          ),
        key: "daily-soccer-report",
        path: "/admin/transaction/soccer-daily-report",
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              style: "font-family:'comfortaa'",
              to: "/admin/report/soccer-monthly-report",
            },
            () => "Laporan Soccer Bulanan"
          ),
        key: "monthly-soccer-report",
        path: "/admin/transaction/soccer-monthly-report",
      },
    ],
  },
  {
    label: () =>
      h(
        NButton,
        {
          quaternary: true,
          style: "font-size:16px",
          onClick: async () => logoutHandler(),
        },
        {
          default: () => "Log out",
        }
      ),
    key: "logOut",
    id: 99,
    icon: renderIcon(Exit),
  },
];

let menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        NuxtLink,
        {
          to: "/admin/auth/login",
        },
        () => "Admin"
      ),
    key: "admin",
    icon: renderIcon(FileTrayStacked),
  },
];

const checkMobileMode = () => {
  if (document.body.clientWidth <= 920) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
  UseGeneralStore.setMobile(isMobile.value);
};

const watchWidth = () => {
  checkMobileMode();
};

onBeforeMount(() => {
  let activeMenu = UserStoreInstance.getUserActiveMenu();

  let resultMenu = _.cloneDeep(defaultMenu);

  defaultMenu.forEach((menu) => {
    if (activeMenu[menu.key]) {
      menu.children.forEach((subMenu) => {
        const resultFind = activeMenu[menu.key].children.find(
          (children) => children === subMenu.key
        );

        if (!resultFind) {
          const indexArray = resultMenu
            .map((objKey) => objKey.key)
            .indexOf(menu.key);

          const indexChildren = resultMenu[indexArray].children
            .map((objKey) => objKey.key)
            .indexOf(subMenu.key);

          resultMenu[indexArray].children.splice(indexChildren, 1);
        }
      });
    } else if (menu.key !== "logOut") {
      const indexArray = resultMenu
        .map((objKey) => objKey.key)
        .indexOf(menu.key);
      resultMenu.splice(indexArray, 1);
    }
  });

  if (!userIsAuthenticated.value)
    menuOptions = [
      {
        label: () =>
          h(
            NuxtLink,
            {
              to: "/admin/auth/login",
            },
            () => "Admin"
          ),
        key: "admin",
        icon: renderIcon(FileTrayStacked),
      },
    ];
  else Object.assign(menuOptions, resultMenu);
});

onMounted(() => {
  checkMobileMode();

  window.addEventListener("resize", watchWidth);
});

const logoutHandler = async () => {
  let userIsAuthenticated = useCookie("user.isAuthenticated");
  userIsAuthenticated.value = "false";
  useCookie("user.token").value = null;
  await navigateTo("/admin/auth/login");
};

const backToHomePage = async () => {
  await navigateTo("/");
};
</script>

<style scoped>
.navbar {
  top: 0px;
  position: sticky;
  background-color: white;
  border-bottom: 1px solid rgb(0, 0, 0, 0.3);
  box-shadow: 3px 3px 7px rgb(0, 0, 0, 0.3);
  z-index: 99;
  opacity: 80%;
}

.nav-footer {
  height: min-content;
  background-color: #b0914f;
}
.font-comfortaa {
  font-family: "comfortaa";
}
</style>
