<template>
  <div class="comment-box">
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <div class="avatar" @click.stop="openAccountProfile(comment)">
        <img
          style="
            width: 50px;
            height: 50px;
            margin-left: 10%;
            border-radius: 30%;
          "
          :src="comment.account.avatar"
          alt="avatar"
        />
      </div>
      <div class="comment-content">
        <div
          class="author"
          style="font-weight: bold; margin-top: 30%; color: inherit"
        >
          {{ comment.account.displayNmae || comment.account.username }}
        </div>
        <div class="acct" style="opacity: 0.7">@{{ comment.account.acct }}</div>
        <div class="comment">
          <div v-html="comment.content"></div>
        </div>
        <div class="comment-footer"></div>
      </div>
      <div
        class="time"
        style="margin-left: auto; margin-right: 10px; opacity: 0.8"
      >
        {{ formatTime(comment.createdAt) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useRenderCommentBox,
} from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import dayjs from "dayjs";

const props = defineProps({
  postDetail: {
    type: Object,
    required: false,
  },
  postId: {
    type: String,
    required: true,
  },
});
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();
const comments = ref([]);
const useRenderState = useRenderCommentBox();

watch(
  () => useRenderState.getRenderState,
  async () => {
    if (useRenderState.getRenderState) {
      console.log("render comment box");
      try {
        const res = await axios.post("/api/posts/get_post_comments", {
          id: props.postId,
          url: instanceUrl,
          accessToken: accessToken,
        });
        const data = res.data;
        comments.value = data.comments;
      } catch (err) {
        console.error("fetch comments error", err);
      }
      useRenderState.setRenderState(false);
    }
  },
);

watch(
  () => props.postId,
  async (newVal) => {
    if (newVal) {
      try {
        const res = await axios.post("/api/posts/get_post_comments", {
          id: props.postId,
          url: instanceUrl,
          accessToken: accessToken,
        });
        const data = res.data;
        comments.value = data.comments;
      } catch (err) {
        console.error("fetch comments error", err);
      }
    }
  },
);

onMounted(async () => {
  const url = new URL(window.location.href);
  let postid = url.searchParams.get("id");
  postid = props.postId || postid;
  if (!postid) return;
  try {
    console.warn("id type", typeof postid);
    const res = await axios.post("/api/posts/get_post_comments", {
      id: postid,
      url: instanceUrl,
      accessToken: accessToken,
    });
    const data = res.data;
    comments.value = data.comments;
  } catch (err) {
    console.error("fetch comments error", err);
  }
});

function formatTime(date: string) {
  const newDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
  const now = dayjs();
  const diff = now.diff(dayjs(newDate), "second");
  if (diff < 60) {
    return "刚刚";
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + "分钟前";
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + "小时前";
  } else if (diff < 604800) {
    return Math.floor(diff / 86400) + "天前";
  } else {
    return newDate;
  }
}

const router = useRouter();
const languages = usePreferredLanguages();

async function openAccountProfile(comment) {
  const id = comment.account.id;
  const acct = comment.account.acct;

  if (languages.value) {
    const langs = languages.value;
    if (typeof langs === "object" && langs.length > 0) {
      if (langs[0] === "zh-CN") {
        await router.push({
          path: `/zh/account/profile/${acct}/`,
          query: {
            id: id,
          },
        });
        return;
      }
    }
  }

  await router.push({
    path: `/account/profile/${acct}/`,
    query: {
      id: id,
    },
  });
}
</script>

<style scoped>
.comment-content {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  margin-left: 20px;
}

.comment-box {
  border-radius: 10px;
  max-width: 100%;
  max-height: 100%;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
}

.comment-footer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
