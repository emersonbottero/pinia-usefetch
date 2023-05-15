<template>
  <div>
    <SmartTable :data="data"></SmartTable>
  </div>
</template>

<style>
table,
td,
th {
  border: solid 0.25px azure;
}
</style>

<script setup lang="ts">
import SmartTable from '@/components/SmartTable.vue'

const data = [
  { name: 'Alice', age: 25, married: false, birthdate: new Date('1998-02-03') },
  { name: 'Bob', age: 35, married: true, birthdate: new Date('1988-09-12') },
  { name: 'Charlie', age: 30, married: null, birthdate: new Date('1993-05-27') },
  { name: 'David', age: 28, married: true, birthdate: new Date('1995-12-01') }
] as any[]
</script>
