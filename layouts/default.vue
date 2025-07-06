<script setup lang="ts">

import RigisterSection from "~/components/RigisterSection.vue";
</script>

<template>
  <div class="layout-container">
    <LeftOperationIcon class="left"/>
    <div class="center">
      <slot/>
    </div>
    <RigisterSection class="right"/>
  </div>

</template>

<style scoped>

.layout-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  position: relative;
  font-family: Arial, sans-serif;
  padding: 0;
  margin-left: 200px;

}


.center {
  height: 100%;
  width: 1000px;
  margin-left: 50px;
  padding: 0;
  background-color: transparent;

}

.right {
  height: 100%;
  width: 500px;
  flex-shrink: 0;
  background-color: transparent;
  margin-left: 60px;
  padding: 0;
}

</style>