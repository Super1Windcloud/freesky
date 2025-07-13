<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

import { useInstanceUrlStore, useAccessTokenStore } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

const recommendList = ref([]);

const followerList = ref([]);

onMounted(async () => {
  if (!instanceUrl || !accessToken) {
    console.error("Access token and instance url not found.");
    return;
  }
  try {
    const res = await axios.post("/api/get_recommend_list", {
      url: instanceUrl,
      accessToken: accessToken,
    });

    const data = res.data;
    console.log(data);
    recommendList.value = data;
    followerList.value = new Array(data.length).fill(false);
    console.log(followerList.value);
  } catch (error) {
    console.log("fetch recommend list failed: " + error);
  }
});

async function followPerson(id: string, index: number) {
  try {
    let res = await axios.post("/api/follow-person", {
      url: instanceUrl,
      accessToken: accessToken,
      id: id,
    });
    const data = res.data;
    if (!data.success) {
      console.error("follow failed", data.message);
      return;
    }
    followerList.value[index] = true;
  } catch (error) {
    console.log("follow error", error);
  }
}

async function unFollowPerson(id: string, index: number) {
  try {
    let res = await axios.post("/api/unfollow_person", {
      url: instanceUrl,
      accessToken: accessToken,
      id: id,
    });
    const data = res.data;
    if (!data.success) {
      console.error("unfollow failed", data.message);
      return;
    }
    followerList.value[index] = false;
  } catch (error) {
    console.log("unfollow error", error);
  }
}

const router = useRouter();
const languages =usePreferredLanguages() ;

async function openAccountProfile(item: Object) {
  const id = item.id;
  const acct = item.acct;
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
    path: `/account/profile/${acct}`,
    query: { id: id },
  });
}


</script>

<template>
  <div class="container">
    <h2>{{ $t("Recommendations") }}</h2>
    <div class="user" v-for="(item, index) in recommendList" :key="index">
      <img
        @click.stop="openAccountProfile(item)"
        style="margin-left: 30px; border-radius: 30%; width: 50px; height: 50px"
        class="avatar"
        :src="item.avatar"
        alt="user avatar"
      />
      <div
        @click.stop="openAccountProfile(item)"
        class="display-name"
        style="
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: start;
          margin-left: 10px;
          justify-content: center;
        "
      >
        <div
          style="
            font-weight: bold;
            max-width: 100px;
            white-space: nowrap;
            text-wrap: nowrap;
            font-size: medium;
            overflow: hidden;
            text-overflow: ellipsis;
          "
        >
          {{ item.displayName || item.username }}
        </div>
        <div
          style="
            font-size: small;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-wrap: nowrap;
            max-width: 150px;
            opacity: 0.8;
          "
        >
          {{ item.acct }}
        </div>
      </div>

      <button
        @click.stop="followPerson(item.id, index)"
        v-if="!followerList[index]"
        class="follow"
      >
        {{ $t("follow") }}
      </button>
      <button
        @click.stop="unFollowPerson(item.id, index)"
        v-else
        class="follow"
      >
        {{ $t("unfollow") }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
  border: 1px solid lightsalmon;
  border-radius: 20px;
  width: 100%;
  height: 400px;
  margin-top: 50px;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  cursor: pointer;
}

.follow {
  width: 100px;
  height: 40px;
  cursor: pointer;
  border-radius: 20px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    background-color: orchid;
  }
}

button {
  margin-left: auto;
  margin-right: 10px;
  background-color: slategray;
  color: inherit;
}
</style>
