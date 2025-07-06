<script setup lang="ts">
import { ref, onMounted } from "vue";
import RecommendedFollowersList from "~/components/RecommendedFollowersList.vue";
import SearchBar from "~/components/SearchBar.vue";
import LoginAndRegister from "~/components/LoginAndRegister.vue";
import { NCard, NDialogProvider } from "naive-ui";
const loginStatus = ref(false);

onMounted(async () => {
  loginStatus.value = false;
});
</script>

<template>
  <div class="container">
    <SearchBar />
    <div v-if="loginStatus">
      <RecommendedFollowersList />
    </div>
    <div v-else>
      <ClientOnly>
        <n-dialog-provider>
          <LoginAndRegister />
        </n-dialog-provider>
      </ClientOnly>
    </div>
    <div class="about">
      <n-card title="📖 SuperWindCloud" embedded :bordered="false">
        Github : https://github.com/Super1WindCloud<br />
        Gitee : https://gitee.com/SuperWindCloud<br />
        Email : 1178933440@qq.com
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: inherit;
}

.about {
  width: 540px;
  height: 100px;
  margin-left: 50px;
  margin-top: 100px;
}
</style>
