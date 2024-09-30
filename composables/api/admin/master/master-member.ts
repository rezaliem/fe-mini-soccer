import { extractErrorMessage, formattedResponse } from "~/composables/general";
import { MasterMemberService } from "~/services/admin/master/member.service";

export const APIMasterMember = async (serviceName, payload, queryParams) => {
  try {
    const responseMasterMember = await MasterMemberService[serviceName](
      payload,
      queryParams
    );

    return {
      status: 200,
      response: formattedResponse(responseMasterMember),
      meta: responseMasterMember.meta,
    };
  } catch (error) {
    return {
      status: 400,
      response: extractErrorMessage(error),
    };
  }
};
