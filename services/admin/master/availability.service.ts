import ApiService from "~~/services/api.service";

export const MasterAvailabilityService = {
  async getSelectedAvailabilityByBranch(
    payload,
    { id, startDate, endDate, page, pageSize }
  ) {
    if (id > 0)
      return await ApiService.v1().get(
        `master-availabilities?filters[master_branch][id][$eq]=${id}&filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[master_rate_type][fields][0]=name&populate[master_rate_type][fields][1]=schedules&populate[master_branch][fields][2]=name&sort[0]=date`
      );
    else
      return await ApiService.v1().get(
        `master-availabilities?filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[master_rate_type][fields][0]=name&populate[master_rate_type][fields][1]=schedules&populate[master_branch][fields][2]=name&sort[0]=date`
      );
  },

  async getSelectedMasterAvailability(payload, id) {
    return await ApiService.v1().get(
      `master-availabilities/${id}?populate[master_rate_type][fields][0]=name&populate[master_rate_type][fields][1]=schedules&populate[master_branch][fields][2]=name`
    );
  },

  async getDailyAvailability(payload, { branchId, date }) {
    return await ApiService.v1().get(
      `master-availability/get-daily-availability?master-branch=${branchId}&date=${date}`
    );
  },

  async postNewMasterAvailability(payload) {
    return await ApiService.v1().post(
      `master-availability/create-availability`,
      payload
    );
  },
};
