<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { NDivider, NH1, NTabs, NTabPane } from "naive-ui";
import SearchAccountsData from "~/components/SearchAccountsData.vue";
import axios from "axios";
import { useInstanceUrlStore, useAccessTokenStore } from "~/store";
import store from "~/composable/store";
import { useQueryStore } from "~/store";
import SearchHashtagsResult from "~/components/SearchHashtagsResult.vue";
import SearchStatusesResult from "~/components/SearchStatusesResult.vue";



const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

const { locales, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();
const accounts = ref([]);
const search = ref("");
const queryStore = useQueryStore();

onMounted(() => {
  if (route.query.queryText) {
    const queryText = route.query.queryText;
    if (queryText) {
      search.value = queryText;
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
  <main class="container" style="width: 95%; height: 90%;margin-top: 40px;">
    <n-h1 style="text-align: center; width: 100%">
      '{{ search }}' {{ $t("searchResult") }}
    </n-h1>
    <n-tabs
      default-value="accounts"
      tab-style="font-weight : bold;background-color : #2b2b2b;"
      type="segment"
      animated
      :addable="false"
      class="custom-tabs"
    >
      <n-tab-pane
        name="accounts"
        :tab="$t('accounts')"
        style="font-weight: bold; width: 100%; height: 740px; overflow: auto"
      >
        <KeepAlive>
          <SearchAccountsData :query-text="search" />
        </KeepAlive>
      </n-tab-pane>
      <n-tab-pane
        name="hashtags"
        :tab="$t('hashtags')"
        style="font-weight: bold; width: 100%; height: 740px; overflow: hidden"
      >
        <KeepAlive>
          <SearchHashtagsResult :query-text="search" />
        </KeepAlive>
      </n-tab-pane>
      <n-tab-pane
        name="statuses"
        :tab="$t('statuses')"
        style="font-weight: bold; width: 100%; height: 740px; overflow: hidden"
      >
        <KeepAlive>
          <SearchStatusesResult :query-text="search" />
        </KeepAlive>
      </n-tab-pane>
    </n-tabs>
  </main>
</template>

<style scoped></style>
