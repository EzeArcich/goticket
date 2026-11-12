<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { events } from '../data/events.mock'
import { isPublicEvent } from '../../../utils/event-filters'
import { useCatalogClock } from '../composables/useEventCatalog'
const route = useRoute()
const now = useCatalogClock()
const event = computed(() =>
  route.name === 'event-detail'
    ? events.find((event) => event.id === route.params.id && isPublicEvent(event, now.value))
    : undefined,
)
</script>

<template>
  <section class="detail-placeholder" aria-labelledby="detail-title">
    <h1 id="detail-title">{{ event ? event.title : 'Evento o página no disponible' }}</h1>
    <template v-if="event">
      <p>El detalle del evento estará disponible próximamente.</p>
      <p v-if="event.availableTickets <= 0">Agotado.</p>
      <p>Este catálogo utiliza datos ficticios. No hay reservas ni compras habilitadas.</p>
    </template>
    <p v-else>Volvé al catálogo para explorar los eventos publicados.</p>
    <RouterLink :to="{ name: 'catalog', hash: '#eventos' }">Volver al catálogo</RouterLink>
  </section>
</template>

<style scoped>
.detail-placeholder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 24px;
  min-height: 50vh;
  overflow-wrap: anywhere;
}
a {
  color: #18332f;
}
</style>
