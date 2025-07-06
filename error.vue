<script setup lang="ts">
import type { NuxtError } from "#app";
import { NResult, NButton } from "naive-ui";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div class="error">
    <h1>Router Error</h1>
    <h1>{{ error?.statusCode }}</h1>
    <h1>{{ error?.message }}</h1>
    <n-result
      status="404"
      title="404 资源不存在"
      description="生活总归带点荒谬"
    >
      <template #footer>
        <n-button>找点乐子吧</n-button>
      </template>
    </n-result>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>

<style scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}
</style>
