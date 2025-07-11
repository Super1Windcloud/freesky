<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useSearchPostDetailStore } from "~/store";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "vue-router";

const postDetailStore = useSearchPostDetailStore();
const postDetail = reactive({});
import { useInstanceUrlStore, useAccessTokenStore } from "~/store";
import store from "~/composable/store";
import { NDropdown } from "naive-ui";

const router = useRouter();
import Lenis from "lenis";

const moreOptions = ref([
  {
    label: "复制贴文链接",
    key: "copyLink",
  },
  {
    label: "复制贴文原始链接",
    key: "copyRawLink",
  },
  {
    label: "分享到社交媒体",
    key: "share",
  },
  {
    label: "从源站页面打开",
    key: "openFromSource",
  },
]);
onMounted(() => {
  const target = document.querySelector(".post-card") as HTMLElement;
  const lenis = new Lenis({
    wrapper: target,
    anchors: true,
    autoRaf: true,
    allowNestedScroll: true,
  });
});

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

onMounted(async () => {
  if (Object.keys(postDetailStore.getSearchPostDetail).length) {
    Object.assign(postDetail, postDetailStore.getSearchPostDetail);
    const isEmpty =
      Reflect.ownKeys(postDetail).length === 0 ||
      Object.keys(postDetail).length === 0;

    if (isEmpty) {
      console.error("postDetail is empty");
    }
    for (const item in postDetail) {
      if (typeof postDetail[item] === "object") {
        console.log(item);
        console.dir(postDetail[item]);
      }
    }
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    if (id) {
      try {
        const res = await axios.post("/api/get_post_detail", {
          id: id,
          url: instanceUrl,
          accessToken: accessToken,
        });
        const data = res.data;
        Object.assign(postDetail, data);
      } catch (err) {
        console.error("get post_detail error:", err);
      }
    }
  }

  if (Object.keys(postDetail).length > 0) {
    isFavourite.value = !!postDetail.favourited;
    isShared.value = !!postDetail.reblogged;
    isBookmarked.value = !!postDetail.bookmarked;
    favoriteCount.value = postDetail.favouritesCount;
  }
});

const favoriteCount = ref(0);
const isFavourite = ref(false);
const isShared = ref(false);
const isCommented = ref(false);
const isBookmarked = ref(false);

async function backToLastPage() {
  await router.go(-1);
}

function showComments() {}

function addToUserBookmarks() {
  isBookmarked.value = !isBookmarked.value;
  (async () => {
    if (isBookmarked.value) {
      const res = await axios.post("/api/add_to_bookmark", {
        url: instanceUrl,
        accessToken: accessToken,
        id: postDetail.id,
      });
      const data = res.data;
      if (!data.success) {
        console.error("failed to add to bookmark");
        return;
      }
    } else {
      const res = await axios.post("/api/remove_from_bookmark", {
        url: instanceUrl,
        accessToken: accessToken,
        id: postDetail.id,
      });
      const data = res.data;
      if (!data.success) {
        console.error("failed to add to bookmark");
      }
    }
  })();
}

function addToUserFavourites() {
  isFavourite.value = !isFavourite.value;
  (async () => {
    if (isFavourite.value) {
      favoriteCount.value += 1;
      const res = await axios.post("/api/add_to_favorite", {
        url: instanceUrl,
        accessToken: accessToken,
        id: postDetail.id,
      });
      const data = res.data;
      if (!data.success) {
        console.error("failed to add to favorite");
      }
    } else {
      favoriteCount.value -= 1;
      const res = await axios.post("/api/remove_from_favorite", {
        url: instanceUrl,
        accessToken: accessToken,
        id: postDetail.id,
      });
      const data = res.data;
      if (!data.success) {
        console.error("failed to remove from favorite");
      }
    }
  })();
}

function sharePost() {}

function doMoreActions(actionKey: string) {
  switch (String(actionKey)) {
    case "copyLink": {
      (async () => {
        const text = postDetail.url || postDetail.card?.url;
        await navigator.clipboard.writeText(text);
      })();
      break;
    }
    case "copyRawLink": {
      (async () => {
        const text = postDetail.url || postDetail.card?.url;
      })();
      break;
    }
    case "share": {
      break;
    }
    case "openFromSource": {
      const url = postDetail.url || postDetail.card?.url;
      window.open(url, "_blank");
      break;
    }
  }
}
</script>

