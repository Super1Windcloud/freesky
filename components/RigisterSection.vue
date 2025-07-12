<script setup lang="ts">
import { ref, onMounted, watch, onBeforeMount } from "vue";
import RecommendedFollowersList from "~/components/RecommendedFollowersList.vue";
import SearchBar from "~/components/SearchBar.vue";
import LoginAndRegister from "~/components/LoginAndRegister.vue";
import {
  useIsLoggedInStore,
  useInstanceUrlStore,
  useAccessTokenStore,
} from "~/store";

const colorMode = useColorMode();
const isLoggedIn = useIsLoggedInStore();
const loggedStatus = ref(false);
import { detectedIsLoggedIn } from "~/composable/login";
import store from "~/composable/store";
import UserInfoCard from "~/components/UserInfoCard.vue";
import { initSettingStates } from "~/composable/settingStates";

onMounted(async () => {
  await detectedIsLoggedIn(
    () => {
      isLoggedIn.setIsLoggedIn(true);
      loggedStatus.value = true;
      console.dir("login success", loggedStatus.value);
    },
    (url, token) => {
      useInstanceUrlStore().setInstanceUrl(url);
      useAccessTokenStore().setAccessToken(token);
    },
  );
});

onMounted(async () => {
  if (store.session.get("accessToken")) {
    console.log(store.session.get("accessToken"));
    isLoggedIn.setIsLoggedIn(true);
    initSettingStates();
  }
  loggedStatus.value = isLoggedIn.getIsLoggedIn;
});

watch(
  () => isLoggedIn.getIsLoggedIn,
  (newValue) => {
    loggedStatus.value = newValue;
  },
);
</script>

