import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { nextTick } from 'vue'
import App from '../App.vue'
import EventCatalogView from '../features/events/views/EventCatalogView.vue'
import EventDetailPlaceholder from '../features/events/views/EventDetailPlaceholder.vue'
import EventList from '../features/events/components/EventList.vue'
import EventHeroCarousel from '../features/events/components/EventHeroCarousel.vue'
import EventImage from '../features/events/components/EventImage.vue'
import { events } from '../features/events/data/events.mock'

const now = Date.parse('2026-11-12T12:00:00-03:00')
const wrappers: ReturnType<typeof mount>[] = []
const track = <T extends ReturnType<typeof mount>>(wrapper: T): T => {
  wrappers.push(wrapper)
  return wrapper
}
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(now)
})
afterEach(() => {
  wrappers.forEach((wrapper) => wrapper.unmount())
  wrappers.length = 0
  vi.useRealTimers()
})
const stubs = { RouterLink: { template: '<a><slot /></a>' } }
function list() {
  return track(mount(EventList, { props: { events, now }, global: { stubs } }))
}

describe('catálogo', () => {
  it('pagina y reinicia al cambiar cualquiera de los cuatro filtros', async () => {
    const wrapper = list()
    for (const [selector, value] of [
      ['input[type="search"]', '  rock  '],
      ['select[name="category"]', 'Teatro'],
      ['select[name="city"]', 'Córdoba'],
      ['input[type="date"]', '2027-02-06'],
    ]) {
      await wrapper.get('.event-list__pagination button:last-child').trigger('click')
      expect(wrapper.text()).toContain('Página 2 de 2')
      await wrapper.get(selector!).setValue(value!)
      expect(wrapper.text()).toContain('Página 1 de 1')
      expect(wrapper.findAll('.event-card')).toHaveLength(1)
      await wrapper.get('.event-list__filters button').trigger('click')
    }
  })
  it('muestra vacío y permite recuperar el catálogo', async () => {
    const wrapper = list()
    await wrapper.get('input[type="search"]').setValue('inexistente')
    expect(wrapper.find('.event-list__empty').exists()).toBe(true)
    expect(wrapper.find('.event-list__pagination').exists()).toBe(false)
    await wrapper.get('.event-list__empty button').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(6)
    expect(wrapper.get('.event-list__pagination button').attributes('disabled')).toBeDefined()
    await wrapper.get('.event-list__pagination button:last-child').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(3)
    expect(
      wrapper.get('.event-list__pagination button:last-child').attributes('disabled'),
    ).toBeDefined()
  })
  it('ajusta la página si se reduce el dataset público', async () => {
    const wrapper = list()
    await wrapper.get('.event-list__pagination button:last-child').trigger('click')
    await wrapper.setProps({ events: [events[0]!] })
    expect(wrapper.text()).toContain('Página 1 de 1')
    expect(wrapper.findAll('.event-card')).toHaveLength(1)
  })

  it('prepara un error explícito sin simular carga de API', async () => {
    const wrapper = list()
    await wrapper.setProps({ error: 'No se pudo preparar el catálogo.' })
    expect(wrapper.get('[role="alert"]').text()).toContain('No se pudo')
    expect(wrapper.find('.event-list__grid').exists()).toBe(false)
  })
  it('combina filtros y comunica agotado con texto', async () => {
    const wrapper = list()
    await wrapper.get('input[type="search"]').setValue('básquet')
    await wrapper.get('select[name="city"]').setValue('Rosario')
    expect(wrapper.findAll('.event-card')).toHaveLength(1)
    expect(wrapper.get('.event-card--sold-out').text()).toContain('Agotado')
    expect(wrapper.get('.event-card__button').text()).toBe('Ver evento')
    await wrapper.get('select[name="category"]').setValue('Teatro')
    expect(wrapper.text()).toContain('No se encontraron eventos')
  })
})

