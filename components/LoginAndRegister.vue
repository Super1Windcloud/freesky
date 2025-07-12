<script setup lang="ts">
import { ref, onMounted } from "vue";
import LoginDialog from "./LoginDialog.vue";
import RegisterDialog from "./RegisterDialog.vue";

const loginDialog = ref();
const registerDialog = ref();
const loginValue = ref();
const registerValue = ref();

function openLoginDialog() {
  loginDialog.value.open();
}

function openRegisterDialog() {
  registerDialog.value.open();
}

onMounted(() => {
  loginValue.value = $t("login");
  registerValue.value = $t("register");
});
</script>

<template>
  <div class="container">
    <div class="login" @click.stop="openLoginDialog">
      <button
        style="
          border-radius: 30px;
          margin-top: 20px;
          width: 100%;
          height: 50px;
          font-size: 25px;
          font-weight: bold;
          color : inherit;
        "
      >
        {{ loginValue }}
      </button>
    </div>
    <LoginDialog ref="loginDialog" />
    <div class="register" @click.stop="openRegisterDialog">
      <button
        style="
          border-radius: 30px;
          margin-top: 20px;
          width: 100%;
          height: 50px;
          font-size: 25px;
          font-weight: bold;
          color : inherit;
        "
      >
        {{ registerValue }}
      </button>
    </div>
    <RegisterDialog ref="registerDialog" />
  </div>
</template>

<style scoped>
button {
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: transparent;
}

.register,
.login {
  background-color: transparent;

  button {
    :hover {
      background-color: lightpink;
    }
  }

  :hover {
    background-color: lightpink;
  }
}
</style>
