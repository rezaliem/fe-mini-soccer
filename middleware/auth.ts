import { storeToRefs } from "pinia";

import { APIAuthUser } from "~/composables/api/admin/auth/auth-user";
import { UserStore } from "~/store/admin/user/user.store";

const UserStoreInstance = UserStore();

const { userInfoDetail } = storeToRefs(UserStoreInstance);

export default defineNuxtRouteMiddleware(async (to, from) => {
  const loginPages = ["/admin/auth/login"];
  const authorizedPages = ["/admin"];
  const isAuthLoginPages = loginPages.includes(to.path);
  const isAuthorizedPages = authorizedPages.some((element) =>
    to.path.includes(element)
  );
  const isAuthenticated = useCookie("user.isAuthenticated").value;

  if (isAuthenticated && userInfoDetail.value.role.name === null)
    await APIAuthUser.getActivedUser();

  if (isAuthLoginPages && isAuthenticated) {
    return "/admin/dashboard";
  } else if (!isAuthenticated && isAuthorizedPages && !isAuthLoginPages) {
    return "/admin/auth/login";
  }
});
