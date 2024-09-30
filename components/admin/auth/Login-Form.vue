<template>
  <div
    class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
  >
    <div class="mx-auto w-full max-w-sm lg:w-96">
      <div>
        <img
          class="h-12 w-auto"
          src="~/assets/images/logo.png"
          alt="Workflow"
        />
        <div
          class="font-comfortaa-300 mt-2 flex justify-center"
          style="font-size: 16px"
        >
          This section is for authorized users
        </div>
      </div>
    </div>

    <div>
      <n-card title="Administration login" class="mt-2">
        <n-form>
          <n-form-item label="Username" label-placement="left">
            <n-input
              v-model:value="loginForm.userName"
              placeholder="User name"
            />
          </n-form-item>
          <n-form-item label="Password" label-placement="left">
            <n-input
              v-model:value="loginForm.password"
              type="password"
              show-password-on="mousedown"
            />
          </n-form-item>
          <!-- <n-alert
            v-if="isLoginFailed"
            title="Login Failed"
            type="error"
            class="mt-1"
            closable
          >
            {{ errorMessage }}
          </n-alert> -->
          <div class="mt-1 flex">
            <n-button @click="loginHandler" type="primary" :loading="isLoading">
              Login
            </n-button>
          </div>
        </n-form>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APIAuthUser } from "~/composables/api/admin/auth/auth-user";
import { useMessage } from "naive-ui";

const message = useMessage();

const isLoading = ref(false);
const loginForm = reactive({
  userName: null,
  password: null,
});
const loginHandler = async () => {
  let userIsAuthenticated = useCookie("user.isAuthenticated");
  let userToken = useCookie("user.token");
  let userSection = useCookie("user.section");

  isLoading.value = true;

  const responseLogin = await APIAuthUser.authUserLogin(loginForm);

  if (responseLogin.status === 200) {
    userIsAuthenticated.value = "true";
    userSection.value = null;
    userToken.value = responseLogin.response.jwt;

    setTimeout(async () => {
      const responseActivedUser = await APIAuthUser.getActivedUser();

      if (responseActivedUser.status !== 200) {
        await logOutHandler();
        message.error(responseLogin.response);
      }

      await navigateTo("/admin/dashboard");
      isLoading.value = false;
    }, 2000);
  } else {
    await logOutHandler();
    message.error(responseLogin.response);
  }

  isLoading.value = false;
};

const logOutHandler = async () => {
  let userIsAuthenticated = useCookie("user.isAuthenticated");
  userIsAuthenticated.value = "false";
  useCookie("user.token").value = null;
  await navigateTo("/admin/auth/login");
};
</script>

<style scoped></style>
