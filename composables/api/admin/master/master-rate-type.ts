import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { MasterRateTypeService } from "~/services/admin/master/rate-type.service";

export const APIMasterRateType = async (serviceName, payload, queryParams) => {
  try {
    const responseMasterRateType = await MasterRateTypeService[serviceName](
      payload,
      queryParams
    );

    return {
      status: 200,
      response: formattedResponse(responseMasterRateType),
      meta: responseMasterRateType.meta,
    };
  } catch (error) {
    return {
      status: 400,
      response: extractErrorMessage(error),
    };
  }
};
