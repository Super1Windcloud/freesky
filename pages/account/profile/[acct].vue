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
const acct = ref("");
const id = ref("");
const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

onMounted(async () => {
  if (route?.query?.id) {
    id.value = String(route.query.id || "");
    try {
      const res = await axios.post("/api/account/special_account_detail/", {
        id: id.value,
        url: instanceUrl,
        access_token: accessToken,
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

    try {
      const res = await axios.post("/api/account/special_account_detail/", {
        id: id,
        url: instanceUrl,
        access_token: accessToken,
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
  <div>
    <p>账号名：{{ acct }}</p>
    <p>ID：{{ id }}</p>
  </div>
</template>

<style scoped></style>
