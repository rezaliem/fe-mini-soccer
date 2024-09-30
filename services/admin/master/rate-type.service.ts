import ApiService from "~~/services/api.service";

export const MasterRateTypeService = {
  async getAllMasterRateType(payload, { page, pageSize }) {
    return await ApiService.v1().get(
      `master-rate-types?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
  },

  async getActivedMasterRateType() {
    return await ApiService.v1().get(
      `master-rate-types?filters[active][$eq]=true`
    );
  },

  async getSelectedMasterRateType(payload, id) {
    return await ApiService.v1().get(`master-rate-types/${id}`);
  },

  async putSelectedMasterRateType(payload, id) {
    return await ApiService.v1().put(`master-rate-types/${id}`, payload);
  },

  async postNewMasterRateType(payload) {
    return await ApiService.v1().post(`master-rate-types`, payload);
  },
};
