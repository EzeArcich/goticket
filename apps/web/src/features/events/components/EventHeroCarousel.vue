<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Event } from '../types/event'
import EventHero from './EventHero.vue'

const props = defineProps<{
  events: Event[]
}>()

const currentIndex = ref(0)
watch(
  () => props.events.map((event) => event.id).join(','),
  () => {
    currentIndex.value = 0
  },
)

const currentEvent = computed(() => {
  return props.events[currentIndex.value]
})

function nextSlide() {
  if (props.events.length === 0) return

  currentIndex.value = (currentIndex.value + 1) % props.events.length
}

function previousSlide() {
  if (props.events.length === 0) return

  currentIndex.value = (currentIndex.value - 1 + props.events.length) % props.events.length
}
</script>

<template>
  <section
    id="destacados"
    class="event-hero-carousel"
    aria-label="Eventos destacados"
    aria-roledescription="carrusel"
  >
    <Transition name="hero-fade" mode="out-in">
      <EventHero v-if="currentEvent" :key="currentEvent.id" :event="currentEvent" />
    </Transition>

    <p class="sr-only" aria-live="polite" aria-atomic="true">
      {{
        currentEvent
          ? `Evento ${currentIndex + 1} de ${events.length}: ${currentEvent.title}`
          : 'Sin eventos destacados'
      }}
    </p>

    <div class="carousel-intro">
      <span class="carousel-intro__eyebrow"> EVENTOS EN TU CIUDAD </span>

      <h1>
        Viví experiencias<br />
        que te hacen <span>vibrar.</span>
      </h1>

      <p>
        Descubrí conciertos, teatro, festivales y mucho más. Encontrá tu próxima experiencia con
        GoTicket!
      </p>
    </div>

    <template v-if="events.length > 1">
      <button
        class="carousel-arrow carousel-arrow--previous"
        type="button"
        aria-label="Evento anterior"
        @click="previousSlide"
      >
        ‹
      </button>

      <button
        class="carousel-arrow carousel-arrow--next"
        type="button"
        aria-label="Siguiente evento"
        @click="nextSlide"
      >
        ›
      </button>

      <div class="carousel-indicators">
        <button
          v-for="(event, index) in events"
          :key="event.id"
          type="button"
          class="carousel-indicator"
          :class="{ 'carousel-indicator--active': index === currentIndex }"
          :aria-label="`Mostrar evento ${index + 1}: ${event.title}`"
          :aria-current="index === currentIndex ? 'true' : undefined"
          @click="currentIndex = index"
        />
      </div>
    </template>
  </section>
</template>

<style scoped>
.event-hero-carousel {
  position: relative;
  width: 100%;
  min-height: 560px;
  overflow: hidden;
  border-radius: 0;
  background: #18332f;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;

  background: rgba(0, 0, 0, 0.5);
  color: white;

  font-size: 30px;
  cursor: pointer;
  z-index: 2;
}

.carousel-arrow:hover {
  background: #d9f06b;
  color: #18332f;
}

.carousel-arrow--previous {
  left: 16px;
}

.carousel-arrow--next {
  right: 16px;
}

.carousel-indicators {
  position: absolute;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;

  display: flex;
  align-items: center;
  gap: 8px;
}

.carousel-indicator {
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
}

.carousel-indicator::before {
  content: '';
  display: block;
  width: 9px;
  height: 9px;
  margin: auto;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  transition:
    width 250ms ease,
    background-color 250ms ease;
}

.carousel-indicator--active {
  width: 30px;
}

.carousel-indicator--active::before {
  width: 30px;
  background: #d9f06b;
}

.hero-fade-enter-active,
.hero-fade-leave-active {
  transition: opacity 350ms ease;
}

.hero-fade-enter-from,
.hero-fade-leave-to {
  opacity: 0;
}

.carousel-intro {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  padding-top: 48px;
  padding-left: max(48px, calc((100vw - 1200px) / 2));
  padding-right: max(48px, calc((100vw - 1200px) / 2));
  color: #ffffff;

  background: linear-gradient(
    180deg,
    rgba(0, 35, 30, 0.92) 0%,
    rgba(0, 35, 30, 0.65) 65%,
    transparent 100%
  );

  pointer-events: none;
}

.carousel-intro__eyebrow {
  color: #d9f06b;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.carousel-intro h1 {
  margin: 0;
  font-family: 'Manrope', sans-serif;
  max-width: 520px;
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -1.5px;
}

.carousel-intro h1 span {
  color: #d9f06b;
}

.carousel-intro p {
  max-width: 520px;
  margin: 0;
  color: #dce8e2;
  font-size: 14px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .carousel-intro {
    padding: 28px 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-fade-enter-active,
  .hero-fade-leave-active {
    transition: none;
  }
}
</style>
