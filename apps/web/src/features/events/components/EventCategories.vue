<script setup lang="ts">
const emit = defineEmits<{ select: [category: string] }>()
const categories = [
  { id: 'music', name: 'Música', image: '/images/categories/music.jpg' },
  { id: 'theater', name: 'Teatro', image: '/images/categories/theater.jpg' },
  { id: 'sports', name: 'Deportes', image: '/images/categories/sports.jpg' },
  { id: 'festivals', name: 'Festivales', image: '/images/categories/festivals.jpg' },
  { id: 'conferences', name: 'Conferencias', image: '/images/categories/conferences.jpg' },
]
</script>

<template>
  <section id="categorias" class="event-categories">
    <div class="event-categories__header">
      <h2>Explorá por categoría</h2>
    </div>

    <div class="event-categories__grid">
      <button
        type="button"
        @click="emit('select', category.name)"
        :aria-label="`Filtrar por ${category.name}`"
        v-for="category in categories"
        :key="category.id"
        class="event-category"
      >
        <img :src="category.image" :alt="category.name" />
        <div class="event-category__overlay">
          <span>{{ category.name }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<style scoped>
.event-categories {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 0 24px;
}

.event-categories__header {
  margin-bottom: 20px;
}

.event-categories__header h2 {
  margin: 0;
  color: #18332f;
  font-size: 24px;
  font-weight: 800;
}

.event-categories__grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px;
}

.event-category {
  position: relative;
  border: 0;
  padding: 0;
  cursor: pointer;
  text-align: left;
  height: 150px;
  border-radius: 14px;
  overflow: hidden;
  background: #18332f;
}

.event-category img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.event-category__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  background: linear-gradient(transparent 25%, rgba(0, 20, 17, 0.85));
}

.event-category__overlay span {
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
}

@media (max-width: 900px) {
  .event-categories__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .event-categories__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
