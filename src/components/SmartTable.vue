<template>
  <table>
    <thead>
      <TableFilter :data="data" v-model="filters" />
      <tr>
        <th v-for="(type, name) in columns" :key="name" :type="type">{{ name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in filteredData" :key="index">
        <th v-for="(type, name) in columns" :key="name">
          {{
            item[name] instanceof Date
              ? new Date(item[name] as string).toISOString().slice(0, 10)
              : item[name]
          }}
        </th>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { ref, type PropType, computed } from 'vue'
import TableFilter from './TableFilter.vue'
import { getColumnsFromTableData, getFilterData } from '@/api/dataFilter'

const props = defineProps({
  data: {
    type: Array as PropType<Record<string, string | number | boolean | Date>[]>,
    default: [] as PropType<Record<string, string | number | boolean | Date>[]>
  }
})

const columns = getColumnsFromTableData(props.data)

const filters = ref()

const filterData = getFilterData(props.data)
const filteredData = computed(() => {
  return props.data.filter((item) => {
    let isMatch = true
    for (const key in filters.value) {
      if (filters.value[key] !== undefined && filters.value[key] !== '') {
        if (filterData[key]) {
          const { label, type: filterType } = filterData[key]
          const operationKey = `${filterData[key].label}Operation`
          const operation = filters.value[operationKey]

          if (filterType === 'text') {
            if (
              (operation == 'a*b' &&
                !(item[key] as string).toLowerCase().includes(filters.value[key].toLowerCase())) ||
              (operation == 'ab*' &&
                !(item[key] as string)
                  .toLowerCase()
                  .startsWith(filters.value[key].toLowerCase())) ||
              (operation == '*ab' &&
                !(item[key] as string).toLowerCase().endsWith(filters.value[key].toLowerCase()))
            )
              isMatch = false
            break
          } else if (filterType === 'number' && item[key] !== filters.value[key]) {
            isMatch = false
            break
          } else if (filterType === 'boolean' && item[key] !== filters.value[key]) {
            isMatch = false
            break
          } else if (
            filterType === 'date' &&
            new Date(item[key] as string).toISOString().slice(0, 10) !==
              new Date(filters.value[key]).toISOString().slice(0, 10)
          ) {
            isMatch = false
            break
          }
        }
      }
    }
    return isMatch
  })
})
</script>
