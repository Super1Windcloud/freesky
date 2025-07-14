<script setup lang="ts" xmlns="">
import { ref, onMounted, reactive, watch, nextTick } from "vue";
import { useSearchPostDetailStore, useShowCommentStore } from "~/store";
import dayjs from "dayjs";
import axios from "axios";
import { useRouter } from "vue-router";

const postDetailStore = useSearchPostDetailStore();
const postDetail = reactive({}) as any;
import { useInstanceUrlStore, useAccessTokenStore } from "~/store";
import PostComment from "~/components/statuses/PostComment.vue";

const router = useRouter();
import Lenis from "lenis";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import CommentBox from "~/components/statuses/CommentBox.vue";
import FooterOpertion from "~/components/FooterOpertion.vue";

const contentRef = ref<HTMLElement | null>(null);

onMounted(() => {
  nextTick(() => {
    const content = contentRef.value;
    if (!content) {
      console.error("contentRef or wrapperRef is null");
      return;
    }

    const lenis = new Lenis({
      wrapper: content,
      content: content,
      autoRaf: true,
    });
    lenis.resize();
  });
});

onMounted(() => {
  nextTick(() => {
    window.dispatchEvent(new Event("resize"));
    const event = new WheelEvent("wheel", {
      deltaY: -100, // 向上滚动
      ctrlKey: true, // 模拟按住 Ctrl
    });

    window.dispatchEvent(event);
  });
});

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

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
    shareCount.value = postDetail.reblogsCount;
    commentCount.value = postDetail.repliesCount;
  }
});

const commentCount = ref(0);
const favoriteCount = ref(0);
const shareCount = ref(0);
const isFavourite = ref(true);
const isShared = ref(false);
const isCommented = ref(false);
const isBookmarked = ref(false);
const openCommentView = ref(true);
const showCommentView = useShowCommentStore();

onMounted(() => {
  nextTick(() => {
    openCommentView.value = showCommentView.getShowComment;
  });
});

watch(
  () => showCommentView.getShowComment,
  () => {
    openCommentView.value = showCommentView.getShowComment;
  },
);

async function backToLastPage() {
  await router.go(-1);
}

function openSourcePost() {
  const url = postDetail.card?.url;
  window.open(url, "_blank");
}
const languages = usePreferredLanguages() ;

async function openAccountProfile(account) {
  const id = account.id;
  const acct = account.acct;
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

<template>
  <section class="post-card">
    <img
      @click.stop="backToLastPage"
      style="width: 40px; height: 40px; margin-top: 60px; cursor: pointer"
      class="back"
      alt="back"
      src="../assets/back.png"
    />
    <div ref="contentRef" class="content no-scrollbar">
      <div class="header" @click.stop="openAccountProfile(postDetail.account)">
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
          style="
            color: darkorange;
            max-width: 50%;
            width: 50%;
            white-space: nowrap;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            font-weight: bold;
            margin-bottom: 10px;
          "
          >{{ postDetail.card?.url }}</a
        >
        <div class="img-container" @click.stop="openSourcePost()">
          <img
            style="border-radius: 10px"
            alt=""
            :src="postDetail.card?.image"
          />
          <div style="font-size: 1rem">{{ postDetail.card?.title }}</div>
        </div>
      </div>
      <div v-else class="media-attachments">
        <h3>{{ postDetail.mediaAttachments?.[0]?.description }}</h3>
        <div  class="html-content" v-html="postDetail.content"></div>
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
        <FooterOpertion :postDetail="postDetail" />
      </div>
      <div class="reply-area" v-if="openCommentView">
        <PostComment
          :postId="postDetail.id"
          :accountId="postDetail.account?.id"
          :accountAcct="postDetail.account?.acct"
        />
        <CommentBox :post-id="postDetail.id" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.reply-area {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
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

.post-card {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 95%;
  height: 95%;
  overflow: auto;
}

img {
  width: 100%;
  height: 100%;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: start;
}

.content {
  will-change: transform;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px;
  margin-top: 50px;
  border-radius: 30px;
  overflow: auto;
  width: 95%;
  max-width: 95%;
  min-width: 95%;
  height: 100%;
}

.img-container {
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;

  div {
    text-align: start;
    margin-left: 10px;

    &:hover {
      cursor: pointer;
      color: purple;
      border-radius: 30%;
    }
  }

  &:hover {
    cursor: pointer;
  }
}

.footer {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
}

.header {
  &:hover {
    cursor: pointer;
    opacity: 0.8;

    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.3);
  }
}

.card-content,
.media-attachments {
  max-width: 100%;
  width: 100%;
  white-space: wrap;
  word-wrap: break-word;
}

.no-scrollbar {
  overflow: hidden;
}

.no-scrollbar {
  overflow: auto;
  scrollbar-width: none; /**隐藏滚动条 **/
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
