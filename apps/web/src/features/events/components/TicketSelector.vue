
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TicketType } from '../types/event'
import { formatPrice } from '../../../utils/formatters'

const props = defineProps<{
  tickets: TicketType[]
}>()

const MAX_PER_TYPE = 6

// Cantidades seleccionadas, indexadas por ID de entrada.
const quantities = ref<Record<string, number>>({})

// Calcula la cantidad seleccionada para un tipo.
function quantityFor(ticket: TicketType): number {
  return quantities.value[ticket.id] ?? 0
}

// Modifica una cantidad respetando los límites.
function updateQuantity(ticket: TicketType, change: number) {
  const current = quantityFor(ticket)
  const maximum = Math.min(MAX_PER_TYPE, ticket.availableTickets)

  quantities.value[ticket.id] = Math.max(
    0,
    Math.min(maximum, current + change),
  )
}

// Total de entradas seleccionadas.
const totalQuantity = computed(() =>
  props.tickets.reduce(
    (total, ticket) => total + quantityFor(ticket),
    0,
  ),
)

// Importe total.
const totalPrice = computed(() =>
  props.tickets.reduce(
    (total, ticket) =>
      total + ticket.price * quantityFor(ticket),
    0,
  ),
)
</script>

<template>
  <section class="ticket-selector" aria-labelledby="ticket-selector-title">
    <h2 id="ticket-selector-title">Seleccioná tus entradas</h2>

    <div
      v-for="ticket in tickets"
      :key="ticket.id"
      class="ticket-option"
      :class="{ 'ticket-option--sold-out': ticket.availableTickets <= 0 }"
    >
      <div class="ticket-option__info">
        <h3>{{ ticket.name }}</h3>
        <p v-if="ticket.description">{{ ticket.description }}</p>
        <strong>{{ formatPrice(ticket.price) }} ARS</strong>
        <span class="ticket-option__stock">
          {{
            ticket.availableTickets > 0
              ? `${ticket.availableTickets} disponibles`
              : 'Agotado'
          }}
        </span>
      </div>

      <div v-if="ticket.availableTickets > 0" class="quantity-control">
        <button
          type="button"
          :disabled="quantityFor(ticket) === 0"
          :aria-label="`Quitar una entrada ${ticket.name}`"
          @click="updateQuantity(ticket, -1)"
        >
          −
        </button>

        <output :aria-label="`Cantidad de entradas ${ticket.name}`">
          {{ quantityFor(ticket) }}
        </output>

        <button
          type="button"
          :disabled="quantityFor(ticket) >= Math.min(MAX_PER_TYPE, ticket.availableTickets)"
          :aria-label="`Agregar una entrada ${ticket.name}`"
          @click="updateQuantity(ticket, 1)"
        >
          +
        </button>
      </div>
    </div>

    <div class="ticket-summary">
      <p>Entradas seleccionadas: {{ totalQuantity }}</p>

      <div class="ticket-summary__total">
        <strong>Total</strong>
        <strong>{{ formatPrice(totalPrice) }} ARS</strong>
      </div>

      <p v-if="totalQuantity > 0" class="auth-notice" role="status">
        Para continuar con la compra necesitás iniciar sesión.
        La autenticación estará disponible próximamente.
      </p>

      <button
        type="button"
        class="continue-button"
        disabled
      >
        Continuar con la compra
      </button>

      <p class="demo-notice">
        Demostración con datos ficticios. No se realizan reservas ni compras.
      </p>
    </div>
  </section>
</template>

<style scoped>
.ticket-selector {
  color: #18332f;
}

.ticket-selector h2 {
  margin: 0 0 20px;
  font-size: 22px;
}

.ticket-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px;
  margin-bottom: 12px;
  border: 1px solid #dce5df;
  border-radius: 12px;
  background: #fff;
}

.ticket-option--sold-out {
  opacity: 0.6;
}

.ticket-option__info {
  min-width: 0;
}

.ticket-option__info h3 {
  margin: 0 0 8px;
  font-size: 16px;
}

.ticket-option__info p {
  margin: 0 0 8px;
  font-size: 13px;
}

.ticket-option__info strong,
.ticket-option__stock {
  display: block;
  margin-top: 8px;
  font-size: 13px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.quantity-control button {
  width: 32px;
  height: 32px;
  border: 1px solid #dce5df;
  border-radius: 8px;
  background: #f1f4ef;
  color: #18332f;
  font-weight: 800;
  cursor: pointer;
}

.quantity-control button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-control output {
  min-width: 16px;
  text-align: center;
  font-weight: 700;
}

.ticket-summary {
  margin-top: 24px;
  border-top: 1px solid #dce5df;
  padding-top: 20px;
}

.ticket-summary__total {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 16px 0;
  font-size: 18px;
}

.auth-notice {
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
}

.continue-button {
  width: 100%;
  border: 0;
  border-radius: 10px;
  padding: 14px;
  background: #d9f06b;
  color: #18332f;
  font-weight: 800;
}

.continue-button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.demo-notice {
  margin-top: 16px;
  color: #687a70;
  font-size: 12px;
}

@media (max-width: 480px) {
  .ticket-option {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
