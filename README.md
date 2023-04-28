## Demo

This is an example of who to use [useFetch](https://vueuse.org/core/useFetch/) and [pinia](https://pinia.vuejs.org/introduction.html) 
mocking api responses with [json files](./src/stores/mock.json) while at the same time keeping the store in sync with any api request!

## Warning

This does not work with useFetch 10 since they prevented the update of data on onFetchError

## Main points in the solutions

- [fetch factory](./src/api/useFetch.ts)
- [using in store with types](./src/stores/counter.ts)