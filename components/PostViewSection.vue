<script setup lang="ts">
import PostsContentList from "@/components/PostsContentList.vue";
</script>

<template>
  <ClientOnly>
    <div class="container">
      <PostsContentList />
    </div>
  </ClientOnly>
</template>

<style scoped>
.container {
  display: flex;
  margin-top: 50px;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  width : 100%;

}

</style>
