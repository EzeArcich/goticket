
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import EventDetailView from './EventDetailView.vue'

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: '/',
        name: 'catalog',
        component: { template: '<div>Catálogo</div>' },
      },
      {
        path: '/eventos/:id',
        name: 'event-detail',
        component: EventDetailView,
      },
    ],
  })
}

async function mountDetail(eventId: string) {
  const router = createTestRouter()

  await router.push(`/eventos/${eventId}`)
  await router.isReady()

  const wrapper = mount(EventDetailView, {
    global: {
      plugins: [router],
    },
  })

  await flushPromises()

  return wrapper
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-12T12:00:00-03:00'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('EventDetailView', () => {
  it('muestra el detalle de un evento publicado', async () => {
    const wrapper = await mountDetail('evt-001')

    expect(wrapper.find('h1').text()).toBe('Festival de Rock')
    expect(wrapper.text()).toContain('Sur Producciones')
    expect(wrapper.text()).toContain('Entradas')
  })

  it('muestra los tipos de entradas del evento', async () => {
    const wrapper = await mountDetail('evt-001')

    expect(wrapper.text()).toContain('General')
    expect(wrapper.text()).toContain('VIP')
    expect(wrapper.text()).toContain('Meet & Greet')
  })

  it('no muestra eventos en borrador', async () => {
    const wrapper = await mountDetail('evt-draft')

    expect(wrapper.find('h1').text()).toBe('Evento no disponible')
    expect(wrapper.find('.tickets-panel').exists()).toBe(false)
  })

  it('no muestra eventos con organizador suspendido', async () => {
    const wrapper = await mountDetail('evt-suspended')

    expect(wrapper.find('h1').text()).toBe('Evento no disponible')
  })

  it('no muestra eventos cancelados', async () => {
    const wrapper = await mountDetail('evt-cancelled')

    expect(wrapper.find('h1').text()).toBe('Evento no disponible')
  })

  it('muestra un mensaje cuando el evento no existe', async () => {
    const wrapper = await mountDetail('evento-inexistente')

    expect(wrapper.find('h1').text()).toBe('Evento no disponible')
    expect(wrapper.text()).toContain('Volver al catálogo')
  })

  it('integra el selector de entradas', async () => {
    const wrapper = await mountDetail('evt-001')

    expect(wrapper.find('.ticket-selector').exists()).toBe(true)
    expect(wrapper.text()).toContain('Seleccioná tus entradas')
    expect(wrapper.text()).toContain('Entradas seleccionadas: 0')
  })

  it('no permite continuar con la compra', async () => {
    const wrapper = await mountDetail('evt-001')

    const button = wrapper.get('.continue-button')

    expect(button.attributes('disabled')).toBeDefined()
  })
})
