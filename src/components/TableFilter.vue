<template>
  <tr>
    <th v-for="(type, name) in columns" :key="name" :type="type">
      <span v-if="type == 'boolean'"
        ><SmartCheckbox v-model="filters[name]" />
        <span @click="() => delete filters[name]">🤌</span>
      </span>
      <input v-else :type="parseInputType(type)" v-model="filters[name]" />
    </th>
  </tr>
</template>

<script setup lang="ts">
import { getColumnsFromTableData, type DataType } from '@/api/dataFilter'
import { ref, type PropType, watch } from 'vue'
import SmartCheckbox from './SmartCheckbox.vue'

const props = defineProps({
  data: { type: Array as PropType<DataType[]>, default: () => [] },
  modelValue: { type: Object as PropType<any>, default: () => {} }
})

const filters = ref<any>({})

const parseInputType = (valueType: unknown) => {
  switch (valueType) {
    case 'boolean':
      return 'checkbox'
    case 'string':
      return 'text'
    default:
      return valueType as string
  }
}

const emit = defineEmits(['update:modelValue'])
const columns = getColumnsFromTableData(props.data)

watch(filters, (newValue) => emit('update:modelValue', newValue), { deep: true })
</script>
