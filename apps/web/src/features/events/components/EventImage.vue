<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ src?: string; alt: string; loading?: 'lazy' | 'eager' }>()
const failed = ref(false)
watch(
  () => props.src,
  () => {
    failed.value = false
  },
)
</script>

<template>
  <img
    :src="!failed && src ? src : '/events/placeholder.svg'"
    :alt="alt"
    :loading="loading"
    @error="failed = true"
  />
</template>
