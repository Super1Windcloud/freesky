<script setup lang="ts">
import PostViewSection from "~/components/PostViewSection.vue";
</script>
<template>
  <div class="main-content">
    <ClientOnly>
      <PostViewSection />
    </ClientOnly>
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
