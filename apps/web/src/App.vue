<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './features/events/components/layout/AppHeader.vue'
import AppFooter from './features/events/components/layout/AppFooter.vue'

const route = useRoute()

const isAuthLayout = computed(() => route.meta.layout === 'auth')
</script>

<template>
  <a class="skip-link" href="#main-content">Ir al contenido</a>

  <AppHeader v-if="!isAuthLayout" />

  <main id="main-content" tabindex="-1">
    <RouterView />
  </main>

  <AppFooter v-if="!isAuthLayout" />
</template>
