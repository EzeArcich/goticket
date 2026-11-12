<script setup lang="ts">
import AppHeader from './features/events/components/layout/AppHeader.vue'
import AppFooter from './features/events/components/layout/AppFooter.vue'
</script>

<template>
  <a class="skip-link" href="#main-content">Ir al contenido</a>
  <AppHeader />
  <main id="main-content" tabindex="-1"><RouterView /></main>
  <AppFooter />
</template>
