import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: () => import('../features/events/views/EventCatalogView.vue'),
    },
    {
      path: '/eventos/:id',
      name: 'event-detail',
     component: () => import('../features/events/views/EventDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../features/events/views/EventDetailPlaceholder.vue'),
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash }
    if (to.path !== from.path) return { top: 0 }
  },
})

export default router
