
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import TicketSelector from './TicketSelector.vue'
import type { TicketType } from '../types/event'

const tickets: TicketType[] = [
  {
    id: 'general',
    name: 'General',
    price: 35000,
    availableTickets: 100,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 65000,
    availableTickets: 2,
  },
  {
    id: 'meet',
    name: 'Meet & Greet',
    price: 95000,
    availableTickets: 0,
  },
]

function createWrapper() {
  return mount(TicketSelector, {
    props: { tickets },
  })
}

describe('TicketSelector', () => {
  it('calcula cantidad y total al agregar entradas', async () => {
    const wrapper = createWrapper()

    await wrapper.get('[aria-label="Agregar una entrada General"]').trigger('click')
    await wrapper.get('[aria-label="Agregar una entrada VIP"]').trigger('click')

    expect(wrapper.text()).toContain('Entradas seleccionadas: 2')
    expect(wrapper.text()).toContain('100.000')
  })

  it('permite quitar entradas seleccionadas', async () => {
    const wrapper = createWrapper()

    await wrapper.get('[aria-label="Agregar una entrada General"]').trigger('click')
    await wrapper.get('[aria-label="Quitar una entrada General"]').trigger('click')

    expect(wrapper.text()).toContain('Entradas seleccionadas: 0')
  })

  it('no permite seleccionar entradas agotadas', () => {
    const wrapper = createWrapper()

    expect(wrapper.text()).toContain('Agotado')
    expect(wrapper.find('[aria-label="Agregar una entrada Meet & Greet"]').exists()).toBe(false)
  })

  it('respeta el límite máximo de 6 entradas por tipo', async () => {
    const wrapper = createWrapper()
    const addButton = wrapper.get('[aria-label="Agregar una entrada General"]')

    for (let i = 0; i < 6; i++) {
      await addButton.trigger('click')
    }

    expect(wrapper.text()).toContain('Entradas seleccionadas: 6')
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('respeta la disponibilidad cuando es menor al límite', async () => {
    const wrapper = createWrapper()
    const addButton = wrapper.get('[aria-label="Agregar una entrada VIP"]')

    await addButton.trigger('click')
    await addButton.trigger('click')

    expect(wrapper.text()).toContain('Entradas seleccionadas: 2')
    expect(addButton.attributes('disabled')).toBeDefined()
  })

  it('no permite continuar con una compra real', () => {
    const wrapper = createWrapper()

    const continueButton = wrapper.get('.continue-button')

    expect(continueButton.attributes('disabled')).toBeDefined()
  })
})
