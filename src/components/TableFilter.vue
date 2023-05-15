<template>
  <tr>
    <th v-for="(type, name) in columns" :key="name" :type="type">
      <span v-if="type == 'boolean'"
        ><SmartCheckbox v-model="filters[name]" />
        <span @click="() => delete filters[name]">🗑️ </span>
      </span>
      <span v-else style="display: flex">
        <input :type="parseInputType(type)" v-model="filters[name]" />
        <!-- <select style="width: 5px" name="" id="" v-model="filters[`${name}Operation`]">
          <option v-for="option in typeFilters(type)" v-bind="option" :key="option.value"></option>
        </select>
        <button>{{ filters[`${name}Operation`] }}</button> -->
      </span>
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

const typeFilters = (element: string | unknown) => {
  switch (element) {
    case 'number':
      return [
        { label: 'Equal', value: '=' },
        { label: 'Less than', value: '<' },
        { label: 'Bigger than', value: '>' }
      ]
    case 'date':
      return [
        { label: 'On', value: '=' },
        { label: 'Before', value: '<' },
        { label: 'After', value: '>' }
      ]
    default:
      return [
        { label: 'Contains', value: 'a*b' },
        { label: 'Starts With', value: 'ab*' },
        { label: 'Ends With', value: '*ab' }
      ]
  }
}
</script>
