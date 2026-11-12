
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { events } from '../data/events.mock'
import { isPublicEvent } from '../../../utils/event-filters'
import { useCatalogClock } from '../composables/useEventCatalog'
import { formatPrice, formatEventDate } from '../../../utils/formatters'
import EventImage from '../components/EventImage.vue'
import TicketSelector from '../components/TicketSelector.vue'

const route = useRoute()
const now = useCatalogClock()

const event = computed(() =>
  events.find(
    (item) =>
      item.id === route.params.id &&
      isPublicEvent(item, now.value),
  ),
)
</script>

<template>
  <main class="event-detail">
    <template v-if="event">
      <RouterLink :to="{ name: 'catalog', hash: '#eventos' }" class="back-link">
        ← Volver a eventos
      </RouterLink>

      <div class="event-layout">
        <section class="event-info">
          <div class="event-image">
            <EventImage
              :src="event.heroImageUrl || event.imageUrl"
              :alt="event.title"
            />
          </div>

          <span class="category">{{ event.category }}</span>

          <h1>{{ event.title }}</h1>

          <p class="event-date">{{ formatEventDate(event.date) }}</p>

          <p class="event-location">
            {{ event.location }} · {{ event.city }}
          </p>

          <p class="event-organizer">
            Organiza: {{ event.organizer.name }}
          </p>

          <h2>Acerca del evento</h2>
          <p>{{ event.description }}</p>
        </section>

        <aside class="tickets-panel">
          <TicketSelector :tickets="event.ticketTypes" />
        </aside>
      </div>
    </template>

    <section v-else class="not-found">
      <h1>Evento no disponible</h1>
      <p>El evento no existe o no está publicado.</p>
      <RouterLink :to="{ name: 'catalog' }">
        Volver al catálogo
      </RouterLink>
    </section>
  </main>
</template>

<style scoped>
.event-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  color: #18332f;
  min-height: 65vh;
}

.back-link {
  display: inline-block;
  margin-bottom: 28px;
  color: #18332f;
  font-weight: 700;
  text-decoration: none;
}

.event-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
  gap: 40px;
  align-items: start;
}

.event-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 24px;
  background: #e8ede8;
}

.event-image :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category {
  display: inline-block;
  padding: 6px 12px;
  background: #d9f06b;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
}

.event-info h1 {
  font-size: clamp(28px, 4vw, 44px);
  line-height: 1.15;
  margin: 16px 0;
}

.event-info h2 {
  margin-top: 36px;
}

.event-date,
.event-location,
.event-organizer {
  margin: 10px 0;
}

.tickets-panel {
  background: #f1f4ef;
  border: 1px solid #e1e8e3;
  border-radius: 16px;
  padding: 24px;
}

.tickets-panel h2 {
  margin: 0 0 12px;
}

.availability {
  font-weight: 700;
  margin-bottom: 24px;
}

.ticket-card {
  background: white;
  border: 1px solid #dce5df;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
  gap: 12px;
}

.ticket-header h3 {
  margin: 0;
  font-size: 16px;
}

.ticket-header strong {
  white-space: nowrap;
}

.ticket-card p {
  font-size: 13px;
}

.ticket-stock {
  font-weight: 700;
}

.ticket-card--sold-out {
  opacity: 0.65;
}

.purchase-notice,
.mock-notice {
  font-size: 13px;
  margin-top: 20px;
}

.mock-notice {
  color: #687a70;
}

.not-found {
  text-align: center;
  padding: 80px 0;
}

.not-found a {
  color: #18332f;
}

@media (max-width: 768px) {
  .event-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .event-detail {
    padding: 24px 16px 60px;
  }
}
</style>
