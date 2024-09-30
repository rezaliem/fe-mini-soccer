import ApiService from "~~/services/api.service";

export const MasterMemberService = {
  async getAllMasterMember(payload, { page, pageSize }) {
    return await ApiService.v1().get(
      `master-members?pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
  },

  async getFilteredActiveMember(payload, { keyMember, page, pageSize }) {
    return await ApiService.v1().get(
      `master-members?filters[$or][0][name][$containsi]=${keyMember}&filters[$or][1][code][$containsi]=${keyMember}&filters[$or][2][hp][$containsi]=${keyMember}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=name`
    );
  },

  async getAllMasterMemberByBranch(payload, { page, pageSize, idBranch }) {
    return await ApiService.v1().get(
      `master-members?pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[$and][0][master_branch][id][$eq]=${idBranch}`
    );
  },

  async getFilteredActiveMemberByBranch(
    payload,
    { keyMember, page, pageSize, idBranch }
  ) {
    return await ApiService.v1().get(
      `master-members?filters[$or][0][name][$containsi]=${keyMember}&filters[$or][1][code][$containsi]=${keyMember}&filters[$or][2][hp][$containsi]=${keyMember}&filters[$and][3][master_branch][id][$eq]=${idBranch}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=name`
    );
  },

  async getSelectedMasterMember(payload, id) {
    return await ApiService.v1().get(
      `master-members/${id}?populate[master_branch][fields][0]=id`
    );
  },

  async postNewMasterMember(payload) {
    return await ApiService.v1().post(`master-member/create-member`, payload);
  },

  async putSelectedMasterMember(payload, id) {
    return await ApiService.v1().put(`master-members/${id}`, payload);
  },
};
