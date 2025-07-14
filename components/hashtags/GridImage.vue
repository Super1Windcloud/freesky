<template>
  <div
    v-if="mediaAttachments.length > 0"
    class="media-grid"
    :class="[
      'media-count-' + mediaAttachments.length,
      { 'has-aspect-ratio': mediaAttachments.length < 4 }
    ]"
  >
    <template v-if="mediaAttachments.length === 1">
      <div class="single">
        <img :src="getSrc(mediaAttachments[0])" alt="" />
      </div>
    </template>

    <template v-else-if="mediaAttachments.length === 2">
      <div class="two">
        <img v-for="m in mediaAttachments" :src="getSrc(m)" alt="" />
      </div>
    </template>

    <template v-else-if="mediaAttachments.length === 3">
      <div class="three">
        <div class="left">
          <img :src="getSrc(mediaAttachments[0])" alt="" />
        </div>
        <div class="right">
          <img :src="getSrc(mediaAttachments[1])" alt="" />
          <img :src="getSrc(mediaAttachments[2])" alt="" />
        </div>
      </div>
    </template>

    <template v-else>
      <div class="four">
        <img v-for="m in mediaAttachments.slice(0, 4)" :src="getSrc(m)" alt="" />
      </div>
    </template>
  </div>
</template>


<script setup lang="ts">
const props = defineProps<{
  mediaAttachments: {
    previewUrl?: string;
    url?: string;
    remoteUrl?: string;
  }[];
}>();

const getSrc = (m: any) => m.previewUrl || m.url || m.remoteUrl;
</script>

<style scoped>


.media-grid {
  width: 100%;
  height: auto;
  overflow: hidden;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* 仅 1~3 张图时启用固定比例 */
.media-grid.has-aspect-ratio {
  aspect-ratio: 4 / 3;
}

/* 通用图片样式 */
.media-grid img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 1 张图 */
.media-grid.media-count-1 .single {
  width: 100%;
  height: 100%;
}

/* 2 张图 */
.media-grid.media-count-2 .two {
  display: flex;
  gap: 4px;
}
.media-grid.media-count-2 img {
  width: 50%;
  height: 100%;
}

/* 3 张图 */
.media-grid.media-count-3 .three {
  display: flex;
  gap: 4px;
}
.media-grid.media-count-3 .left {
  width: 50%;
  height: 100%;
}
.media-grid.media-count-3 .right {
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.media-grid.media-count-3 .right img {
  height: 50%;
  width: 100%;
}

/* 4 张图（或更多，仅显示前4张） */
.media-grid.media-count-4 .four,
.media-grid.media-count-5 .four,
.media-grid.media-count-6 .four,
.media-grid.media-count-7 .four,
.media-grid.media-count-8 .four {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  width: 100%;
  /* 关键：不要写 height: 100%;，由内容撑开 */
}


</style>
