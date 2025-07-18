<script setup lang="ts">
 
import { onMounted, ref, watch } from "vue";
import { NDivider, NH2, NTabs, NTabPane } from "naive-ui";

import SearchAccountsData from "~/components/SearchAccountsData.vue";
import axios from "axios";
import { useInstanceUrlStore, useAccessTokenStore } from "~/store";
import store from "~/composable/store";
import { useQueryStore } from "~/store";
import SearchHashtagsResult from "~/components/SearchHashtagsResult.vue";
import SearchStatusesResult from "~/components/SearchStatusesResult.vue";

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL") || store.cookie.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken") || store.cookie.get("accessToken");

const { locales, setLocale } = useI18n();
const route = useRoute();
const accounts = ref([]);
const search = ref("");
const queryStore = useQueryStore();

onMounted(() => {
  if (route.query.queryText) {
    const queryText = route.query.queryText;
    if (queryText) {
      search.value = queryText;
      queryStore.setQueryText(queryText);
    } else {
      search.value = queryStore.getQueryText || "";
    }
  } else {
    const text = window.location.href.trim();
    const url = new URL(text);
    const query = url.searchParams.get("query");
    if (query) {
      console.log("ref query", query);
      search.value = query;
      queryStore.setQueryText(query);
    }
  }
});

watch(
  () => queryStore.getQueryText,
  (queryText) => {
    if (queryText) {
      console.log("ref query", queryText);
      search.value = queryText;
    }
  },
);

watch(
  () => route.query.queryText,
  (queryText) => {
    if (queryText) {
      console.log("route query change to", queryText);
      search.value = queryText;
      queryStore.setQueryText(queryText);
    }
  },
);

async function getAccountsData(queryText: string) {
  try {
    const res = await axios.post("/api/get_search_result", {
      url: instanceUrl,
      accessToken: accessToken,
      queryText: queryText,
      type: "accounts",
    });
    const data = res.data;
    console.log("account data", data);
    return data;
  } catch (error) {
    console.error("get accounts data ", error);
  }
}

onMounted(() => {
  function getPreferredLanguage() {
    // 1. 检查URL参数（如 ?lang=zh）
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    if (urlLang) return urlLang;
    const storedLang = localStorage.getItem("preferredLanguage");
    if (storedLang) return storedLang;
    const browserLang = navigator.language || "en";
    return /^zh/i.test(browserLang) ? "zh" : "en";
  }

  if (getPreferredLanguage() === "zh") {
    setLocale("zh");
  } else {
    setLocale("en");
  }
});
</script>

<template>
  <main
    class="container"
    style="
      width: 100%;
      height: 90%;
      margin-top: 50px;
      min-width: 100%;
      min-height: 90%;
    "
  >
    <n-h2 style="text-align: center; width: 100%; color: inherit">
      '{{ search }}' {{ $t("searchResult") }}
    </n-h2>

    <n-tabs
      default-value="accounts"
      type="bar"
      justify-content="space-around"
      style="
        width: 100%;
        height: 90%;
        background-color: transparent;
        color: inherit;
      "
      tab-style="font-weight: bold;background-color: transparent; color : inherit "
      pane-wrapper-style=" background-color: transparent; color : inherit "
      pane-style=" background-color: transparent; color : inherit "
    >
      <n-tab-pane
        name="accounts"
        :tab="$t('accounts')"
        style="font-weight: bold; width: 100%; height: 100%"
      >
        <KeepAlive>
          <SearchAccountsData />
        </KeepAlive>
      </n-tab-pane>
      <n-tab-pane
        name="hashtags"
        :tab="$t('hashtags')"
        style="font-weight: bold; width: 100%; height: 100%"
      >
        <KeepAlive>
          <SearchHashtagsResult />
        </KeepAlive>
      </n-tab-pane>
      <n-tab-pane
        name="statuses"
        :tab="$t('statuses')"
        style="font-weight: bold; width: 100%; height: 100%"
      >
        <KeepAlive>
          <SearchStatusesResult />
        </KeepAlive>
      </n-tab-pane>
    </n-tabs>
  </main>
</template>

<style scoped></style>
