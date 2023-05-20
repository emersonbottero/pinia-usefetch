<template>
  <div>
    <label for="group-select">Group By:</label>
    <select id="group-select" v-model="selectedGroup">
      <option value="none">None</option>
      <option value="name">Name</option>
      <option value="age">Age</option>
      <option value="country">Country</option>
    </select>
  </div>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Country</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="groupedData.length > 0">
        <template v-for="(group, index) in groupedData" :key="index">
          <tr v-if="selectedGroup !== 'none'" class="group-row" @click="toggleGroup(index)">
            <td :colspan="3">{{ group.key }}: {{ group.rows.length }}</td>
          </tr>
          <template v-if="group.expanded">
            <tr v-for="(row, rowIndex) in group.rows" :key="rowIndex">
              <td>{{ row.name }}</td>
              <td>{{ row.age }}</td>
              <td>{{ row.country }}</td>
            </tr>
          </template>
        </template>
      </template>
      <tr v-else>
        <td colspan="3">No data available</td>
      </tr>
    </tbody>
  </table>
  <code>
    <pre style="line-height: normal">{{ groups }}</pre>
  </code>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

select {
  margin-bottom: 10px;
}

.group-row {
  background-color: #00bd7e;
  font-weight: bold;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
const selectedGroup = ref<keyof People | 'none'>('none')

interface People {
  name: string
  age: number
  country: string
}

const data = [
  { name: 'John Doe', age: 25, country: 'USA' },
  { name: 'Jane Smith', age: 30, country: 'Canada' },
  { name: 'Mike Johnson', age: 28, country: 'USA' },
  { name: 'Emma Watson', age: 27, country: 'UK' },
  { name: 'David Lee', age: 32, country: 'USA' }
] as People[]

const groupedData = ref<
  {
    key: keyof People | ''
    rows: People[]
    expanded: boolean
  }[]
>([])

onMounted(() => updateGroupedData())

watch(selectedGroup, () => {
  updateGroupedData()
})

const groups = computed(() => {
  if (selectedGroup.value === 'none') return []

  const groupData: Map<string | number, number> = new Map()

  data.forEach((row) => {
    const value = row[selectedGroup.value as keyof People]

    !groupData.has(value)
      ? groupData.set(value, 1)
      : groupData.set(value, Number(groupData.get(value)?.valueOf()) + 1)
  })
  return Array.from(groupData).map((g) => ({ expanded: false, group: g[0], total: g[1] }))
})

const updateGroupedData = () => {
  if (selectedGroup.value === 'none') {
    groupedData.value = [{ key: '', rows: data, expanded: true }]
    return
  }

  const groupData: Map<string | number, number> = new Map()

  const groups = {}

  data.forEach((row) => {
    const value = row[selectedGroup.value as keyof People]

    !groupData.has(value)
      ? groupData.set(value, 1)
      : groupData.set(value, Number(groupData.get(value)?.valueOf()) + 1)
    // @ts-ignore
    if (!groups[value]) {
      // @ts-ignore
      groups[value] = []
    }

    // @ts-ignore
    groups[value].push(row)
  })

  // @ts-ignore
  groupedData.value = Object.entries(groups).map(([key, rows]) => ({
    key,
    rows,
    expanded: false
  }))
}

const toggleGroup = (index: any) => {
  groupedData.value[index].expanded = !groupedData.value[index].expanded
}
</script>
