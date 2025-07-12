<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import { followPerson, getAccountsData, unFollowPerson } from "~/utils/account";
import { NInfiniteScroll } from "naive-ui";
import store from "~/composable/store";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
} from "~/store";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const instanceUrl: string =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken: string =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");


const userFollowStatus = ref<boolean[]>([]);
const loading = ref(false);
const noMore = ref(false);
const accountsData = ref([]);
const queryStore = useQueryStore();

watch(accountsData, () => {
  if (accountsData.value.length > 0) {
    userFollowStatus.value = accountsData.value.map(() => false);
  }
});

watch(
  () => queryStore.getQueryText,
  async () => {
    if (queryStore.getQueryText) {
      userFollowStatus.value = [];
      accountsData.value = [];
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

  const data = await getAccountsData(
    queryStore.getQueryText,
    accountsData.value.length,
    instanceUrl,
    accessToken,
  );
  if (!data) {
    console.warn("no more data");
    noMore.value = true;
    loading.value = false;
    return ;
  }
  const counts = data.lenght;
  let t = new Array(counts).fill(0);
  userFollowStatus.value = t.map(() => false);

  accountsData.value.push(...data);
  loading.value = false;
  noMore.value = false;
}
</script>

<template>
  <div class="container">
    <n-infinite-scroll style="height: 100%" :distance="10" @load="handleLoad">
      <div v-for="(item, index) in accountsData" :key="index" class="user">
        <img
          style="
            margin-left: 30px;
            border-radius: 30%;
            width: 70px;
            height: 70px;
          "
          class="avatar"
          :src="item.avatar"
          alt="user avatar"
        />
        <div
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
              color: white;
            "
          >
            {{ item.displayName || item.username }}
          </div>
          <div
            style="
              font-weight: bold;
              max-width: 100px;
              white-space: nowrap;
              text-wrap: nowrap;
              font-size: medium;
            "
          >
            {{ item.followersCount }} {{ $t("followersCount") }}
          </div>

          <div
            style="
              font-size: small;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-wrap: nowrap;
              max-width: 200px;
              opacity: 0.8;
            "
          >
            {{ item.acct }}
          </div>
        </div>

        <button
          @click.stop="
            followPerson(item.id, index, instanceUrl, accessToken, () => {
              userFollowStatus[index] = true;
            })
          "
          v-if="!userFollowStatus[index]"
          class="follow"
        >
          {{ $t("follow") }}
        </button>
        <button
          @click.stop="
            unFollowPerson(item.id, index, instanceUrl, accessToken, () => {
              userFollowStatus[index] = false;
            })
          "
          v-else
          class="follow"
        >
          {{ $t("unfollow") }}
        </button>
      </div>
      <h1 style="text-align: center" v-if="loading" class="text">加载中...</h1>
      <h1 style="text-align: center" v-if="noMore" class="text">
        没有更多了 🤪
      </h1>
    </n-infinite-scroll>
  </div>
</template>

<style scoped>
.container {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  height: 97%;
  padding: 7px 10px;
}

.user {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  margin-top: 10px;
}

.follow {
  margin-left: auto;
  margin-right: 30px;
  width: 100px;
  height: 50px;
  cursor: pointer;
  border-radius: 40px;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
  background-color: darkgreen;

  &:hover {
    background-color: orchid;
  }
}
</style>
