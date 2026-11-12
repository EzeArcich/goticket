<script setup lang="ts">
import { computed, ref } from 'vue'
import { catalogEvents } from '../../../utils/event-filters'
import { useCatalogClock } from '../composables/useEventCatalog'
import EventList from '../components/EventList.vue'
import EventHeroCarousel from '../components/EventHeroCarousel.vue'
import { events } from '../data/events.mock'

import EventCategories from '../components/EventCategories.vue'
import EventBenefits from '../components/EventBenefits.vue'
import OrganizerBanner from '../components/OrganizerBanner.vue'
const now = useCatalogClock()
const featuredEvents = computed(() =>
  catalogEvents(events, undefined, now.value).filter((event) => event.featured),
)
const eventList = ref<InstanceType<typeof EventList> | null>(null)
function selectCategory(category: string) {
  eventList.value?.selectCategory(category)
  document.getElementById('eventos')?.scrollIntoView({ block: 'start' })
}
</script>

<template>
  <div>
    <div class="home-showcase">
      <EventHeroCarousel :events="featuredEvents" />
      <EventBenefits />
    </div>

    <EventCategories @select="selectCategory" />
    <EventList ref="eventList" :events="events" :now="now" />
    <OrganizerBanner />
  </div>
</template>

<style scoped>
.home-showcase {
  width: 100%;
  margin: 0;
  padding: 0;
}
</style>
