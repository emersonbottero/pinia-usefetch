import { type UseFetchReturn, createFetch } from '@vueuse/core'

export function mockedFetch<T>(url: string, mockContent?: Promise<T>): UseFetchReturn<T> {
  return useApiFetch(url, {
    async onFetchError(ctx) {
      if (import.meta.env.DEV && mockContent) {
        const mock = (await mockContent) as { default: T }
        console.warn(`[DEV]mocking call to ${ctx.response?.url}`)
        ctx.error = null
        ctx.data = mock.default
      }

      return ctx
    }
  })
}

const useApiFetch = createFetch({
  baseUrl: 'https://rickandmortyapi.com/api/',
  combination: 'chain',
  options: {
    beforeFetch(ctx) {
      console.log('before fetch hook ')

      return ctx
    },
    async afterFetch(ctx) {
      console.log('after fetch hook ')

      return ctx
    },
    onFetchError(ctx) {
      console.log('on error fetch hook ')
      return ctx
    }
  }
})
