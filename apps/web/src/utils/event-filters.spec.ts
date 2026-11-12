import { describe, expect, it } from 'vitest'
import { events as mockEvents } from '../features/events/data/events.mock'
import { filterEventsByCity, normalizeText, filterEventsByTitle } from './event-filters'

const events = mockEvents.slice(0, 3)

describe('filterEventsByCity', () => {
  it('returns only events from Córdoba', () => {
    const result = filterEventsByCity(events, 'Córdoba')

    expect(result.length).toBe(1)
    expect(result[0]?.city).toBe('Córdoba')
  })

  it('ignores casing and surrounding whitespace', () => {
    const result = filterEventsByCity(events, '  cÓrDoBa  ')

    expect(result).toHaveLength(1)
    expect(result[0]?.city).toBe('Córdoba')
  })

  it('finds cities without requiring accents', () => {
    const result = filterEventsByCity(events, 'cordoba')

    expect(result).toHaveLength(1)
    expect(result[0]?.city).toBe('Córdoba')
  })
})

describe('normalizeText', () => {
  it('removes accents, whitespace and uppercase', () => {
    const result = normalizeText('  CÓRDOBA  ')

    expect(result).toBe('cordoba')
  })
})

describe('filterEventsByTitle', () => {
  it('returns only events with title containing the search term', () => {
    const result = filterEventsByTitle(events, 'rock')

    expect(result).toHaveLength(1)
    expect(result[0]?.title).toBe('Festival de Rock')
  })

  it('ignores casing and surrounding whitespace', () => {
    const result = filterEventsByTitle(events, '  nOcHe De TeAtRo  ')

    expect(result).toHaveLength(1)
    expect(result[0]?.title).toBe('Noche de Teatro en Córdoba')
  })

  it('finds titles without requiring accents', () => {
    const result = filterEventsByTitle(events, 'basquet')

    expect(result).toHaveLength(1)
    expect(result[0]?.title).toBe('Copa de Básquet en Rosario')
  })

  it('returns all events when search is empty', () => {
    const result = filterEventsByTitle(events, '')

    expect(result).toHaveLength(events.length)
  })

  it('returns all events when search contains only whitespace', () => {
    const result = filterEventsByTitle(events, '   ')

    expect(result).toHaveLength(events.length)
  })

  it('returns no events when search has no matches', () => {
    const result = filterEventsByTitle(events, 'evento inexistente')

    expect(result).toHaveLength(0)
  })
})
