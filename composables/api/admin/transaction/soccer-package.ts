import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { SoccerPackageTransactionService } from "~/services/admin/transaction/soccer-package-transaction.service";

export const APISoccerPackageTransaction = async (
  serviceName,
  payload,
  queryParams
) => {
  try {
    const responseSoccerTransaction = await SoccerPackageTransactionService[
      serviceName
    ](payload, queryParams);

    return {
      status: 200,
      response: formattedResponse(responseSoccerTransaction),
      meta: responseSoccerTransaction.meta,
    };
  } catch (error) {
    return {
      status: 400,
      response: extractErrorMessage(error),
      details: error.response?._data?.error?.details,
    };
  }
};
