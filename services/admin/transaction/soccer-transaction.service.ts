import ApiService from "~~/services/api.service";

export const SoccerTransactionService = {
  async getHeaderTransaction(payload, { idHeader }) {
    return await ApiService.v1().get(
      `header-soccer-transactions/${idHeader}?populate[2]=soccer_package_transaction&populate[0]=master_member&populate[1]=detail_soccer_transactions`
    );
  },

  async getTransactionByReceiptNo(
    payload,
    { packageTransactionId, page, pageSize }
  ) {
    return await ApiService.v1().get(
      `header-soccer-transactions?filters[$and][0][soccer_package_transaction][id][$eq]=${packageTransactionId}&filters[$and][1][status][$eq]=paid&populate[0]=detail_soccer_transactions&populate[1]=soccer_package_transaction&populate[2]=master_member&pagination[page]=${page}&pagination[pageSize]=${pageSize}`
    );
  },

  async createSoccerTransaction(payload) {
    return await ApiService.v1().post(
      `header-soccer-transaction/create-soccer-transaction`,
      payload
    );
  },

  async updateSoccerTransaction(payload, { idHeader }) {
    return await ApiService.v1().put(
      `header-soccer-transaction/update-soccer-transaction/${idHeader}`,
      payload
    );
  },
  async updatePayment(payload, { idHeader }) {
    return await ApiService.v1().put(
      `header-soccer-transactions/${idHeader}`,
      payload
    );
  },
};
