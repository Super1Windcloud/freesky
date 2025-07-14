<template>
  <div class="media-grid" :class="'media-count-' + mediaAttachments.length">
    <template v-if="mediaAttachments.length === 1">
      <div class="single">
        <img :src="getSrc(mediaAttachments[0])" />
      </div>
    </template>

    <template v-else-if="mediaAttachments.length === 2">
      <div class="two">
        <img v-for="m in mediaAttachments" :src="getSrc(m)" />
      </div>
    </template>

    <template v-else-if="mediaAttachments.length === 3">
      <div class="three">
        <div class="left">
          <img :src="getSrc(mediaAttachments[0])" />
        </div>
        <div class="right">
          <img :src="getSrc(mediaAttachments[1])" />
          <img :src="getSrc(mediaAttachments[2])" />
        </div>
      </div>
    </template>

    <template v-else-if="mediaAttachments.length >= 4">
      <div class="four">
        <img v-for="m in mediaAttachments.slice(0, 4)" :src="getSrc(m)" />
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
  aspect-ratio: 4 / 3;
  overflow: auto;
  display: flex;
  gap: 4px;
}

.media-grid img {
  width: 100%;
  height: auto ;
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

/* 4 张图 */
.media-grid.media-count-4 .four {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 4px;
  width: 100%;
  height: 100%;
}




</style>
