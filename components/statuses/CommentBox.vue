<template>
  <div class="comment-box">
    <!-- 评论列表 -->
    <div v-for="comment in comments" :key="comment.id" class="comment-item">
      <div class="avatar">
        <img :src="comment.user.avatar" alt="avatar" />
      </div>
      <div class="comment-content">
        <div class="author">{{ comment.user.name }}</div>
        <div class="time">{{ formatTime(comment.time) }}</div>
        <div class="text">{{ comment.text }}</div>
      </div>
    </div>

    <!-- 发表评论 -->
    <div class="comment-input">
      <textarea v-model="newComment" placeholder="请输入评论..." />
      <button @click="submitComment" :disabled="!newComment.trim()">发送</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const comments = ref([
  {
    id: 1,
    user: {
      name: "用户A",
      avatar: "https://via.placeholder.com/40",
    },
    time: new Date(),
    text: "这是第一条评论",
  },
]);

const newComment = ref("");

function submitComment() {
  comments.value.push({
    id: Date.now(),
    user: {
      name: "当前用户",
      avatar: "https://via.placeholder.com/40",
    },
    time: new Date(),
    text: newComment.value,
  });
  newComment.value = "";
}

function formatTime(date: Date) {
  return date.toLocaleString(); // 可换成 dayjs
}
</script>

<style scoped>
.comment-box {
  padding: 20px;
  border-radius: 10px;
  background-color: var(--comment-bg, #f5f5f5);
}

.comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.author {
  font-weight: bold;
}

.time {
  font-size: 12px;
  color: gray;
}

.text {
  margin-top: 5px;
}

.comment-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border-radius: 5px;
  resize: vertical;
}

button {
  align-self: flex-end;
  padding: 6px 16px;
  background-color: #42b983;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
