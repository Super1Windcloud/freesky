<script setup lang="ts">
import PostViewSection from "~/components/PostViewSection.vue";

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
  <div class="main-content">
      <PostViewSection />
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  height: 100%;
  width: 100%;
}
</style>
