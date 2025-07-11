<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NInfiniteScroll } from "naive-ui";
import store from "~/composable/store";
import dayjs from "dayjs";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
} from "~/store";

/**
 * 0: "id"
 * 1: "createdAt"
 * 2: "inReplyToId"
 * 3: "inReplyToAccountId"
 * 4: "sensitive"
 * 5: "spoilerText"
 * 6: "visibility"
 * 7: "language"
 * 8: "uri"
 * 9: "url"
 * 10: "repliesCount"
 * 11: "reblogsCount"
 * 12: "favouritesCount"
 * 13: "editedAt"
 * 14: "favourited"
 * 15: "reblogged"
 * 16: "muted"
 * 17: "bookmarked"
 * 18: "content"
 * 19: "filtered"
 * 20: "reblog"
 * 21: "account"   object
 * 22: "mediaAttachments"
 * 23: "mentions"  object
 * 24: "tags"   object
 * 25: "emojis"
 * 26: "quote"
 * 27: "card"  object
 * 28: "poll"
 * */
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

const postsContentList = ref<Object[]>([]);
const loading = ref(false);
const noMore = ref(false);
const queryStore = useQueryStore();

watch(
  () => queryStore.getQueryText,
  async () => {
    if (queryStore.getQueryText) {
      postsContentList.value = [];
      await handleLoad();
    }
  },
);
onMounted(async () => {
  await handleLoad();
});

async function handleLoad() {
  if (!queryStore.getQueryText) {
    return;
  }

  if (loading.value || noMore.value) {
    return;
  }

  loading.value = true;

  const data = await getStatusesData(
    queryStore.getQueryText,
    postsContentList.value.length,
    instanceUrl,
    accessToken,
  );
  if (!data) {
    console.warn("no more data");
    noMore.value = true;
    loading.value = false;
    return;
  }
  for (const i in data[0]) {
    if (
      typeof data[0][i] !== "string" &&
      typeof data[0][i] != "number" &&
      typeof data[0][i] != "boolean"
    ) {
      console.dir(typeof data[0][i], i);
      console.dir(data[0][i]);
    }
  }
  // console.dir(data[0].tags);
  postsContentList.value.push(...data);
  loading.value = false;
  noMore.value = false;
}
</script>

<template>
  <div class="container">
    <n-infinite-scroll
      size="30"
      :x-scrollable="false"
      :distance="10"
      @load="handleLoad"
    >
      <div v-for="(item, index) in postsContentList" :key="index" class="posts">
        <section class="post-card">
          <div class="header">
            <img
              style="
                margin-top: 10px;
                width: 50px;
                height: 50px;
                border-radius: 20%;
              "
              :src="item.account.avatar"
              class="avatar"
              alt="avatar"
            />
            <div class="account-name">
              <div style="font-weight: bold; opacity: 1.2">
                {{ item.account.displayName || item.account.username }}
              </div>
              <div style="opacity: 0.8">{{ item.account.acct }}</div>
            </div>
            <div class="publish-time">
              {{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
            </div>
          </div>
          <div class="content" v-if="item.card">
            <h2 class="title">
              <a target="_blank" :href="item.tags[0]?.url">{{
                item.tags[0]?.name
              }}</a>
              <span style="margin-left: 10px">{{ item.tags[1]?.name }}</span>
            </h2>
            <h3>{{ item.card?.title }}</h3>
            <p>{{ item.card?.description }}</p>
            <a
              target="_blank"
              :href="item.card?.url"
              class="card-url"
              style="color: darkorange"
              >{{ item.card?.url }}</a
            >
            <img alt="card-img" :src="item.card?.image" />
          </div>
          <section v-else class="media-attachments">
            <h3>{{ item.mediaAttachments[0]?.description }}</h3>
            <div v-html="item.content"></div>
            <img
              alt="preview-url"
              :src="item.mediaAttachments[0]?.previewUrl"
            />
          </section>
        </section>
        <NDivider style="border: 1px solid white; width: calc(100% + 20px)" />
      </div>
      <h1 style="text-align: center" v-if="loading" class="text">加载中...</h1>
      <h1 style="text-align: center" v-if="noMore" class="text">
        没有更多了 🤪
      </h1>
    </n-infinite-scroll>
  </div>
</template>

<style scoped>
.content {
  margin-top: 10px;
  text-align: start;
}

.account-name {
  text-align: start;
  padding: 0;
  margin-top: 10px;
  margin-left: 10px;
}

.publish-time {
  margin-left: auto;
  margin-right: 10px;
}

.posts {
  display: flex;
  align-items: start;
  justify-content: center;
  padding: 0 10px;
  text-align: start;
  flex-direction: column;
}

.container {
  border: 2px solid lightgray;
  border-radius: 20px;
  height: 97%;
  padding: 7px 10px;
  width: 97%;
}

.post-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 50%;
  justify-content: start;
}
</style>
