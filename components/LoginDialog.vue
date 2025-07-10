<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="dialog-overlay" @click.self="close">
        <div class="dialog-content">
          <button class="close-btn" @click="close">×</button>
          <h1 style="font-weight: bold; font-size: 30px; margin-top: 0">
            登录到FreeSky
          </h1>
          <p style="" class="subtitle">
            输入你的 Mastodon实例服务器地址,登录您的 Mastodon
            账户后，您可以通过点击“关注”按钮轻松地关注其他账户。
          </p>
          <form @submit.prevent="onLogin" class="form">
            <input
              :disabled="isLoggingIn"
              v-model="url"
              type="text"
              placeholder="mastodon.social"
              class="input"
              required
            />
            <div v-if="filteredInstances.length > 0" class="autocomplete">
              <div
                class="autocomplete-item"
                v-for="instance in filteredInstances"
                :key="instance"
                @click="selectInstance(instance)"
              >
                {{ instance }}
              </div>
            </div>

            <div style="font-weight: bold; color: red" v-if="urlError">
              {{ urlError }}
            </div>
            <button :disabled="isForbidRequestLogin" type="submit" class="btn">
              <span v-if="isLoggingIn" class="spinner"></span>
              <span v-else>{{ $t("login") }}</span>
            </button>
          </form>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, defineExpose } from "vue";
import axios from "axios";
import { useI18n } from "vue-i18n";
import { useRegisterFinishStore, useInstanceUrlStore } from "~/store";
import { registerApplication } from "~/composable/auth";
import { submitInstance } from "~/composable/auth";

const { t } = useI18n();
const visible = ref(false);
const url = ref("");
const isForbidRequestLogin = ref(true);
const urlError = ref("");
const allInstances = ref([]);
const loadFinish = ref(false);
const isLoggingIn = ref(false);

onMounted(() => {
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

function invalidUrl(url: string) {
  const pattern = /^https?:\/\/[a-zA-Z0-9]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
  return !pattern.test(url.trim());
}

const filteredInstances = ref<string[]>([]);
const instanceUrl = useInstanceUrlStore();

watch(url, () => {
  const query = url.value.trim().toLowerCase();

  if (!query) {
    filteredInstances.value = [];
    return;
  }

  filteredInstances.value = allInstances.value.filter((instance: string) =>
    instance.toLowerCase().includes(query),
  );
});

function selectInstance(instance: string) {
  url.value = `https://${instance}`;
  filteredInstances.value = [];
}

watch(url, () => {
  if (!url.value.trim()) {
    urlError.value = t("empty");
    isForbidRequestLogin.value = true;
    return;
  }
  if (invalidUrl(url.value.trim())) {
    urlError.value = t("url");
    isForbidRequestLogin.value = true;
  } else {
    urlError.value = "";
    isForbidRequestLogin.value = false;
  }
});

const registerStore = useRegisterFinishStore();
watch(
  () => registerStore.finishRegister,
  () => {
    if (registerStore.finishRegister) {
      open();
    }
  },
);

async function onLogin() {
  if (!url.value.trim()) {
    isForbidRequestLogin.value = true;
    urlError.value = t("empty");
    return false;
  }
  if (!url.value.startsWith("https://")) {
    url.value = `https://${url.value}`;
  }
  try {
    isLoggingIn.value = true;
    instanceUrl.setInstanceUrl(url.value.trim());

    await submitInstance(url.value.trim());
  } catch (e) {
    console.error("login error :" + e);
    isForbidRequestLogin.value = false;
  } finally {
    isLoggingIn.value = false;
    close();
  }
}

defineExpose({ open });

watch(visible, async () => {
  if (!visible.value) return;
  if (allInstances.value.length > 0) return;
  const res = await axios.get("/instance_list");
  const data = res.data;
  if (data.success) {
    const instances = data.data;
    allInstances.value = instances;
  }
});
</script>

<style scoped>
.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ffffff;
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

.autocomplete {
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 8px;
  margin-top: 4px;
  max-height: 100px;
  overflow-y: auto;
}

.autocomplete-item {
  padding: 8px 12px;
  cursor: pointer;
  color: white;
}

.autocomplete-item:hover {
  background-color: #3a3a3a;
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
  height: 400px;
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

.btn:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.6;
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
