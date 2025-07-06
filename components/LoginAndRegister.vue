<script setup lang="ts">
import { ref, onMounted } from "vue";
import LoginDialog from "./LoginDialog.vue";
import RegisterDialog from "./RegisterDialog.vue";

const loginDialog = ref();
const registerDialog = ref();

function openLoginDialog() {
  loginDialog.value.open();
}

function openRegisterDialog() {
  registerDialog.value.open();
}
</script>

<template>
  <div class="container">
    <div class="login" @click.stop="openLoginDialog">
      <button
        style="
          border: 1px solid lightgray;
          border-radius: 30px;
          margin-top: 20px;
          margin-left: 40px;
          width: 540px;
          height: 50px;
          font-size: 25px;
          color: white;
          font-weight: bold;
        "
      >
        登录
      </button>
    </div>
    <LoginDialog ref="loginDialog" />
    <div class="register" @click.stop="openRegisterDialog">
      <button
        style="
          border: 2px solid lightgray;
          border-radius: 30px;
          margin-top: 20px;
          margin-left: 40px;
          width: 540px;
          height: 50px;
          font-size: 25px;
          color: white;
          font-weight: bold;
        "
      >
        注册
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
