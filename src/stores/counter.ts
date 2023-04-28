import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { mockedFetch as mockedUseFetch } from '../api/useFetch'
import { useFetch, type UseFetchReturn, createFetch } from '@vueuse/core'

interface Character {
  id: number
  name: string
  status: string
  image: string
}

const mock = import('./mock.json')

export const useApiStore = defineStore('api-rick', {
  state: () => ({
    count: 0,
    currentId: 8,
    api: mockedUseFetch<Character>(`character/${850}`, mock).json<Character>()
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    character: (state) => state.api.data
  },
  actions: {
    fetchNewCharacter(id: number) {
      this.api = reactive(mockedUseFetch<Character>(`character/${id}`).json())
    },
    increment() {
      this.count++
    }
  }
})
