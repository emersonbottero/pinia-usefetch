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
  {{ groupedData }}
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Country</th>
        <th>Actions</th>
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
              <td @click="() => editingRowHandler(row)">✏️</td>
            </tr>
          </template>
        </template>
      </template>
      <tr v-else>
        <td colspan="3">No data available</td>
      </tr>
    </tbody>
  </table>
  <SModal v-if="showEdit" @closeModal="showEdit = false">
    <div class="edit-row">
      <div v-for="(value, key, index) in editingRow" :key="index">
        <label :for="index">{{ key }}</label>
        <input :id="index" type="text" :value="value" />
      </div>
    </div>
  </SModal>
</template>

<style scoped>
.edit-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.edit-row > div {
  flex-direction: column;
  justify-self: stretch;
  display: flex;
  align-items: flex-start;
}

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
import SModal from '../components/SModal.vue'

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

const updateGroupedData = () => {
  if (selectedGroup.value === 'none') {
    groupedData.value = [{ key: '', rows: data, expanded: true }]
  } else {
    const groups = {}

    data.forEach((row) => {
      // @ts-ignore
      const value = row[selectedGroup.value]

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
}

const toggleGroup = (index: any) => {
  groupedData.value[index].expanded = !groupedData.value[index].expanded
}

const showEdit = ref(false)

const editingRow = ref()

const editingRowHandler = (row: People) => {
  editingRow.value = row
  showEdit.value = true
  console.log('editing...', row)
}
</script>
