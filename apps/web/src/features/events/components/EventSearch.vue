<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="event-search">
    <input
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      type="search"
      aria-label="Buscar eventos por título"
      placeholder="Buscar eventos..."
    />
  </div>
</template>

<style scoped>
.event-search input {
  width: 100%;
  min-width: 0;
  padding: 12px 16px;
  border: 1px solid #cbd5d1;
  border-radius: 8px;
  font-size: 14px;
}
</style>
