import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'
import type { Event } from '../types/event'
import { catalogEvents, emptyFilters, paginateEvents } from '../../../utils/event-filters'

/** Un único reloj para catálogo y destacados; también retira eventos que ya comenzaron. */
export function useCatalogClock() {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    timer = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  })
  onUnmounted(() => {
    clearInterval(timer)
  })
  return now
}

export function useEventCatalog(source: Ref<Event[]>, now: Ref<number>, pageSize = 6) {
  const filters = ref(emptyFilters())
  const page = ref(1)
  const publicEvents = computed(() => catalogEvents(source.value, emptyFilters(), now.value))
  const filtered = computed(() => catalogEvents(source.value, filters.value, now.value))
  const pagination = computed(() => paginateEvents(filtered.value, page.value, pageSize))
  watch(
    filters,
    () => {
      page.value = 1
    },
    { deep: true, flush: 'sync' },
  )
  watch(
    () => pagination.value.page,
    (value) => {
      page.value = value
    },
  )
  function clearFilters() {
    filters.value = emptyFilters()
  }
  return { filters, page, publicEvents, filtered, pagination, clearFilters }
}