<template>
  <ClientOnly>
    <div class="container">
      <SearchBar />
      <div v-if="loggedStatus">
        <RecommendedFollowersList />
      </div>
      <div v-else>
        <n-dialog-provider>
          <LoginAndRegister />
        </n-dialog-provider>
      </div>
      <div v-if="loggedStatus">
        <UserInfoCard />
      </div>
      <main
        class="about"
        :style="{ color: colorMode.value === 'dark' ? 'white' : 'black' }"
        title="📖 SuperWindCloud"
      >
        <h3>❤️SuperWindCloud</h3>
        <br />
        <ul>
          <li>
            <a target="blank" href="https://github.com/Super1WindCloud">
              <i class="fab fa-facebook-f icon">
                <svg
                  enable-background="new 0 0 128 128"
                  id="Social_Icons"
                  version="1.1"
                  viewBox="0 0 128 128"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g id="_x31__stroke">
                    <g id="Github_1_">
                      <rect
                        clip-rule="evenodd"
                        fill="none"
                        fill-rule="evenodd"
                        height="128"
                        width="128"
                      />
                      <path
                        clip-rule="evenodd"
                        d="M63.996,1.333C28.656,1.333,0,30.099,0,65.591    c0,28.384,18.336,52.467,43.772,60.965c3.2,0.59,4.368-1.394,4.368-3.096c0-1.526-0.056-5.566-0.088-10.927    c-17.804,3.883-21.56-8.614-21.56-8.614c-2.908-7.421-7.104-9.397-7.104-9.397c-5.812-3.988,0.44-3.907,0.44-3.907    c6.42,0.454,9.8,6.622,9.8,6.622c5.712,9.819,14.98,6.984,18.628,5.337c0.58-4.152,2.236-6.984,4.064-8.59    c-14.212-1.622-29.152-7.132-29.152-31.753c0-7.016,2.492-12.75,6.588-17.244c-0.66-1.626-2.856-8.156,0.624-17.003    c0,0,5.376-1.727,17.6,6.586c5.108-1.426,10.58-2.136,16.024-2.165c5.436,0.028,10.912,0.739,16.024,2.165    c12.216-8.313,17.58-6.586,17.58-6.586c3.492,8.847,1.296,15.377,0.636,17.003c4.104,4.494,6.58,10.228,6.58,17.244    c0,24.681-14.964,30.115-29.22,31.705c2.296,1.984,4.344,5.903,4.344,11.899c0,8.59-0.08,15.517-0.08,17.626    c0,1.719,1.152,3.719,4.4,3.088C109.68,118.034,128,93.967,128,65.591C128,30.099,99.344,1.333,63.996,1.333"
                        fill="#3E75C3"
                        fill-rule="evenodd"
                        id="Github"
                      />
                    </g>
                  </g>
                </svg>
              </i>
            </a>
          </li>
          <li>
            <a target="blank" href="https://gitee.com/SuperWindCloud"
              ><i class="fab fa-twitter icon">
                <svg
                  id="Layer_1"
                  style="enable-background: new 0 0 512 512"
                  version="1.1"
                  viewBox="0 0 512 512"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                >
                  <g>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id="SVGID_1_"
                      x1="256"
                      x2="256"
                      y1="0"
                      y2="510.1322"
                    >
                      <stop offset="0" style="stop-color: #41bce7" />
                      <stop offset="1" style="stop-color: #22a6dc" />
                    </linearGradient>
                    <circle class="st0" cx="256" cy="256" r="256" />
                    <g>
                      <path
                        class="st1"
                        d="M380.6,147.3l-45.7,230.5c0,0-6.4,16-24,8.3l-105.5-80.9L167,286.7l-64.6-21.7c0,0-9.9-3.5-10.9-11.2    c-1-7.7,11.2-11.8,11.2-11.8l256.8-100.7C359.5,141.2,380.6,131.9,380.6,147.3z"
                      />
                      <path
                        class="st2"
                        d="M197.2,375.2c0,0-3.1-0.3-6.9-12.4c-3.8-12.1-23.3-76.1-23.3-76.1l155.1-98.5c0,0,9-5.4,8.6,0    c0,0,1.6,1-3.2,5.4c-4.8,4.5-121.8,109.7-121.8,109.7"
                      />
                      <path
                        class="st3"
                        d="M245.8,336.2l-41.7,38.1c0,0-3.3,2.5-6.8,0.9l8-70.7"
                      />
                    </g>
                  </g>
                </svg> </i
            ></a>
          </li>
          <li>
            <a target="blank" href="https://x.com/yuyuzhengu34544"
              ><i class="fab fa-linkedin-in icon">
                <svg
                  height="100%"
                  style="
                    fill-rule: evenodd;
                    clip-rule: evenodd;
                    stroke-linejoin: round;
                    stroke-miterlimit: 2;
                  "
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="100%"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    height="400"
                    style="fill: none"
                    width="400"
                    x="56"
                    y="56"
                  />
                  <path
                    d="M161.014,464.013c193.208,0 298.885,-160.071 298.885,-298.885c0,-4.546 0,-9.072 -0.307,-13.578c20.558,-14.871 38.305,-33.282 52.408,-54.374c-19.171,8.495 -39.51,14.065 -60.334,16.527c21.924,-13.124 38.343,-33.782 46.182,-58.102c-20.619,12.235 -43.18,20.859 -66.703,25.498c-19.862,-21.121 -47.602,-33.112 -76.593,-33.112c-57.682,0 -105.145,47.464 -105.145,105.144c0,8.002 0.914,15.979 2.722,23.773c-84.418,-4.231 -163.18,-44.161 -216.494,-109.752c-27.724,47.726 -13.379,109.576 32.522,140.226c-16.715,-0.495 -33.071,-5.005 -47.677,-13.148l0,1.331c0.014,49.814 35.447,93.111 84.275,102.974c-15.464,4.217 -31.693,4.833 -47.431,1.802c13.727,42.685 53.311,72.108 98.14,72.95c-37.19,29.227 -83.157,45.103 -130.458,45.056c-8.358,-0.016 -16.708,-0.522 -25.006,-1.516c48.034,30.825 103.94,47.18 161.014,47.104"
                    style="fill: #1da1f2; fill-rule: nonzero"
                  />
                </svg> </i
            ></a>
          </li>
          <li>
            <a
              target="blank"
              href="https://www.youtube.com/channel/UCgDOuyFKRfoO4MPvpCJgHCg"
              ><i class="fab fa-google-plus-g icon">
                <svg
                  height="100%"
                  style="
                    fill-rule: evenodd;
                    clip-rule: evenodd;
                    stroke-linejoin: round;
                    stroke-miterlimit: 2;
                  "
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="100%"
                  xml:space="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g>
                    <path
                      d="M501.299,132.766c-5.888,-22.03 -23.234,-39.377 -45.264,-45.264c-39.932,-10.701 -200.037,-10.701 -200.037,-10.701c0,0 -160.105,0 -200.038,10.701c-22.025,5.887 -39.376,23.234 -45.264,45.264c-10.696,39.928 -10.696,123.236 -10.696,123.236c0,0 0,83.308 10.696,123.232c5.888,22.03 23.239,39.381 45.264,45.268c39.933,10.697 200.038,10.697 200.038,10.697c0,0 160.105,0 200.037,-10.697c22.03,-5.887 39.376,-23.238 45.264,-45.268c10.701,-39.924 10.701,-123.232 10.701,-123.232c0,0 0,-83.308 -10.701,-123.236Z"
                      style="fill: #ed1f24; fill-rule: nonzero"
                    />
                    <path
                      d="M204.796,332.803l133.018,-76.801l-133.018,-76.801l0,153.602Z"
                      style="fill: #fff; fill-rule: nonzero"
                    />
                  </g>
                </svg> </i
            ></a>
          </li>
        </ul>
      </main>
    </div>
  </ClientOnly>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: start;
}

.about {
  background-color: transparent;
  color: inherit;
  width: inherit;
  height: 100px;
  border-radius: 20px;
  bottom: 20px;
  position: absolute;
  text-align: center;
  margin-left: 100px;
}

.st0 {
  fill: url(#SVGID_1_);
}

.st1 {
  fill: #ffffff;
}

.st2 {
  fill: #d2e4f0;
}

.st3 {
  fill: #b5cfe4;
}

ul {
  display: flex;
  position: absolute;
  justify-content: start;
  align-items: start;
  margin-left: 60px;
  margin-top: 0;
  transform: translate(-50%, -50%);
}

ul li {
  list-style: none;
}

ul li a {
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 35px;
  display: block;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  z-index: 1;
}

ul li a .icon {
  position: relative;
  color: #262626;
  transition: 0.5s;
  z-index: 3;
}

ul li a:hover .icon {
  transform: rotateY(360deg);
}

ul li a:before {
  content: "";
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f00;
  transition: 0.5s;
  z-index: 2;
}

ul li a:hover:before {
  top: 0;
}

ul li:nth-child(1) a:before {
  background: #3b5999;
}

ul li:nth-child(2) a:before {
  background: #55acee;
}

ul li:nth-child(3) a:before {
  background: #0077b5;
}

ul li:nth-child(4) a:before {
  background: #dd4b39;
}
</style>
