<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="close">
        <div class="dialog-content">
          <button class="close-btn" @click="close">×</button>
          <h1>注册Mastodon实例账号</h1>
          <p class="subtitle">
            站点上注册一个账号，你就可以关注联邦宇宙中的任何人，无论他们的账号在哪里。
          </p>

          <form @submit.prevent="onRegister" class="form">
            <input
              v-model="serverDomain"
              type="text"
              placeholder="服务器域名, 例如: mastodon.social"
              class="input"
              required
            />
            <input
              v-model="username"
              type="text"
              placeholder="用户名"
              class="input"
              required
            />
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
            <input
              v-model="confirmPassword"
              type="password"
              placeholder="确认密码"
              class="input"
              required
            />

            <label class="checkbox-container">
              <input type="checkbox" v-model="agreePolicy" />
              <span>我已阅读并同意 <a href="#">《服务协议》</a></span>
            </label>
            <div
              style="color: hotpink; font-weight: bold"
              v-if="errorMessage"
              class="error-message"
            >
              {{ errorMessage }}
            </div>
            <button
              v-if="!registerFinish"
              :disabled="!canSubmit"
              type="submit"
              class="btn"
            >
              <span v-if="isSubmitting" class="spinner"></span>
              <span v-else>{{ registerValue }}</span>
            </button>
            <button
              v-else
              type="button"
              @click.stop="openRegisterFinishSkipButton"
              class="btn"
            >
              {{ $t("registerFinish") }}
            </button>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, defineExpose } from "vue";
import axios from "axios";
import { useRegisterFinishStore } from "~/store";

const isSubmitting = ref(false);
const visible = ref(false);
const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const agreePolicy = ref(false);
const errorMessage = ref("");
const serverDomain = ref("");
const registerFinish = ref(false);

const toast = useToast();

watch(isSubmitting, () => {});
onMounted(() => {
  serverDomain.value = "https://techhub.social";
  confirmPassword.value = "ss1178933440@gmail.com";
});

function matchUsername(username: string) {
  const pattern = /[^a-zA-Z0-9_]$/;
  return pattern.test(username);
}

const canSubmit = computed(() => {
  if (!username.value.trim()) {
    errorMessage.value = "用户名不能为空";
  } else if (username.value.trim()) {
    if (matchUsername(username.value)) {
      errorMessage.value = "用户名只能是字母.数字,下划线";
    } else {
      errorMessage.value = "";
    }
  } else if (!serverDomain.value.trim()) {
    errorMessage.value = "服务器域名不能为空";
  } else if (!email.value.trim()) {
    errorMessage.value = "邮箱不能为空";
  } else if (!password.value) {
    errorMessage.value = "密码不能为空";
  } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password.value)) {
    errorMessage.value = "密码必须包含字母和数字";
  } else if (!confirmPassword.value) {
    errorMessage.value = "确认密码不能为空";
  } else if (password.value !== confirmPassword.value) {
    errorMessage.value = "两次密码输入不一致";
  } else if (!agreePolicy.value) {
    errorMessage.value = "请阅读并同意服务协议";
  } else {
    errorMessage.value = "";
  }

  return (
    username.value.trim() &&
    email.value.trim() &&
    password.value &&
    confirmPassword.value &&
    password.value === confirmPassword.value &&
    agreePolicy.value &&
    serverDomain.value
  );
});
const registerValue = ref();

onMounted(() => {
  registerValue.value = $t("register");
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && visible.value) {
      close();
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", (event) => {
    if (event.key === "Escape" && visible.value) {
      close();
    }
  });
});

function open() {
  visible.value = true;
}

function close() {
  visible.value = false;
}

async function queryUsernameExist() {
  try {
    const res = await axios.post("/api/query_username", {
      username: username.value,
      url: serverDomain.value,
    });
    console.log("usernameExist res", res.data);
    const data = res.data;
    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("uesrname error" + error);
    return false;
  }
}

async function onRegister() {
  if (!canSubmit.value || isSubmitting.value) return;
  if (
    !serverDomain.value.startsWith("https://") &&
    serverDomain.value.startsWith("https://")
  ) {
    serverDomain.value = "https://" + serverDomain.value;
  }

  console.log("注册信息：", {
    username: username.value,
    email: email.value,
    password: password.value,
    url: serverDomain.value,
  });
  if (await queryUsernameExist()) {
    errorMessage.value = "用户名已存在";
    return;
  }

  try {
    isSubmitting.value = true;
    const res = await axios.post("/api/register", {
      username: username.value,
      email: email.value,
      password: password.value,
      url: serverDomain.value,
    });

    console.log("后端返回：", res.data);
    registerFinish.value = true;
    toast.success({
      position: "topCenter",
      title: "Success!",
      zindex: 1000,
      message: `注册成功,打开${email.value}进行激活`,
      timeout: 5000,
    });
  } catch (error) {
    console.error("请求失败：", error);
  } finally {
    isSubmitting.value = false;
  }
}

const registerStore = useRegisterFinishStore();

function openRegisterFinishSkipButton() {
  registerFinish.value = false;
  visible.value = false;
  registerStore.setFinishRegister(true);
}

defineExpose({ open });
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

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
  height: 600px;
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

.checkbox-container {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #bbb;
  gap: 8px;
  margin-top: 8px;
}

.checkbox-container a {
  color: #4f46e5;
  text-decoration: underline;
}

.btn {
  margin-top: 12px;
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

.btn:disabled {
  background-color: #666;
  cursor: not-allowed;
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
