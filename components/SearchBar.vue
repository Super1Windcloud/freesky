<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from "vue";

import { useLangStore, useQueryStore } from "~/store";

const langStore = useLangStore();
const searchText = ref("");
const search = ref("");
const login = ref("");
const register = ref("");
const router = useRouter();
const queryStore = useQueryStore();
onMounted(() => {
  search.value = $t("search") ?? "Search";
  login.value = $t("login") ?? "Login";
  register.value = $t("register") ?? "Register";
});

const handleSearch = async () => {
  console.log("搜索内容：", searchText.value);
  if (!searchText.value.trim()) return;

  queryStore.setQueryText(searchText.value);
  if (langStore.getLang === "zh") {
    await router.push({
      path: "/zh/searchResultView",
      query: {
        queryText: searchText.value,
      },
    });
  } else if (langStore.getLang === "en") {
    await router.push({
      path: "/searchResultView",
      query: {
        queryText: searchText.value,
      },
    });
  }
};
</script>

<template>
  <div class="search-bar">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M15.597 11.082c.11.29.39.49.7.49s.59-.2.7-.49l.27-.72c.3-.8.45-1.2.66-1.41c.208-.208.602-.357 1.406-.66l.024-.01l.7-.26c.29-.11.49-.39.49-.7s-.2-.59-.49-.7l-.72-.27c-.8-.3-1.2-.45-1.41-.66c-.208-.208-.357-.603-.662-1.408l-.008-.022l-.26-.7a.76.76 0 0 0-.7-.49c-.31 0-.59.2-.7.49l-.27.72c-.3.8-.45 1.2-.66 1.41c-.208.208-.603.358-1.408.662l-.022.008l-.7.26c-.29.11-.49.39-.49.7s.2.59.49.7l.72.27c.8.3 1.2.45 1.41.66c.208.208.357.603.662 1.408l.008.022zm.13-3.19c-.23-.24-.5-.41-.85-.57c.34-.16.61-.33.85-.57c.24-.23.41-.5.57-.85c.16.34.33.61.57.85c.23.24.5.41.85.57c-.34.16-.61.33-.85.57c-.24.23-.41.5-.57.85c-.16-.34-.33-.61-.57-.85m-3.93 11.68c-4.27 0-7.75-3.48-7.75-7.75s3.48-7.75 7.75-7.75c.41 0 .75.34.75.75s-.34.75-.75.75c-3.45 0-6.25 2.8-6.25 6.25s2.8 6.25 6.25 6.25s6.25-2.8 6.25-6.25c0-.41.34-.75.75-.75s.75.34.75.75a7.7 7.7 0 0 1-1.77 4.921l3.55 3.55c.29.29.29.77 0 1.06c-.15.15-.34.22-.53.22s-.38-.07-.53-.22l-3.55-3.55a7.7 7.7 0 0 1-4.92 1.77"
        color="currentColor"
      />
    </svg>
    <input
      v-model="searchText"
      type="text"
      class="search-input"
      @keyup.enter="handleSearch"
    />
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  margin-top: 50px;
  align-items: center;
  width: 100%;
  height: 50px;
  border: 1px solid  lightpink;
  border-radius: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover,
  &:focus-within {
    border-color: skyblue;
    filter: drop-shadow(0 4px 8px rgba(64, 158, 255, 0.3));
  }
}

.search-input {
  margin-left: 10px;
  flex: 1;
  border: none;
  outline: none;
  font-size: 20px;
  background-color: transparent;
  font-weight: bold;
  color: inherit;
}

.search-button {
  border: none;
  background-color: transparent;
  padding: 6px 6px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #66b1ff;
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: inherit;
}
</style>
