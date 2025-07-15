<script setup lang="ts">
import Back from "~/components/comman/back.vue";
import AvatarCommon from "~/components/accounts/avatarCommon.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAccessTokenStore, useInstanceUrlStore } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import { formatTime } from "~/utils";

interface UserDataStruct {
  username: string;
  acct: string;
  id: string;
  displayName: string;
  bio: boolean;
  avatar: string;
  createdAt: string;
  header: string;
}

const route = useRoute();

const personalData = reactive<UserDataStruct>({});
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

onMounted(async () => {
  if (route?.query?.id) {
    const id = String(route.query.id || "");
    if (!id) {
      console.error("special account id is not exist");
      return;
    }

    try {
      const res = await axios.post("/api/account/special_account_detail/", {
        id: id,
        url: instanceUrl,
        accessToken: accessToken,
      });
      const data = res.data;
      Object.assign(personalData, data);
    } catch (error) {
      console.error("account detail profile error", error);
    }
  } else {
    const url = new URL(window.location.href);
    const id = url.searchParams.get("id");
    if (!id) {
      console.error("special account id is not exist from href");
      return;
    }
    try {
      const res = await axios.post("/api/account/special_account_detail/", {
        id: id,
        url: instanceUrl,
        accessToken: accessToken,
      });
      const data = res.data;
      Object.assign(personalData, data);
    } catch (error) {
      console.error("account detail profile error", error);
    }
  }

  console.log("personalData", personalData);
});

function editPersonalProfile() {}
</script>

<template>
  <div class="back">
    <Back />
  </div>
  <div class="bg-img">
    <img :src="personalData.header" alt="" />
  </div>

  <main class="personal-container">
    <div class="user-info">
      <div class="avatar">
        <img :src="personalData.avatar" alt="" />
        <button @click.stop="editPersonalProfile" class="edit-btn">
          {{ $t("editProfile") }}
        </button>
      </div>
      <div class="name-info">
        <h1>{{ personalData.displayName || personalData.username }}</h1>
        <h3 style="opacity: 0.8">{{ personalData.acct }}</h3>
        <span>🌏{{ formatTime(personalData.createdAt) }}</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-img {
  width: 100%;
  aspect-ratio: 3 / 1; /* 或者你根据实际图像比例设置 */
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  border: none;
}

.bg-img img {
  position: absolute;
  margin-top: 50px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.avatar {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  width: 100%;
  height: auto;
  background-color: green;

  button {
    padding: 10px;
    margin-left: auto;
    border-radius: 10px;
    border: 1px solid mediumpurple;
    background-color: transparent;
    color: inherit;

    &:hover {
      scale: 1.1;
      background-color: lightsalmon;
    }
  }
}

img {
  width: 20%;
  height: auto;
  border-radius: 20px;
  margin-top: -10%;
}

.user-info {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  z-index: 100;
  width: 100%;
  height: 100%;
  margin-left: 10px;
  margin-right: 10px;
}

.back {
  position: absolute;
  z-index: 1000;
}

.personal-container {
  width: 100%;
  height: 89%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  background-color: transparent;
}
</style>
