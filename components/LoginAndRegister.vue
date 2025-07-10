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
          border: 1px solid lightgray;
          border-radius: 30px;
          margin-top: 20px;
          width:  500px;
          height: 50px;
          font-size: 25px;
          color: white;
          font-weight: bold;
        "
      >
        {{ loginValue }}
      </button>
    </div>
    <LoginDialog ref="loginDialog" />
    <div class="register" @click.stop="openRegisterDialog">
      <button
        style="
          border: 2px solid lightgray;
          border-radius: 30px;
          margin-top: 20px;
          width:500px;
          height: 50px;
          font-size: 25px;
          color: white;
          font-weight: bold;
        "
      >
        {{ registerValue }}
      </button>
    </div>
    <RegisterDialog ref="registerDialog" />
  </div>
</template>

<style scoped>
.register {
  background-color: transparent;

  :hover {
    background-color: lightpink;
  }
}
</style>
