import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { MasterPackageService } from "~/services/admin/master/package.service";

export const APIMasterPackage = async (serviceName, payload, queryParams) => {
  try {
    const responseRateAvailability = await MasterPackageService[serviceName](
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
