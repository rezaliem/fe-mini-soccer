const useGoogleCookie = () => useCookie("token");

export const googleLogin = () => {
  const { BASE_URL, API_URL } = useRuntimeConfig();

  if (process.client) {
    window.location.replace(
      `${API_URL}/v1/admin/auth/google?redirect_uri=${BASE_URL}/auth/callback`
    );
  }
};

export const googleLoginSE = () => {
  const { BASE_URL, CA_ADMIN_API_URL } = useRuntimeConfig();

  if (process.client) {
    window.location.replace(`${CA_ADMIN_API_URL}/connect/google`);
  }
};

export const googleFetch = (url: string, fetchOptions: any = {}) => {
  return $fetch(url, {
    baseURL: "https://api.github.com",
    ...fetchOptions,
    headers: {
      Authorization: `token ${useGoogleCookie().value}`,
      ...fetchOptions.headers,
    },
  });
};

export const useGoogleUser = async () => {
  const cookie = useGoogleCookie();
  const user = useState("gh_user");
  if (cookie.value && !user.value) {
    user.value = await googleFetch("/user");
  }
  return user;
};

export const useGoogleLogout = async () => {
  let userIsAuthenticated = useCookie("user.isAuthenticated");
  userIsAuthenticated.value = "false";
  useCookie("user.token").value = null;
  navigateTo("/auth/login");
};
