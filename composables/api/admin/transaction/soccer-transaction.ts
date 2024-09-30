import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { SoccerTransactionService } from "~/services/admin/transaction/soccer-transaction.service";

export const APISoccerTransaction = async (
  serviceName,
  payload,
  queryParams
) => {
  try {
    const responseSoccerTransaction = await SoccerTransactionService[
      serviceName
    ](payload, queryParams);

    return {
      status: 200,
      response: formattedResponse(responseSoccerTransaction),
      meta: responseSoccerTransaction.meta,
    };
  } catch (error) {
    console.debug(error);
    return {
      status: 400,
      response: extractErrorMessage(error),
      details: error.response?._data?.error?.details,
    };
  }
};
