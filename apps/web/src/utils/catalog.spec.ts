import { describe, expect, it } from 'vitest'
import type { Event } from '../features/events/types/event'
import { events } from '../features/events/data/events.mock'
import {
  catalogEvents,
  emptyFilters,
  eventDateKey,
  isPublicEvent,
  paginateEvents,
} from './event-filters'
import { formatEventDate, formatPrice } from './formatters'

const now = Date.parse('2026-11-12T12:00:00-03:00')
const base = events[0]!
const make = (changes: Partial<Event> = {}): Event => ({ ...base, ...changes })

describe('visibilidad pública', () => {
  it('incluye agotados y excluye los casos privados del dataset', () => {
    const result = catalogEvents(events, emptyFilters(), now)
    expect(result).toHaveLength(9)
    expect(result.some((event) => event.availableTickets === 0)).toBe(true)
    expect(result.every((event) => /^evt-00\d$/.test(event.id))).toBe(true)
  })
  it.each(['draft', 'cancelled'] as const)('excluye estado %s', (status) => {
    expect(isPublicEvent(make({ status }), now)).toBe(false)
  })
  it.each(['pending', 'suspended'] as const)('excluye organizador %s', (status) => {
    expect(isPublicEvent(make({ organizer: { ...base.organizer, status } }), now)).toBe(false)
  })
  it('excluye inactivos, fechas inválidas, pasadas y el instante de inicio', () => {
    expect(isPublicEvent(make({ organizer: { ...base.organizer, active: false } }), now)).toBe(
      false,
    )
    for (const date of ['bad date', '2020-01-01T12:00:00-03:00', '2026-11-12T12:00:00-03:00']) {
      expect(isPublicEvent(make({ date }), now)).toBe(false)
    }
  })
})

describe('filtros combinables', () => {
  it.each([
    [{ text: '  BÁSQUET  ' }, ['evt-003']],
    [{ category: 'teatro' }, ['evt-002']],
    [{ city: '  cÓRdObA ' }, ['evt-002']],
    [{ date: '2027-02-20' }, ['evt-003']],
    [{ text: 'basquet', category: 'Deportes', city: 'rosario', date: '2027-02-20' }, ['evt-003']],
    [{ text: 'basquet', city: 'Salta' }, []],
    [{ date: 'invalid' }, []],
  ])('aplica %j', (filters, expected) => {
    expect(catalogEvents(events, { ...emptyFilters(), ...filters }, now).map((e) => e.id)).toEqual(
      expected,
    )
  })
  it('usa el día de Argentina aunque la entrada tenga otro offset', () => {
    const event = make({ date: '2027-01-16T01:30:00Z' })
    expect(eventDateKey(event.date)).toBe('2027-01-15')
    expect(catalogEvents([event], { ...emptyFilters(), date: '2027-01-15' }, now)).toHaveLength(1)
  })
  it('no muta el origen; prioriza destacados, fecha y luego id estable', () => {
    const items = [
      make({ id: 'z', featured: false }),
      make({ id: 'b' }),
      make({ id: 'a' }),
      make({ id: 'c', date: '2027-01-14T21:00:00-03:00' }),
    ]
    expect(catalogEvents(items, emptyFilters(), now).map((e) => e.id)).toEqual(['c', 'a', 'b', 'z'])
    expect(items.map((e) => e.id)).toEqual(['z', 'b', 'a', 'c'])
  })
})

describe('paginación', () => {
  it('devuelve última página parcial y normaliza páginas fuera de rango', () => {
    const items = [1, 2, 3, 4, 5, 6, 7]
    expect(paginateEvents(items, 2)).toEqual({ items: [7], page: 2, totalPages: 2, total: 7 })
    expect(paginateEvents(items, 999).page).toBe(2)
    expect(paginateEvents(items, -1).page).toBe(1)
    expect(paginateEvents(items, NaN).page).toBe(1)
  })
  it('maneja vacío, tamaño inválido y páginas fraccionarias', () => {
    expect(paginateEvents([], 10)).toEqual({ items: [], page: 1, totalPages: 1, total: 0 })
    expect(paginateEvents([1, 2], 1, 0).items).toEqual([1])
    expect(paginateEvents([1, 2], 1.8, NaN).items).toEqual([1, 2])
  })
})

describe('formatos argentinos', () => {
  it('muestra ARS y fecha/hora argentina independientemente de la zona del host', () => {
    expect(formatPrice(35000)).toMatch(/35.000/)
    expect(formatEventDate('2027-01-16T01:30:00Z')).toMatch(/15.*ene.*2027.*22:30/)
  })
})
