<script setup lang="ts">
import { NDropdown } from "naive-ui";
import { ref  ,onMounted} from "vue";
import axios from "axios";
import { useAccessTokenStore, useInstanceUrlStore, useShowCommentStore } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";

const postDetail = reactive({});
const props = defineProps({
  postDetail: {
    type: Object,
    required: true,
  },
});
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

const commentCount = ref(0);
const favoriteCount = ref(0);
const shareCount = ref(0);
const isFavourite = ref(false);
const isShared = ref(false);
const isBookmarked = ref(false);
const openCommentView = ref(false);
const showCommentStore = useShowCommentStore();


watch(
  () => props.postDetail,
  (newVal) => {
    if (newVal && Object.keys(newVal).length > 0) {
      isFavourite.value = !!newVal.favourited;
      isShared.value = !!newVal.reblogged;
      isBookmarked.value = !!newVal.bookmarked;
      favoriteCount.value = newVal.favouritesCount;
      shareCount.value = newVal.reblogsCount;
      commentCount.value = newVal.repliesCount;
      Object.assign(postDetail, newVal);
    }
  },
  { immediate: true, deep: true }
);

onMounted(() => {
  const __postDetail = props.postDetail;
  if (Object.keys(__postDetail).length > 0) {
    isFavourite.value = !!__postDetail.favourited;
    isShared.value = !!__postDetail.reblogged;
    isBookmarked.value = !!__postDetail.bookmarked;
    favoriteCount.value = __postDetail.favouritesCount;
    shareCount.value = __postDetail.reblogsCount;
    commentCount.value = __postDetail.repliesCount;
    Object.assign(postDetail, __postDetail);
  } else {
  }
});

function showComments() {
  openCommentView.value = !openCommentView.value;
  showCommentStore.setShowComment(openCommentView.value);
  window.dispatchEvent(new Event("resize"));
  const event = new WheelEvent("wheel", {
    deltaY: -100, // 向上滚动
    ctrlKey: true, // 模拟按住 Ctrl
  });

  window.dispatchEvent(event);
}

const isDark = usePreferredDark();

const dropdownTheme = computed(() => {
  return isDark.value
    ? {
        // 暗色主题
        color: "#2b2b2b",
        optionColorHover: "#3c3c3c",
        textColor: "#f5f5f5",
        optionTextColorHover: "#ffffff",
      }
    : {
        // 浅色主题
        color: "#ffffff",
        optionColorHover: "#eeeeee",
        textColor: "#333333",
        optionTextColorHover: "#000000",
      };
});

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

function sharePost() {
  isShared.value = !isShared.value;
  (async () => {
    if (isShared.value) {
      shareCount.value += 1;
      const res = await axios.post("/api/add_to_share", {
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
      shareCount.value -= 1;
      const res = await axios.post("/api/remove_from_share", {
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
</script>

<template>
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
    <div>{{ commentCount || $t("comment") }}</div>
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
    :style="{ color: isShared ? 'lightgreen' : '' }"
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
    <div>{{ shareCount || $t("share") }}</div>
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
    :style="{ color: isFavourite ? 'red' : '' }"
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
    :style="{
      borderRadius: '10%',
    }"
    :theme-overrides="dropdownTheme"
  >
    <span
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
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
</template>

<style scoped>
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
</style>
