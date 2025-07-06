<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="close">
        <div class="dialog-content">
          <button class="close-btn" @click="close">×</button>
          <h style="font-weight: bold; font-size: 30px">登录到FreeSky</h>
          <p class="subtitle">
            如果你的账号是在其他站点上注册的，你将无法在此登录。
          </p>

          <form @submit.prevent="onLogin" class="form">
            <input
              v-model="email"
              type="email"
              placeholder="邮箱"
              class="input"
              required
            />
            <input
              v-model="password"
              type="password"
              placeholder="密码"
              class="input"
              required
            />
            <button type="submit" class="btn">登录</button>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import axios from "axios";

const visible = ref(false);
const email = ref("");
const password = ref("");

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

async function onLogin() {
  console.log("登录：", { email: email.value, password: password.value });
  try {
    const res = await axios.post("/api/login", {
      email: email.value,
      password: password.value,
    });
    const data = res.data.message;
    console.log(data);
  } catch (e) {
    console.error("login error :" + e);
  }
  close();
}

defineExpose({ open });
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.dialog-content {
  position: relative;
  background: #1e1e1e;
  width: 500px;
  height: 300px;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.subtitle {
  font-size: 16px;
  color: #bbb;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  font-size: 16px;
}

.input::placeholder {
  color: #888;
}

.btn {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4f46e5;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #4338ca;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
