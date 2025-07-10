<script setup lang="ts">
import RigisterSection from "~/components/RigisterSection.vue";

import { onMounted } from "vue";

const { locales, setLocale } = useI18n();

onMounted(() => {
  function getPreferredLanguage() {
    // 1. 检查URL参数（如 ?lang=zh）
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    if (urlLang) return urlLang;
    const storedLang = localStorage.getItem("preferredLanguage");
    if (storedLang) return storedLang;
    const browserLang = navigator.language || "en";
    return /^zh/i.test(browserLang) ? "zh" : "en";
  }

  if (getPreferredLanguage() === "zh") {
    setLocale("zh");
  } else {
    setLocale("en");
  }
});
</script>

<template>
  <div class="layout-container">
    <LeftOperationIcon class="left" />
    <KeepAlive>
      <div class="center">
        <slot />
      </div>
    </KeepAlive>
    <RigisterSection class="right" />
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  position: relative;
  font-family: Arial, sans-serif;
  justify-content: center;
  align-items: start;
  padding: 0;
}

.center {
  height: 100%;
  width: 1000px;
  margin-left: 50px;
  padding: 0;
  background-color: transparent;
}

.right {
  height: 100%;
  width: 500px;
  flex-shrink: 0;
  background-color: transparent;
  margin-left: 60px;
  padding: 0;
}
</style>
