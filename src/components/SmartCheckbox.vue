<template>
  <input
    type="checkbox"
    :indeterminate="isIndeterminate"
    :checked="isChecked"
    :value="modelValue"
    @input="$emit('update:modelValue', isIndeterminate ? null : isChecked)"
    @click="toggleCheckState"
  />
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Boolean, default: undefined }
})
defineEmits(['update:modelValue'])
import { onMounted, ref } from 'vue'

const isChecked = ref<boolean | undefined>(false)
const isIndeterminate = ref(false)

onMounted(() => {
  if (props.modelValue == undefined) isIndeterminate.value = true
  else isChecked.value = props.modelValue
})

function toggleCheckState() {
  if (isIndeterminate.value) {
    isChecked.value = true
    isIndeterminate.value = false
  } else if (isChecked.value == false) {
    isChecked.value = undefined
    isIndeterminate.value = true
  } else {
    isChecked.value = false
    isIndeterminate.value = false
  }
}
</script>
