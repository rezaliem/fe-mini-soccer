import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { MasterBranchService } from "~/services/admin/master/branch.service";

export const APIMasterBranch = async (serviceName, payload, queryParams) => {
  try {
    const responseRateAvailability = await MasterBranchService[serviceName](
      payload,
      queryParams
    );

    return {
      status: 200,
      response: formattedResponse(responseRateAvailability),
      meta: responseRateAvailability.meta,
    };
  } catch (error) {
    return {
      status: 400,
      response: extractErrorMessage(error),
    };
  }
};
