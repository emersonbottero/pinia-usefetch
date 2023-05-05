import { createFetch, type UseFetchOptions } from '@vueuse/core'

function sleep(delay: number) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

const getToken = async () => {
  const login = await fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin'
    })
  })
  const data = await login.json()
  return data.token
}

/**
 * When an fetch return unauthorized a new call is made
 * after updating the the authorization headers
 */
export const authRefreshTokenFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
  let response = await fetch(input, init)

  if (response.status === 401) {
    const token = await getToken()

    const newInit = {
      ...init,
      headers: {
        ...init?.headers,
        Authorization: `Bearer ${token}`
      }
    }
    response = await fetch(input, newInit)
  }

  return response
}

export function mockedFetch<T>(
  url: string,
  mockContent?: Promise<T>,
  options?: RequestInit,
  useFetchOptions?: UseFetchOptions
) {
  const ApiFetch = createFetch({
    baseUrl: 'https://rickandmortyapi.com/api/',
    options: {
      fetch: authRefreshTokenFetch,
      async onFetchError(ctx) {
        if (import.meta.env.DEV && mockContent) {
          const mock = (await mockContent) as { default: T }
          console.warn(`[DEV]mocking call to ${url} with:`, mockContent)
          console.dir(mock)
          ctx.error = null
          ctx.data = mock.default
        }
        return ctx
      }
      // async beforeFetch({ options, cancel }) {
      //   const myToken = localStorage.getItem('auth')
      //   if (!myToken) cancel()

      //   options.headers = {
      //     ...options.headers,
      //     Authorization: `Bearer ${myToken}`
      //   }

      //   return {
      //     options
      //   }
      // }
    }
  })
  return ApiFetch(url, { ...options }, { ...useFetchOptions })
}
