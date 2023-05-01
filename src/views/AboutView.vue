<template>
  <div class="about">
    <button @click="apiStore.fetchNewCharacter(apiStore.currentId++)" class="next-fetch">
      Next Character
    </button>
    <h1>{{ apiStore.api.data?.name }}</h1>
    <div v-if="apiStore.api.isFetching">Loading...</div>
    <img :src="apiStore.api.data?.image" alt="" />
    {{ apiStore.protected }}
  </div>
</template>

<style>
.about {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
}
.next-fetch {
  padding: 1rem;
  margin: 0.25rem;
  background-color: #00bd7e;
  font-size: large;
}
</style>

<script setup lang="ts">
import { useApiStore } from '../stores/counter'
const apiStore = useApiStore()
</script>
