import ApiService from "~~/services/api.service";

export const AuthUserService = {
  async authLogin(loginForm) {
    return await ApiService.v1().postNoHeader(`auth/local?populate[0]=role`, {
      identifier: loginForm.userName,
      password: loginForm.password,
    });
  },

  async changePassword(payLoad) {
    return await ApiService.v1().post(`auth/change-password`, payLoad);
  },

  async getUserDetail() {
    return await ApiService.v1().get(`users/me?populate[0]=role`);
  },

  async getRoleAccess() {
    return await ApiService.v1().get(`role-access`);
  },
};
