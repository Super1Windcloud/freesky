<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { useAccessTokenStore, useInstanceUrlStore } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";
import axios from "axios";

const route = useRoute();
const accountData = reactive({});

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
      Object.assign(accountData, data);
      return data;
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
      Object.assign(accountData, data);
      return data;
    } catch (error) {
      console.error("account detail profile error", error);
    }
  }
});
</script>

<template>
  <div class="account-container">
    <p>账号名：{{ accountData.displayName || accountData.username }}</p>
    <p>ID：{{ accountData.id }}</p>
  </div>
</template>

<style scoped>
.account-container {
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  width: 100%;
  height: 90%;
  margin-top: 50px;
  background-color: green;
}
</style>
