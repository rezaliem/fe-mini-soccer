import { defineStore } from "pinia";

export const UserStore = defineStore("user", {
  state: () => {
    return {
      userInfoDetail: {
        blocked: false,
        confirmed: true,
        email: null,
        id: 0,
        role: {
          description: null,
          id: 0,
          name: null,
          type: null,
        },
        username: null,
      },
      userActiveMenu: {},
      userActiveGranted: [],
    };
  },
  actions: {
    setUserInfoDetail(userInfo) {
      this.userInfoDetail = userInfo;
    },
    setUserActiveModule(activeModules) {
      this.userActiveModules =
        activeModules[this.userInfoDetail.role.name.toLowerCase()];
    },
    setUserActiveMenu(activeMenu) {
      this.userActiveMenu =
        activeMenu[this.userInfoDetail.role.name.toLowerCase()];
    },
    setUserActiveGranted(granted) {
      this.userActiveGranted =
        granted[this.userInfoDetail.role.name.toLowerCase()];
    },
    getUserInfoDetail() {
      return this.userInfoDetail;
    },

    getUserActiveMenu() {
      return this.userActiveMenu;
    },
    getUserActiveGranted() {
      return this.userActiveGranted;
    },
  },
});
