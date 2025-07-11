<script setup lang="ts">
import Lenis from "lenis";

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

const lenis = new Lenis({
  anchors: true,
  autoRaf: true,
  allowNestedScroll: true,
});

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>