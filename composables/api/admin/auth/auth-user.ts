import { extractErrorMessage } from "~/composables/general";
import { AuthUserService } from "~/services/admin/auth/auth-user.service";
import { UserStore } from "~/store/admin/user/user.store";

export const APIAuthUser = {
  async authUserLogin(loginForm) {
    try {
      const responseUserLogin = await AuthUserService.authLogin(loginForm);

      return {
        status: 200,
        response: responseUserLogin,
      };
    } catch (error) {
      return {
        status: 400,
        response: extractErrorMessage(error),
      };
    }
  },
  async getActivedUser() {
    const UserStoreInstance = UserStore();

    try {
      const responseActivedUser = await AuthUserService.getUserDetail();

      UserStoreInstance.setUserInfoDetail(responseActivedUser);

      const responseRoleAccess = await AuthUserService.getRoleAccess();

      UserStoreInstance.setUserActiveMenu(
        responseRoleAccess.data.attributes.menu
      );

      UserStoreInstance.setUserActiveGranted(
        responseRoleAccess.data.attributes.granted
      );

      return {
        status: 200,
        response: responseActivedUser,
      };
    } catch (error) {
      return {
        status: 400,
        response: extractErrorMessage(error),
      };
    }
  },
  async authChangePassword(payLoad) {
    try {
      const responseChangePassword = await AuthUserService.changePassword(
        payLoad
      );

      return {
        status: 200,
        response: responseChangePassword,
      };
    } catch (error) {
      return {
        status: 400,
        response: extractErrorMessage(error),
      };
    }
  },
};
