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
    <div class="left">
      <LeftOperationIcon />
    </div>
    <KeepAlive>
      <div class="center-container">
        <slot />
      </div>
    </KeepAlive>
    <div class="right">
      <RigisterSection />
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  align-self: center;
  height: 100vh;
  width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  position: relative;
  font-family: Arial, sans-serif;
  justify-content: center;
  align-items: center;
  padding: 0;
}

.center-container {
  height: 100%;
  padding: 0;
  width: 40%;
  background-color: transparent;
}

.left  {
  height: 100%;
  width: 10%;
  background-color: transparent;
  padding: 0;
}

.right {
  margin-left:1%;
  height: 100%;
  width: 25%;
  background-color: transparent ;
  padding: 0;
}
</style>
