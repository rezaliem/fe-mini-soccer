import ApiService from "~~/services/api.service";

export const MasterBranchService = {
  async getAllMasterBranch(payload, { page, pageSize }) {
    return await ApiService.v1().get(
      `master-branches?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
  },

  async getActivedMasterBranch() {
    return await ApiService.v1().get(
      `master-branches?filters[active][$eq]=true`
    );
  },

  async getAllMasterBranchDDL() {
    return await ApiService.v1().get(`master-branches`);
  },

  async getSelectedMasterBranch(payload, id) {
    return await ApiService.v1().get(`master-branches/${id}`);
  },

  async putSelectedMasterBranch(payload, id) {
    return await ApiService.v1().put(`master-branches/${id}`, payload);
  },

  async postNewMasterBranch(payload) {
    return await ApiService.v1().post(`master-branches`, payload);
  },
};
