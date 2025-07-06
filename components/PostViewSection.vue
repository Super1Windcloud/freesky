<script setup lang="ts">
import { NCarousel } from "naive-ui";
import PostsContentList from "@/components/PostsContentList.vue";
</script>

<template>
  <div class="container">
    <div class="welcome">
      <n-carousel
        direction="vertical"
        dot-placement="right"
        mousewheel
        style="width: 900px; height: 240px"
      >
        <img
          class="carousel-img"
          alt="Welcome come to the freesky"
          src="https://cdn.pixabay.com/photo/2021/07/08/14/06/sea-6397001_640.jpg"
        />
        <img
          class="carousel-img"
          alt="Welcome come to the freesky"
          src="https://cdn.pixabay.com/photo/2021/05/31/03/53/sea-6297625_640.jpg"
        />
        <img
          class="carousel-img"
          alt="Welcome come to the freesky"
          src="https://cdn.pixabay.com/photo/2023/07/28/11/45/landscapes-8155111_640.jpg"
        />
        <img
          class="carousel-img"
          src="data:image/jpeg;base64,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"
        />
        <img
          class="carousel-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1LAgD35Yd-teEm4HosC0Chswnzo0Z1TGgSw&s"
        />
        <img
          class="carousel-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVU_rYnsMu7mcrmfn94sc9GcX14JVccMoPdA&s"
        />
        <img
          class="carousel-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuMTGTstbIVjDscCAhPBHb0lB22KCUfIoCwg&s"
        />
      </n-carousel>
    </div>

    <PostsContentList />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  margin-left: 50px;
  margin-top: 50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.carousel-img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}
</style>
