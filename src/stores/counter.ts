import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { mockedFetch } from '../api/useFetch'

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
    api: mockedFetch<Character>(`character/${850}`, mock, {
      headers: { chave: 'test' }
    }).json<Character>(),
    protected: null as any
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
    character: (state) => state.api.data
  },
  actions: {
    async fetchNewCharacter(id: number) {
      // set
      this.protected = mockedFetch(`http://localhost:3001/super-secure-resource`, mock).json()

      if (id.toString().endsWith('0')) id = 900

      this.api = reactive(mockedFetch<Character>(`character/${id}`).json())
    },
    increment() {
      this.count++
    }
  }
})
