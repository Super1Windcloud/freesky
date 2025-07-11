<script setup lang="ts">
definePageMeta({
  head: {
    link: [
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.6.3/css/all.css",
        integrity:
          "sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/",
        crossorigin: "anonymous",
      },
    ],
  },
});

const isDark = useDark({
  selector: "html",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "vueuse-color-scheme",
});

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style scoped>
html,
body,
#__nuxt {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

.theme-toggle {
  position: absolute;
  bottom: 30px;
  right: 30px;
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
}
</style>
