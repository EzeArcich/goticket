<script setup lang="ts">
import EventImage from './EventImage.vue'
import type { Event } from '../types/event'
import { formatPrice, formatEventDate } from '../../../utils/formatters'

defineProps<{
  event: Event
}>()
</script>

<template>
  <article class="event-card" :class="{ 'event-card--sold-out': event.availableTickets <= 0 }">
    <div class="event-card__image">
      <EventImage :src="event.imageUrl" loading="lazy" :alt="event.title" />
    </div>

    <div class="event-card__content">
      <header class="event-card__header">
        <span v-if="event.featured" class="event-card__featured"> DESTACADO </span>
        <p class="event-card__date">{{ formatEventDate(event.date) }}</p>
      </header>

      <div class="event-card__body">
        <h3 class="event-card__title">{{ event.title }}</h3>
        <p class="event-card__city">{{ event.location }} · {{ event.city }}</p>
        <p class="event-card__organizer">{{ event.organizer.name }}</p>
        <p class="event-card__availability">
          {{ event.availableTickets > 0 ? 'Entradas disponibles' : 'Agotado' }}
        </p>
      </div>

      <footer class="event-card__footer">
        <p class="event-card__price">Desde {{ formatPrice(event.price) }} ARS</p>
        <RouterLink
          :to="{ name: 'event-detail', params: { id: event.id } }"
          class="event-card__button"
          :aria-label="`Ver evento: ${event.title}`"
        >
          Ver evento
        </RouterLink>
      </footer>
    </div>
  </article>
</template>

<style scoped>
.event-card__title {
  margin: 0 0 6px;
  font-size: 16px;
  line-height: 1.35;
  font-weight: 800;
}

.event-card__city {
  margin: 0;
  font-size: 13px;
}

.event-card__date {
  margin: 0 0 0 auto;
  font-size: 12px;
}

.event-card__price {
  margin: 0;
  font-size: 14px;
}

.event-card__featured {
  display: inline-block;
  background-color: #d9f06b;
  color: #18332f;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 6px;
}

.event-card {
  display: flex;
  flex-direction: column;
  height: 100%;

  background: #ffffff;
  color: #18332f;

  border: 1px solid #e1e8e3;
  border-radius: 14px;
  overflow: hidden;

  box-shadow: 0 4px 16px rgba(24, 51, 47, 0.06);
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(24, 51, 47, 0.12);
}

.event-card__content {
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
  gap: 0;
  flex: 1;
  min-width: 0;
}

.event-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 12px;
}

.event-card__body {
  flex: 1;
  margin-bottom: 16px;
}

.event-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e1e8e3;
  margin-top: auto;
}

.event-card__button {
  background: #d9f06b;
  color: #18332f;

  border: 0;
  border-radius: 8px;
  padding: 10px 16px;

  font-weight: 700;
}

.event-card__image {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.event-card__image :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-card__organizer,
.event-card__availability {
  font-size: 12px;
  margin: 8px 0 0;
}
.event-card__availability {
  font-weight: 700;
}
.event-card--sold-out .event-card__availability {
  color: #79451d;
}
.event-card--sold-out .event-card__image {
  opacity: 0.7;
}
.event-card__title {
  overflow-wrap: anywhere;
}
.event-card__header,
.event-card__footer {
  flex-wrap: wrap;
  gap: 8px;
}
.event-card__button {
  text-decoration: none;
  display: inline-block;
}
</style>
