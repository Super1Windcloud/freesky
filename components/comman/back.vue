<script setup lang="ts">
import { ref ,onMounted } from 'vue'
const router = useRouter()

async function backToLastPage() {
  await router.go(-1);
}
</script>

<template>
  <img
      @click.stop="backToLastPage"
      style="width: 40px; height: 40px; margin-top: 60px; cursor: pointer"
      class="back"
      alt="back"
      src="/assets/back.png"
  />
</template>

<style scoped>

</style>