describe('carrusel e imágenes', () => {
  it('avanza, retrocede con wrap, permite indicador y reinicia si cambia el dataset', async () => {
    const wrapper = track(
      mount(EventHeroCarousel, { props: { events: [events[0]!, events[2]!] }, global: { stubs } }),
    )
    expect(wrapper.get('h2').text()).toBe(events[0]!.title)
    await wrapper.get('[aria-label="Siguiente evento"]').trigger('click')
    expect(wrapper.get('h2').text()).toBe(events[2]!.title)
    await wrapper.get('[aria-label="Siguiente evento"]').trigger('click')
    expect(wrapper.get('h2').text()).toBe(events[0]!.title)
    await wrapper.get('[aria-label="Evento anterior"]').trigger('click')
    expect(wrapper.get('h2').text()).toBe(events[2]!.title)
    await wrapper.get('.carousel-indicator').trigger('click')
    expect(wrapper.get('h2').text()).toBe(events[0]!.title)
    await wrapper.setProps({ events: [events[2]!] })
    expect(wrapper.find('.carousel-arrow').exists()).toBe(false)
    await wrapper.setProps({ events: [] })
    expect(wrapper.text()).toContain('Sin eventos destacados')
  })
  it('reemplaza imágenes ausentes o fallidas y recupera una nueva URL', async () => {
    const wrapper = track(mount(EventImage, { props: { alt: 'Evento de prueba' } }))
    expect(wrapper.attributes('src')).toBe('/events/placeholder.svg')
    await wrapper.setProps({ src: '/events/rock.jpg' })
    await wrapper.trigger('error')
    expect(wrapper.attributes('src')).toBe('/events/placeholder.svg')
    await wrapper.setProps({ src: '/events/basquet.jpeg' })
    expect(wrapper.attributes('src')).toBe('/events/basquet.jpeg')
    expect(wrapper.attributes('alt')).toBe('Evento de prueba')
  })
})

describe('home y rutas públicas', () => {
  async function app(path = '/') {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', name: 'catalog', component: EventCatalogView },
        { path: '/eventos/:id', name: 'event-detail', component: EventDetailPlaceholder },
        { path: '/:pathMatch(.*)*', component: EventDetailPlaceholder },
      ],
    })
    await router.push(path)
    await router.isReady()
    const wrapper = track(mount(App, { global: { plugins: [router] } }))
    return { wrapper, router }
  }
  it('conserva la home, filtra desde categorías y navega al placeholder agotado', async () => {
    const { wrapper, router } = await app()
    expect(wrapper.text()).toContain('Próximos eventos')
    expect(wrapper.text()).not.toContain('Borrador privado')
    await wrapper.get('[aria-label="Filtrar por Deportes"]').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(2)
    await wrapper.get('.event-card__button').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.path).toBe('/eventos/evt-003')
    expect(wrapper.text()).toContain('Agotado')
    expect(wrapper.text()).toContain('No hay reservas ni compras habilitadas')
    expect(wrapper.find('button').exists()).toBe(false)
  })
  it('permite volver a seleccionar una categoría después de limpiar filtros', async () => {
    const { wrapper } = await app()
    await wrapper.get('[aria-label="Filtrar por Teatro"]').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(1)
    await wrapper.get('.event-list__filters button').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(6)
    await wrapper.get('[aria-label="Filtrar por Teatro"]').trigger('click')
    expect(wrapper.findAll('.event-card')).toHaveLength(1)
  })

  it.each(['/eventos/evt-draft', '/eventos/evt-past', '/eventos/unknown', '/unknown'])(
    'no revela registros privados o inexistentes: %s',
    async (path) => {
      const { wrapper } = await app(path)
      expect(wrapper.text()).toContain('Evento o página no disponible')
      expect(wrapper.text()).not.toContain('Borrador privado')
    },
  )
  it('retira eventos del hero y la grilla al comenzar', async () => {
    vi.setSystemTime(Date.parse(events[0]!.date) - 500)
    const { wrapper } = await app()
    expect(wrapper.findAll('h2').some((node) => node.text() === events[0]!.title)).toBe(true)
    await vi.advanceTimersByTimeAsync(1000)
    await nextTick()
    expect(wrapper.findAll('h2').some((node) => node.text() === events[0]!.title)).toBe(false)
    expect(
      wrapper.findAll('.event-card__title').some((node) => node.text() === events[0]!.title),
    ).toBe(false)
  })
})
