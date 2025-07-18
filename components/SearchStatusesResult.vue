<script setup lang="ts">
import { ref, onMounted } from "vue";
import { NInfiniteScroll } from "naive-ui";
import dayjs from "dayjs";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
  useSearchPostDetailStore,
} from "~/store";
import { useRouter } from "vue-router";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import { getStatusesData } from "~/utils/account";

const router = useRouter();
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
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();

const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

const postsContentList = ref<Object[]>([]);
const loading = ref(false);
const noMore = ref(false);
const queryStore = useQueryStore();
const languages = usePreferredLanguages();
const postDetailStore = useSearchPostDetailStore();

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

async function enterPostDetailPage(item: Object) {
  if (languages.value) {
    const langs = languages.value;
    if (typeof langs === "object" && langs.length > 0) {
      if (langs[0] === "zh-CN") {
        postDetailStore.setSearchPostDetail(item);
        await router.push({
          path: "/zh/postDetailInfo/",
          query: {
            id: item.id,
          },
        });
        return;
      }
    }
  }
  postDetailStore.setSearchPostDetail(item);
  await router.push({
    path: "/postDetailInfo/",
    query: {
      id: item.id,
    },
  });
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
        <section
          :id="item.id"
          @click="enterPostDetailPage(item)"
          class="post-card"
        >
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
          <div class="card-content" v-if="item.card">
            <h2 class="title">
              <a
                style="font-size: 1rem; font-weight: bold; color: darkgoldenrod"
                target="_blank"
                :href="item.tags[0]?.url"
                >{{ item.tags[0]?.name }}</a
              >
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
            <img style="border-radius: 10px" alt="" :src="item.card?.image" />
          </div>
          <section v-else class="media-attachments">
            <h3>{{ item.mediaAttachments[0]?.description }}</h3>
            <div class="html-content" v-html="item.content"></div>
            <img
              style="border-radius: 10px"
              alt="preview-url"
              :src="
                item.mediaAttachments[0]?.previewUrl ||
                item.mediaAttachments[0]?.url ||
                item.mediaAttachments[0]?.remoteUrl
              "
            />
          </section>
        </section>
        <NDivider
          style="border: 1px solid rgba(255, 255, 255, 0.3); width: 100%"
        />
      </div>
      <h1 style="text-align: center" v-if="loading" class="text">加载中...</h1>
      <h1 style="text-align: center" v-if="noMore" class="text">
        没有更多了 🤪
      </h1>
    </n-infinite-scroll>
  </div>
</template>

<style scoped>
.card-content {
  margin-top: 10px;
  text-align: start;
}

.card-content,
.media-attachments {
  width: 100%;
  max-width: 100%;
  white-space: wrap;
  word-wrap: break-word;
}

img {
  border-radius: 10px;
  max-width: 100%;
  height: auto;
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  height: 100%;
  width: 98%;
  margin: 0;
  padding: 0;
}

.post-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  width: 100%;
  height: 100%;
  max-width: 100%;
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
