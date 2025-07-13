<script setup lang="ts">
import { ref, onMounted, defineProps } from "vue";
import axios from "axios";
import { useAccessTokenStore, useInstanceUrlStore, useRenderCommentBox } from "~/store";
import {
  getAccessTokenStorage,
  getInstanceUrlStorage,
} from "~/composable/constant";

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  accountAcct: {
    type: String,
    required: true,
  },
});
const languages = usePreferredLanguages();
const router = useRouter();
const acct = ref("");
const id = ref("");
const currentAccount = reactive({});

const instanceUrl =
  useInstanceUrlStore().getInstanceUrl || getInstanceUrlStorage();
const accessToken =
  useAccessTokenStore().getAccessToken || getAccessTokenStorage();

onMounted(async () => {
  if (props.accountAcct) {
    acct.value = props.accountAcct;
  }
  if (props.accountId) {
    id.value = props.accountId;
  }
  try {
    const res = await axios.post("/api/account/account_info", {
      url: instanceUrl,
      accessToken: accessToken,
    });
    const data = res.data;
    Object.assign(currentAccount, data);
  } catch (err) {
    console.error("fetch ccurrent account failed", err);
  }
});

watch([() => props.accountAcct, () => props.accountId], async () => {
  if (props.accountAcct) {
    acct.value = props.accountAcct;
  }
  if (props.accountId) {
    id.value = props.accountId;
  }
});

async function openAccountProfile(
  accountId: string | undefined,
  accountAcct: string | undefined,
) {
  const id = accountId || currentAccount.id;
  const acct = accountAcct || currentAccount.acct;
  console.log("open account profile", id, acct);
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
}

const replyContent = ref("");
const wordCount = computed(() => {
  const content = replyContent.value.trim();
  return 500-content.length;
});
const renderState = useRenderCommentBox();

const sendReplyMessage = async () => {
  const content = replyContent.value.trim();
  if (content.length === 0) {
    return;
  }
  try {
    const res = await axios.post("/api/posts/send_reply_message", {
      url: instanceUrl,
      accessToken: accessToken,
      id: props.postId,
      content: content,
    });

    const data = res.data;
    console.log("send reply message success", data);
    if (!renderState.getRenderState) {
      renderState.setRenderState(true)
    }
  } catch (err) {
    console.error("send reply message failed", err);
  }
};
</script>

<template>
  <div class="reply-box">
    <div
      class="avatar"
      @click.stop="openAccountProfile(currentAccount.id, currentAccount.acct)"
    >
      <img
        style="width: 50px; height: 50px; border-radius: 30%; cursor: pointer"
        :src="currentAccount.avatar"
        alt="avatar"
      />
    </div>
    <div class="reply-area">
      <div
        class="reply-account"
        style="cursor: pointer"
        @click="openAccountProfile(id, acct)"
      >
        📋- <span style="color: darkorange">{{ acct }}</span>
      </div>
      <textarea
        class="textarea"
        v-model="replyContent"
        :placeholder="$t('write-a-comment')"
      >
      </textarea>
      <div class="input-operations">
        <span> {{ wordCount }}</span>
        <span @click.stop="sendReplyMessage" class="reply-btn">
          {{ $t("reply") }}</span
        >
      </div>
    </div>
  </div>
</template>


<style scoped>
.textarea {
  width: 100%;
  height: 100px;
  border: 1px solid lightseagreen;
  border-radius: 10px;
  font-size: 1rem;
  resize: none;
  background-color: transparent;
  color: inherit;
}

.reply-account {
  font-size: 1rem;

  &:hover {
    text-decoration: underline;
  }
}

.reply-box {
  margin-top :10%;
  display: flex;
  flex-direction: row;
  width: 95%;
  align-items: start;
  justify-content: start;
  padding: 10px;
  border: 1px solid  rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.reply-area {
  margin-left: 10px;
  width: 100%;
  font-size: 1rem;
}

.input-operations {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-size: 1rem;
}

.reply-btn {
  width: 20%;
  height: 30px;
  font-weight: bold;
  text-align: center;
  border: none;
  border-radius: 10px;
  background-color: mediumpurple;
  color: inherit;

  &:hover {
    cursor: pointer;
    background-color: indigo;
    scale: 1.1;
  }
}
</style>
