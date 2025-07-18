<script setup lang="ts">
import { getHashTagsData } from "~/utils/account";
import { NInfiniteScroll } from "naive-ui";

const hashtagsData = ref([]);
const loading = ref(false);
const noMore = computed(() => hashtagsData.value.length > 100);
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
} from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import { isDevMode } from "~/utils";

const queryStore = useQueryStore();
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

onMounted(async () => {
  await handleLoad();
});

watch(
  () => queryStore.getQueryText,
  async () => {
    if (queryStore.getQueryText) {
      hashtagsData.value = [];
      await handleLoad();
    }
  },
);

async function handleLoad() {
  if (!queryStore.getQueryText) {
    return;
  }

  if (loading.value || noMore.value) {
    return;
  }

  loading.value = true;

  const data = await getHashTagsData(
    queryStore.getQueryText,
    hashtagsData.value.length,
    instanceUrl,
    accessToken,
  );
  if (!data) {
    console.warn("no more data");
    loading.value = false;
    return;
  }
  hashtagsData.value.push(...data);
  loading.value = false;
}

const languages = usePreferredLanguages();
const router = useRouter();

async function enterTopicPage(item) {
  if (isDevMode()) {
    console.dir(item);
  }
  const id = item.id;
  const name = item.name;
  if (languages.value) {
    const langs = languages.value;
    if (typeof langs === "object" && langs.length > 0) {
      if (langs[0] === "zh-CN") {
        await router.push({
          path: `/zh/topicDetailPage`,
          query: {
            name,
            id,
          },
        });
        return;
      }
    }
  }

  await router.push({
    path: `/topicDetailPage`,
    query: {
      name,
      id,
    },
  });
}
</script>

<template>
  <div class="container">
    <n-infinite-scroll style="height: 100%" :distance="10" @load="handleLoad">
      <div v-for="(item, index) in hashtagsData" :key="index" class="hashtags">
        <section @click="enterTopicPage(item)" class="topic">
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  height: 100%;
  width: 98%;
  margin: 0;
  padding: 0;
}
</style>
