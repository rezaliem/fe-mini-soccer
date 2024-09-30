import { defineStore } from "pinia";

export const useGeneralStore = defineStore("general", {
  state: () => {
    return {
      isMobile: false,
      language: "EN",
      navigations: [],
    };
  },

  actions: {
    setMobile(isMobile) {
      this.isMobile = isMobile;
      return this.isMobile;
    },
    setLanguage(language) {
      this.language = language;
    },
    setNavigation(navigations) {
      this.navigations = navigations;
    },
  },
});
