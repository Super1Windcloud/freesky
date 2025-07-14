<script setup lang="ts">
import { ref, defineProps } from "vue";
import dayjs from "dayjs";

defineProps({
  comment: {
    type: Object,
    required: true,
  },
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

<template>
  <main>
    <div class="avatar" @click.stop="openAccountProfile(comment)">
      <img
        style="width: 50px; height: 50px;margin-top: 5px; margin-left: 10%; border-radius: 30%"
        :src="comment.account.avatar"
        alt="avatar"
      />
    </div>
    <div class="display-name">
      <div
        class="author"
        style="font-weight: bold;  color: inherit"
      >
        {{ comment.account.displayNmae || comment.account.username }}
      </div>
      <div class="acct" style="opacity: 0.7">@{{ comment.account.acct }}</div>
    </div>
    <div
      class="time"
      style="margin-left: auto; margin-right: 10px; opacity: 0.8"
    >
      🌏{{ formatTime(comment.createdAt) }}
    </div>
  </main>
</template>

<style scoped>

.display-name{
  margin-left: 10px;
}
main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  cursor: pointer;
}
</style>