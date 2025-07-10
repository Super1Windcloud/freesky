<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import { NInfiniteScroll } from "naive-ui";
import store from "~/composable/store";
import {
  useInstanceUrlStore,
  useAccessTokenStore,
  useQueryStore,
} from "~/store";

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || store.session.get("instanceURL");
const accessToken =
  useAccessTokenStore().getAccessToken || store.session.get("accessToken");

const props = defineProps({
  queryText: {
    type: String,
    required: false,
    default: "",
  },
});

const postsContentList = ref<any[]>([]);
const  loading = ref(false);
const  noMore  = ref(false);
const queryStore = useQueryStore();

watch(
  () => queryStore.getQueryText,
  async () => {
    if (queryStore.getQueryText) {
      postsContentList.value = [];
      props.queryText = queryStore.getQueryText;
      await handleLoad();
    }
  },
);
onMounted(async () => {
  await handleLoad();
});


async function handleLoad() {
  if (!props.queryText) {
    return;
  }

  if (loading.value || noMore.value) {
    return;
  }

  loading.value = true;
}

</script>

<template></template>

<style scoped></style>