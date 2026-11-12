<script setup lang="ts">
const benefits = [
  {
    icon: '🛡',
    title: 'Compra segura',
    description: 'Tus pagos, protegidos',
  },
  {
    icon: '🎟',
    title: 'Entradas digitales',
    description: 'Llevalas siempre con vos',
  },
  {
    icon: '★',
    title: 'Experiencias únicas',
    description: 'Descubrí tu próximo evento',
  },
]
</script>

<template>
  <section class="event-benefits" aria-label="Beneficios de GoTicket">
    <div
      v-for="benefit in benefits"
      :key="benefit.title"
      class="event-benefits__item"
    >
      <span class="event-benefits__icon" aria-hidden="true">
        {{ benefit.icon }}
      </span>

      <div>
        <h3>{{ benefit.title }}</h3>
        <p>{{ benefit.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.event-benefits {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin: 0;
  padding: 24px 32px;
  border-top: 1px solid rgba(217, 240, 107, 0.15);
  background: #092c26;
  color: #ffffff;
  border-radius: 0;
}

.event-benefits__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.event-benefits__icon {
  color: #d9f06b;
  font-size: 28px;
}

.event-benefits__item h3 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 800;
}

.event-benefits__item p {
  margin: 0;
  color: #c8d8d2;
  font-size: 12px;
}

@media (max-width: 700px) {
  .event-benefits {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .event-benefits__item {
    justify-content: flex-start;
  }
}
</style>