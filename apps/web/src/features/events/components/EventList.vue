<script setup lang="ts">
import { computed, toRef } from 'vue'
import type { Event } from '../types/event'
import { eventCategories } from '../types/event'
import { useEventCatalog } from '../composables/useEventCatalog'
import EventCard from './EventCard.vue'
import EventSearch from './EventSearch.vue'

const props = defineProps<{ events: Event[]; now: number; error?: string }>()
const { filters, page, publicEvents, pagination, clearFilters } = useEventCatalog(
  toRef(props, 'events'),
  toRef(props, 'now'),
)
const cities = computed(() =>
  [...new Set(publicEvents.value.map((event) => event.city))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  ),
)
defineExpose({
  selectCategory(category: string) {
    filters.value.category = category
  },
})
</script>

<template>
  <section id="eventos" class="event-list" aria-labelledby="catalog-title">
    <header class="event-list__header">
      <h2 id="catalog-title">Próximos eventos</h2>
      <EventSearch v-model="filters.text" />
    </header>
    <form class="event-list__filters" aria-label="Filtros de eventos" @submit.prevent>
      <label
        >Categoría
        <select v-model="filters.category" name="category">
          <option value="">Todas las categorías</option>
          <option v-for="category in eventCategories" :key="category">{{ category }}</option>
        </select>
      </label>
      <label
        >Ciudad
        <select v-model="filters.city" name="city">
          <option value="">Todas las ciudades</option>
          <option v-for="city in cities" :key="city">{{ city }}</option>
        </select>
      </label>
      <label
        >Fecha (Argentina)
        <input v-model="filters.date" name="date" type="date" />
      </label>
      <button type="button" @click="clearFilters">Limpiar filtros</button>
    </form>
    <p v-if="error" role="alert">{{ error }}</p>
    <template v-else>
      <p role="status">{{ pagination.total }} eventos encontrados</p>
      <div v-if="pagination.total > 0" class="event-list__grid">
        <EventCard v-for="event in pagination.items" :key="event.id" :event="event" />
      </div>
      <div v-else class="event-list__empty">
        <p>No se encontraron eventos. Probá con otros filtros.</p>
        <button type="button" @click="clearFilters">Limpiar filtros</button>
      </div>
      <nav
        v-if="pagination.total > 0"
        class="event-list__pagination"
        aria-label="Paginación de eventos"
      >
        <button type="button" :disabled="pagination.page === 1" @click="page--">Anterior</button>
        <span aria-live="polite" aria-atomic="true"
          >Página {{ pagination.page }} de {{ pagination.totalPages }}</span
        >
        <button type="button" :disabled="pagination.page === pagination.totalPages" @click="page++">
          Siguiente
        </button>
      </nav>
    </template>
  </section>
</template>

<style scoped>
.event-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.event-list__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .event-list__grid {
    grid-template-columns: 1fr;
  }
}

.event-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.event-list__header h2 {
  font-size: 28px;
  color: #18332f;
  margin: 0;
}

.event-list__actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.event-list__actions button {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background-color: #18332f;
  color: white;
  cursor: pointer;
}

.event-list__filters {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 16px;
}
.event-list__filters label {
  display: flex;
  flex: 1 1 180px;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  min-width: 0;
}
.event-list__filters input,
.event-list__filters select {
  width: 100%;
  min-width: 0;
  padding: 12px;
  border: 1px solid #cbd5d1;
  border-radius: 8px;
  font: inherit;
  color: #18332f;
  background: white;
}
.event-list button {
  padding: 12px 16px;
  border: 1px solid #18332f;
  border-radius: 8px;
  background: #18332f;
  color: white;
  cursor: pointer;
}
.event-list button:disabled {
  opacity: 0.5;
  cursor: default;
}
.event-list__pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}
.event-list__empty {
  padding: 32px 0;
  text-align: center;
}
@media (min-width: 769px) and (max-width: 1024px) {
  .event-list__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 768px) {
  .event-list__header {
    align-items: stretch;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
