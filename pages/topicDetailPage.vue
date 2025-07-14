<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { useAccessTokenStore, useInstanceUrlStore } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import axios from "axios";
import AvatarCommon from "~/components/accounts/avatarCommon.vue";
import Lenis from "lenis";

const route = useRoute();
const router = useRouter();
const hashtagsData = ref([]);
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();
const tagName = ref("");
const tagId = ref("");
const followState = ref(false);

onMounted(async () => {
  if (route.query) {
    const name = route.query.name;
    const id = route.query.id;
    tagName.value = name;
    tagId.value = id;
    try {
      const res = await axios.post("/api/hashtags/get_special_hashtags_data", {
        id,
        name,
        url: instanceUrl,
        accessToken: accessToken,
      });

      const data = res.data;
      hashtagsData.value = data;
      const res2 = await axios.post("/api/hashtags/get_hashtags_follow_state", {
        id,
        name,
        url: instanceUrl,
        accessToken: accessToken,
      });

      const state = res2.data;
      followState.value = state;
    } catch (error) {
      console.log("get hashtags data error", error);
    }
  } else {
    const url = new URL(window.location.href);
    const name = url.searchParams.get("name");
    const id = url.searchParams.get("id");
    if (name && id) {
      tagName.value = name;
      tagId.value = id;
      try {
        const res = await axios.post(
          "/api/hashtags/get_special_hashtags_data",
          {
            id,
            name,
            url: instanceUrl,
            accessToken: accessToken,
          },
        );
        const data = res.data;
        hashtagsData.value = data;
        const res2 = await axios.post(
          "/api/hashtags/get_hashtags_follow_state",
          {
            id,
            name,
            url: instanceUrl,
            accessToken: accessToken,
          },
        );

        const state = res2.data;
        followState.value = state;
      } catch (error) {
        console.log("get hashtags data error", error);
      }
    }
  }
});

async function backToLastPage() {
  await router.go(-1);
}

async function handleFollowTopic() {
  try {
    if (followState.value) {
      followState.value = false;
      await axios.post("/api/hashtags/unfollow_special_tags", {
        id: tagId.value,
        name: tagName.value,
        url: instanceUrl,
        accessToken: accessToken,
      });
    } else {
      followState.value = true;

      await axios.post("/api/hashtags/follow_special_tags", {
        id: tagId.value,
        name: tagName.value,
        url: instanceUrl,
        accessToken: accessToken,
      });
    }
  } catch (error) {
    console.error("follow topic error", error);
  }
}

const contentRef = ref<HTMLElement>();

onMounted(() => {
  const lenis = new Lenis({
    wrapper: contentRef.value,
    autoRaf: true,
    allowNestedScroll: true,
    autoResize: true,
  });
});
</script>

<template>
  <main class="topic-container">
    <img
      @click.stop="backToLastPage"
      style="width: 40px; height: 40px; margin-top: 60px; cursor: pointer"
      class="back"
      alt="back"
      src="../assets/back.png"
    />
    <div class="topic-title">
      <h1>#{{ tagName }}</h1>
      <button class="follow-btn" @click.stop="handleFollowTopic">
        {{ !followState ? $t("followTopic") : $t("unfollowTopic") }}
      </button>
    </div>
    <div ref="contentRef" class="scroll-wrapper">
      <section
        v-for="(tag, index) in hashtagsData"
        :key="index"
        class="tag-container"
      >
        <div class="header">
          <AvatarCommon :comment="tag" />
        </div>
        <div class="tag-content">
          <div v-html="tag.content"></div>
          <span class="tags" v-for="(child_tag, index) in tag.tags">
            <a target="_blank" :href="child_tag.url">{{ child_tag.name }}</a>
          </span>
        </div>
        <div class="image-grid">
          <div
            class="image-item"
            v-for="(media, index) in tag.mediaAttachments"
            :key="index"
          >
            <img
              :src="media.previewUrl || media.url || media.remoteUrl"
              alt="media"
            />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 6px;
  width: 100%;
  height :400px;
}

.image-item {
  aspect-ratio: 1 / 1; /* 你也可以改成 16 / 9 */
  overflow: hidden;
  border-radius: 8px;
  position: relative;
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

a {
  margin-right: 10px;
  color: darkorange;

  &:hover {
    text-decoration: underline;
  }
}

.tag-content {
  width: 100%;
}

.scroll-wrapper > * {
  overflow: visible;
  will-change: transform;
}

.scroll-wrapper {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  position: relative;
}

.tag-container {
  width: 98%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  border-radius: 10px;
  padding: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.header {
  width: 100%;
}

.topic-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 100%;
  height: 100%;
}

.topic-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 6%;
  background-color: transparent;
  margin-top: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;

  .follow-btn {
    margin-left: auto;
    margin-right: 0;
    border: none;
    text-align: center;
    text-decoration: none;
    color: inherit;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 10px;
    height: 70%;
    cursor: pointer;
    background-color: mediumpurple;

    &:hover {
      background-color: indigo;
    }
  }
}
</style>
