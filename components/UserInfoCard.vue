<script setup lang="ts">
import { ref, reactive } from "vue";
import store from "~/composable/store";
import { useInstanceUrlStore, usePersonalAccountIdStore } from "~/store";
import { useAccessTokenStore } from "~/store";
import { useRouter } from "vue-router";
import { useIsLoggedInStore } from "~/store";
import axios from "axios";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";

const instanceUrlObj = useInstanceUrlStore();
const accessTokenObj = useAccessTokenStore();
const isLoggedIn = useIsLoggedInStore();
const router = useRouter();
const personIdStore = usePersonalAccountIdStore();

function logoutHandle() {
  store.session.del("accessToken");
  store.session.del("instanceURL");
  accessTokenObj.setAccessToken("");
  instanceUrlObj.setInstanceUrl("");
  isLoggedIn.setIsLoggedIn(false);

  router.push("/");
}

const account = reactive({
  avatar : "",
  username: "",
  url    : "",
  id     : "",
  acct   : "",
});
const languages = usePreferredLanguages();

async function openAccountProfile() {
  const id = account.id;
  const acct = account.acct;
  if (id) {
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
  } else {
    console.error("user info card Account not found!");
  }
}

onMounted(async () => {
  const accessToken = getAccessTokenStorage();
  const instanceUrl = getInstanceUrlStorage();

  if (accessToken && instanceUrl) {
    try {
      const res = await axios.post("/api/account/account_info", {
        url: instanceUrl,
        accessToken: accessToken,
      });
      const data = res.data;
      account.avatar = data.avatar;
      account.username = data.username;
      account.url = data.url;
      account.id = data.id;
      account.acct = data.acct;
    } catch (err) {
      console.log("fetch account info error", err);
    }
  }
  if (account.id) {
    personIdStore.setPersonalAccountId(account.id);
  }
});
</script>

<template>
  <div class="card">
    <div
      class="user-info"
      @click.stop="openAccountProfile"
      style="
        height: 50%;
        width: 95%;
        border-radius: 10%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      "
    >
      <div class="avatar" @click.stop="openAccountProfile">
        <img
          style="width: 50px; height: 50px; border-radius: 30%"
          :src="account.avatar"
          alt="avatar"
        />
      </div>
      <div
        class="name"
        style="
          display: flex;
          flex-direction: column;
          align-items: start;
          justify-content: center;
          margin-left: 20px;
          margin-bottom: 10px;
        "
      >
        <h2 style="margin: 0; padding: 0">{{ account.username }}</h2>
        <div style="color: inherit">{{ account.url }}</div>
      </div>
    </div>
    <div
      style="border-bottom: 1px solid lightgrey; width: 100%; margin: 5px 0"
    ></div>

    <div
      class="add-account"
      style="
        height: 25%;
        width: 95%;
        display: flex;
        text-align: center;
        justify-content: start;
        align-items: center;
        cursor: pointer;
      "
    >
      <img
        src="../assets/img.png"
        style="width: 25px; height: 25px; margin-left: 6%; margin-right: 10px"
        alt="addAccount"
      />
      <span>{{ $t("addAccount") }}</span>
    </div>
    <div
      class="logout"
      @click.stop="logoutHandle"
      style="
        height: 25%;
        width: 95%;
        display: flex;
        text-align: center;
        justify-content: start;
        align-items: center;
        cursor: pointer;
      "
    >
      <img
        style="width: 25px; height: 25px; margin-left: 6%; margin-right: 10px"
        src="../assets/logout.png"
        alt="logout"
      />
      <span>{{ $t("logout") }} {{ account.username }}</span>
    </div>
  </div>
</template>

<style scoped>
.user-info:hover {
  background-color: rgba(200, 200, 200, 0.2);
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  width: 100%;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 30px;
  border: thin solid rgba(255, 255, 255, 0.3);
}

.add-account:hover,
.logout:hover {
  background-color: rgba(200, 200, 200, 0.2);
  transform: scale(1.05);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-account,
.logout {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 10px;
  width: 50%;
}
</style>
