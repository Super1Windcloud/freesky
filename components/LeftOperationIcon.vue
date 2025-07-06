<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const SkipToHome = () => {
  router.push("/");
};
const skipToExplore = () => {
  router.push("/explore");
};

const skipToAccount = () => {
  router.push("/account");
};

const skipToSettings = () => {
  router.push("/settings");
};

const skipToNotification = () => {
  router.push("/notification");
};

const skipToBookmark = () => {
  router.push("/bookmark");
};

const skipToFavorite = () => {
  router.push("/favorites");
};

const skipToLogout = () => {
  router.push("/logout");
};
</script>

<template>
  <div class="container">
    <img
      class="logo"
      title="Free Sky"
      alt="logo"
      style="width: 70px; height: 70px; border-radius: 50%"
      src="../assets/logo.jpg"
    />
    <div class="home-icon" title="主页" @click.stop="SkipToHome">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <g fill="currentColor">
          <path
            d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06z"
          />
          <path
            d="m12 5.432l8.159 8.159q.045.044.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198l.091-.086z"
          />
        </g>
      </svg>
    </div>
    <div class="explore-icon" @click.stop="skipToExplore" title="探索">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a9 9 0 0 1 7.843 4.582M12 3a9 9 0 0 0-7.843 4.582m15.686 0A11.95 11.95 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.96 8.96 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.9 17.9 0 0 1 12 16.5a17.9 17.9 0 0 1-8.716-2.247m0 0A9 9 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
    </div>
    <div
      class="notifications-icon"
      @click.stop="skipToNotification"
      title="通知"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 16 16"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M12 5a4 4 0 0 0-8 0v2.379a1.5 1.5 0 0 1-.44 1.06L2.294 9.707a1 1 0 0 0-.293.707V11a1 1 0 0 0 1 1h2a3 3 0 1 0 6 0h2a1 1 0 0 0 1-1v-.586a1 1 0 0 0-.293-.707L12.44 8.44A1.5 1.5 0 0 1 12 7.38zm-5.5 7a1.5 1.5 0 0 0 3 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="bookmarks-icon" @click.stop="skipToBookmark" title="书签">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M6.32 2.577a49.3 49.3 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="favorites-icon" @click.stop="skipToFavorite" title="收藏">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          d="m11.645 20.91l-.007-.003l-.022-.012l-.082-.045q-.108-.06-.301-.173a25.2 25.2 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25C2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052A5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25c0 3.925-2.438 7.111-4.739 9.256a25 25 0 0 1-4.244 3.17a15 15 0 0 1-.383.219l-.022.012l-.007.004l-.003.001a.75.75 0 0 1-.704 0z"
        />
      </svg>
    </div>

    <div class="account-icon" @click.stop="skipToAccount" title="账户">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 16 16"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0m-5-2a2 2 0 1 1-4 0a2 2 0 0 1 4 0M8 9a5 5 0 0 0-4.295 2.437A5.49 5.49 0 0 0 8 13.5a5.49 5.49 0 0 0 4.294-2.063A5 5 0 0 0 8 9"
          clip-rule="evenodd"
        />
      </svg>
    </div>

    <div class="settings-icon" @click.stop="skipToSettings" title="设置">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 20 20"
      >
        <!-- Icon from HeroIcons by Refactoring UI Inc - https://github.com/tailwindlabs/heroicons/blob/master/LICENSE -->
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473q.747.218 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25q.37.669.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a7 7 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a7 7 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a7 7 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a7 7 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295q.218-.747.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a7 7 0 0 1 1.416-.587zM13 10a3 3 0 1 1-6 0a3 3 0 0 1 6 0"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div class="logout-icon" @click.stop="skipToLogout" title="登出">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        style="color: #000"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M6 6.5C4.159 8.148 3 10.334 3 13a9 9 0 1 0 18 0c0-2.666-1.159-4.852-3-6.5M12 2v9m0-9c-.7 0-2.008 1.994-2.5 2.5M12 2c.7 0 2.008 1.994 2.5 2.5"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 30px;
}

.logo {
  margin-top: 45px;
}
.logo,
.home-icon,
.explore-icon,
.notifications-icon,
.bookmarks-icon,
.favorites-icon,
.account-icon,
.settings-icon,
.logout-icon {
  cursor: pointer;

  :hover {
    filter: brightness(90%);
  }
}
</style>
