import _ from "lodash";

export const Console = {
  debug(fn: string, msg: string, error: any, route?: any) {
    route = _.cloneDeep(route);

    if (route) console.debug(`-- Error: ${route.name} → ${fn} --`);

    console.debug(`-- Can not ${msg} --`);
    console.debug(error);
  },

  emit(msg: string, error: any) {
    return error &&
      error.response &&
      error.response.data &&
      error.response.data.message
      ? error.response.data.message.en || error.response.data.message.id
        ? error.response.data.message.en || error.response.data.message.id
        : error.response.data.message
      : `Can not ${msg}, please try again later...`;
  },
};