<template>
  <section class="post-card">
    <img
      @click.stop="backToLastPage"
      style="width: 40px; height: 40px; margin-top: 60px; cursor: pointer"
      class="back"
      alt="back"
      src="../assets/back.png"
    />
    <div class="content">
      <div class="header">
        <img
          style="
            margin-top: 10px;
            width: 50px;
            height: 50px;
            border-radius: 20%;
          "
          :src="postDetail.account?.avatar"
          class="avatar"
          alt="avatar"
        />
        <div class="account-name">
          <div style="font-weight: bold; opacity: 1.2">
            {{
              postDetail.account?.displayName || postDetail.account?.username
            }}
          </div>
          <div style="opacity: 0.8">{{ postDetail.account?.acct }}</div>
        </div>
        <div class="publish-time" style="font-weight: bold">
          {{ dayjs(postDetail.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
        </div>
      </div>
      <div class="card-content" v-if="postDetail.card">
        <h2 class="title">
          <a target="_blank" :href="postDetail.tags[0]?.url">{{
            postDetail.tags[0]?.name
          }}</a>
          <span style="margin-left: 10px">{{ postDetail.tags[1]?.name }}</span>
        </h2>
        <h3>{{ postDetail.card?.title }}</h3>
        <p>{{ postDetail.card?.description }}</p>
        <a
          target="_blank"
          :href="postDetail.card?.url"
          class="card-url"
          style="color: darkorange; font-weight: bold; margin-bottom: 10px"
          >{{ postDetail.card?.url }}</a
        >
        <img style="border-radius: 10px" alt="" :src="postDetail.card?.image" />
      </div>
      <div v-else class="media-attachments">
        <h3>{{ postDetail.mediaAttachments?.[0]?.description }}</h3>
        <div v-html="postDetail.content"></div>
        <img
          style="border-radius: 10px"
          alt="preview-url"
          :src="
            postDetail.mediaAttachments?.[0]?.previewUrl ||
            postDetail.mediaAttachments?.[0]?.url
          "
        />
      </div>
      <div class="footer">
        <span
          @click.stop="showComments"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
          title="reply"
          class="reply"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M4 17.17V4h16v6h2V4c0-1.1-.9-2-2-2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h9v-2H5.17z"
            />
            <path fill="currentColor" d="M22.5 16h-2.2l1.7-4h-5v6h2v5z" />
          </svg>
          <div>{{ postDetail.repliesCount || $t("comment") }}</div>
        </span>

        <span
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
          title="share"
          class="share"
          @click.stop="sharePost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92"
            />
          </svg>
          <div>{{ postDetail.reblogsCount || $t("share") }}</div>
        </span>

        <span
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
          title="favourite"
          class="favourite"
          @click.stop="addToUserFavourites"
          :style="{ color: isFavourite ? 'darkred' : '' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"
            />
          </svg>
          <div>{{ favoriteCount || $t("favourite") }}</div>
        </span>
        <span
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
          title="bookmark"
          class="bookmark"
          @click.stop="addToUserBookmarks"
          :style="{ color: isBookmarked ? 'darkorange' : '' }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21 7h-2v2h-2V7h-2V5h2V3h2v2h2zm-2 14l-7-3l-7 3V5c0-1.1.9-2 2-2h7a5.002 5.002 0 0 0 5 7.9z"
            />
          </svg>
          <div>{{ $t("bookmark") }}</div>
        </span>
        <n-dropdown
          trigger="hover"
          placement="bottom-start"
          :options="moreOptions"
          @select="doMoreActions"
          style="font-weight: bold"
        >
          <span
            style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
            @click.stop="openMoreOptionMenu"
            title="more"
            class="more"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m12 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m-6 0c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
              />
            </svg>
            <div>{{ $t("more") }}</div>
          </span>
        </n-dropdown>
      </div>
    </div>
  </section>
</template>

<style scoped>
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

.post-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  margin-left: 80px;
  width: 80%;
  height: 100%;
  overflow: auto;
}

img {
  width: inherit;
  height: inherit;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: start;
}

.content {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 50px;
  border-radius: 30px;
}

.footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
}

.reply,
.share,
.more,
.favourite,
.bookmark {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
    box-shadow: 0 0 10px 5px lightpink;
  }
}

.header {
  &:hover {
    cursor: pointer;
    opacity: 0.8;
    box-shadow: 0 0 10px 5px lightgray;
  }
}
</style>
