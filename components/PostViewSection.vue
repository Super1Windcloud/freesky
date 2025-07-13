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
  align-items: start ;
  width : 100%;
  height: 90%;
  background-color: green ;
}

</style>
