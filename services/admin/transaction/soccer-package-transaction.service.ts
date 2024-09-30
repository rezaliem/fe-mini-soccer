import ApiService from "~~/services/api.service";

export const SoccerPackageTransactionService = {
  async getSoccerPackageTransaction(
    payload,
    { id, startDate, endDate, page, pageSize }
  ) {
    return await ApiService.v1().get(
      `soccer-package-transactions?filters[master_member][master_branch][id][$eq]=${id}&filters[date][$gte]=${startDate}&filters[date][$lte]=${endDate}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate[master_member][fields][0]=name&populate[master_package][fields][1]=name`,
      payload
    );
  },

  async getSoccerPackageTransactionByIdMember(payload, { id }) {
    return await ApiService.v1().get(
      `soccer-package-transactions?filters[master_member][id][$eq]=${id}&populate[0]=master_package&filters[active][$eq]=true&filters[hourLeft][$gt]=0`
    );
  },

  async getSoccerPackageTransactionByIdTransaction(payload, { idTransaction }) {
    return await ApiService.v1().get(
      `soccer-package-transactions/${idTransaction}?populate[0]=master_member&populate[1]=master_package`
    );
  },

  async getSoccerPackageTransactionEnableEdit(
    payload,
    { idPackageTransaction }
  ) {
    return await ApiService.v1().get(
      `soccer-package-transaction/check-package-transaction/${idPackageTransaction}`
    );
  },

  async createSoccerPackageTransaction(payload) {
    return await ApiService.v1().post(
      `soccer-package-transaction/create-soccer-package-transaction`,
      payload
    );
  },

  async updateSoccerPackageTransaction(payload, { idPackageTransaction }) {
    return await ApiService.v1().put(
      `soccer-package-transactions/${idPackageTransaction}`,
      payload
    );
  },

  async cancelSoccerPackageTransaction(payload, { idHeader }) {
    return await ApiService.v1().put(
      `header-soccer-transaction/cancel-package-soccer-transaction/${idHeader}`,
      payload
    );
  },
};
