<script setup lang="ts">
import { getHashTagsData } from "~/utils/account";
import { NInfiniteScroll } from "naive-ui";

const hashtagsData = ref([]);
const loading = ref(false);
const noMore = computed(() => hashtagsData.value.length > 100)

import store from "~/composable/store";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
} from "~/store";

const queryStore = useQueryStore();
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

const props = defineProps({
  queryText: {
    type: String,
    required: false,
    default: "",
  },
});

onMounted(async () => {
  await handleLoad();
});

watch(
  () => queryStore.getQueryText,
  async () => {
    if (queryStore.getQueryText) {
      hashtagsData.value = [];
      props.queryText = queryStore.getQueryText;
      await handleLoad();
    }
  },
);

async function handleLoad() {
  if (!props.queryText) {
    return;
  }

  if (loading.value || noMore.value) {
    return;
  }

  loading.value = true;

  const data = await getHashTagsData(props.queryText, hashtagsData.value.length);
  if (!data) {
    console.warn("no more data");
  }

  hashtagsData.value.push(...data);
  loading.value = false;
}
</script>

<template>
  <div class="container">
    <n-infinite-scroll style="height: 100%" :distance="10" @load="handleLoad">
      <div v-for="(item, index) in hashtagsData" :key="index" class="hashtags">
        <section class="topic">
          <div
            style="
              font-weight: bold;
              white-space: nowrap;
              text-wrap: nowrap;
              font-size: medium;
              color: dodgerblue;
            "
          >
            #{{ item.name }}
          </div>
          <span>过去 2 天有 0 人讨论</span>
        </section>
      </div>
      <h1 style="text-align: center" v-if="loading" class="text">加载中...</h1>
      <h1 style="text-align: center" v-if="noMore" class="text">
        没有更多了 🤪
      </h1>
    </n-infinite-scroll>
  </div>
</template>

<style scoped>
.hashtags {
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 10px;
  text-align: start;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.topic {
  cursor: pointer;
  width: 100%;
  height: 100%;
  &:hover,
  &:focus-within {
    background-color: skyblue;

    filter: drop-shadow(0 4px 8px rgba(64, 158, 255, 0.3));
  }
}

.container {
  border: 2px solid lightgray;
  border-radius: 20px;
  height: 97%;
  padding: 7px 10px;
  width: 97%;
}
</style>
