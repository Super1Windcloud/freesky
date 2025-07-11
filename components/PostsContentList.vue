<script setup lang="ts">
import { ref } from "vue";
import { NSkeleton } from "naive-ui";

const loadingStatus = ref(false);
</script>

<template>
    <div v-if="!loadingStatus" class="skeleton">
      <n-skeleton text :repeat="10" />
      <n-skeleton text style="width: 860px" />
    </div>
</template>

<style scoped>
.skeleton {
  margin-top: 30px;
  filter: blur(1px);
  opacity: 0.2;
}
</style>
