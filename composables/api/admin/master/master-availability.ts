import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { MasterAvailabilityService } from "~/services/admin/master/availability.service";

export const APIMasterAvailability = async (
  serviceName,
  payload,
  queryParams
) => {
  try {
    const responseMasterAvailability = await MasterAvailabilityService[
      serviceName
    ](payload, queryParams);

    return {
      status: 200,
      response: formattedResponse(responseMasterAvailability),
      meta: responseMasterAvailability.meta,
    };
  } catch (error) {
    return {
      status: 400,
      response: extractErrorMessage(error),
    };
  }
};
