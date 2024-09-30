import { isArray } from "lodash";

export const extractErrorMessage = (error) => {
  if (
    error &&
    error.response &&
    error.response._data &&
    error.response._data.error &&
    error.response._data.error.message
  )
    return error.response._data.error.message;
  else return "Sorry, the process is error, please try again later";
};

export const formattedResponse = (response) => {
  return response.data
    ? !isArray(response.data)
      ? GeneralFunction.unWrappedAttribute(response?.data)
      : GeneralFunction.unWrappedAttributes(response?.data)
    : response;
};

export const GeneralFunction = {
  clearForm(formValue, booleanValue) {
    Object.keys(formValue).forEach((key) => {
      if (key !== "users_permissions_user")
        switch (typeof formValue[key]) {
          case "boolean":
            formValue[key] = booleanValue;
            break;
          case "number":
            formValue[key] = 0;
            break;
          default:
            formValue[key] = null;
        }
    });
  },
  unWrappedAttribute(originalObject) {
    const result = {
      id: originalObject.id,
    };
    Object.keys(originalObject.attributes).forEach((key) => {
      result[key] = originalObject.attributes[key];
    });
    return result;
  },
  unWrappedAttributes(dataSet) {
    const result = [];
    dataSet.forEach((data) => {
      const singleObject = {
        id: data.id,
      };
      Object.keys(data.attributes).forEach((key) => {
        singleObject[key] = data.attributes[key];
      });
      result.push(singleObject);
    });
    return result;
  },
};
