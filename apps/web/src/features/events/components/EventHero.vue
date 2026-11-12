<script setup lang="ts">
import EventImage from './EventImage.vue'
import type { Event } from '../types/event'

defineProps<{
  event: Event
}>()
</script>

<template>
  <section class="event-hero">
    <EventImage
      :src="event.heroImageUrl ?? event.imageUrl"
      :alt="event.title"
      class="event-hero__image"
    />

    <span class="event-hero__badge"> EVENTO DESTACADO </span>

    <div class="event-hero__content">
      <h2>{{ event.title }}</h2>
      <p>
        {{ event.city }} · {{ event.availableTickets > 0 ? 'Entradas disponibles' : 'Agotado' }}
      </p>

      <RouterLink
        :to="{ name: 'event-detail', params: { id: event.id } }"
        :aria-label="`Ver evento: ${event.title}`"
      >
        Ver evento
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.event-hero {
  position: relative;
  width: 100%;
  height: 560px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  border-radius: 0;
  background: #18332f;
}

.event-hero__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 35%;
}

.event-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.1));
}

.event-hero__content {
  position: absolute;
  bottom: 48px;
  left: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding-left: max(48px, calc((100vw - 1200px) / 2));
  padding-right: 48px;
  color: #ffffff;
}

.event-hero__badge {
  position: absolute;
  top: 32px;
  right: 32px;
  z-index: 3;

  display: inline-block;
  padding: 8px 12px;
  border-radius: 6px;

  background: #d9f06b;
  color: #18332f;

  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.event-hero h1 {
  font-size: clamp(28px, 4vw, 48px);
  margin: 0 0 12px;
}

.event-hero__content a {
  margin-top: 20px;
  padding: 12px 24px;
  border: 0;
  border-radius: 8px;
  background-color: #d9f06b;
  color: #18332f;
  font-weight: 700;
  text-decoration: none;
}

.event-hero-carousel {
  position: relative;
  min-height: 560px;
  overflow: hidden;
  border-radius: 16px;
}

.event-hero__content h2 {
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  margin: 0;
}

.event-hero__content p {
  color: #ffffff;
  font-size: 15px;
  margin: 0;
}

@media (max-width: 768px) {
  .event-hero__content {
    bottom: 44px;
    padding-left: 24px;
    max-width: 100%;
    padding-right: 24px;
  }

  .event-hero__content h2 {
    font-size: 24px;
  }
}

@media (max-width: 768px) {
  .event-hero__badge {
    top: auto;
    bottom: 245px;
    right: 24px;
    font-size: 10px;
  }
}
</style>
