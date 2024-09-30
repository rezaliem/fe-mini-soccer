import ApiService from "~~/services/api.service";

export const MasterPackageService = {
  async getAllMasterPackage(payload, { page, pageSize }) {
    return await ApiService.v1().get(
      `master-packages?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
  },

  async getActivedMasterPackage() {
    return await ApiService.v1().get(
      `master-packages?filters[active][$eq]=true`
    );
  },

  async getSelectedMasterPackage(payload, id) {
    return await ApiService.v1().get(`master-packages/${id}`);
  },

  async putSelectedMasterPackage(payload, id) {
    return await ApiService.v1().put(`master-packages/${id}`, payload);
  },

  async postNewMasterPackage(payload) {
    return await ApiService.v1().post(`master-packages`, payload);
  },
};
