import type { Event } from '../features/events/types/event'

export function filterEventsByCity(events: Event[], city: string): Event[] {
  const normalizedCity = normalizeText(city)

  return events.filter((event) => normalizeText(event.city) === normalizedCity)
}

export function filterEventsByTitle(events: Event[], title: string): Event[] {
  const normalizedTitle = normalizeText(title)

  return events.filter((event) => normalizeText(event.title).includes(normalizedTitle))
}

export function normalizeText(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return normalized
}
export interface EventFilters {
  text: string
  category: string
  city: string
  date: string
}

export function emptyFilters(): EventFilters {
  return { text: '', category: '', city: '', date: '' }
}

/** Día calendario en Argentina, independiente de la zona del navegador. */
export function eventDateKey(date: string): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(date))
  const part = (type: string) => parts.find((p) => p.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function isPublicEvent(event: Event, now: number = Date.now()): boolean {
  return (
    event.status === 'published' &&
    event.organizer.status === 'approved' &&
    event.organizer.active &&
    Number.isFinite(Date.parse(event.date)) &&
    Date.parse(event.date) > now
  )
}

export function catalogEvents(
  events: readonly Event[],
  filters: EventFilters = emptyFilters(),
  now: number = Date.now(),
): Event[] {
  return filterEventsByTitle(
    events.filter((event) => isPublicEvent(event, now)),
    filters.text,
  )
    .filter(
      (event) =>
        (!filters.category || normalizeText(event.category) === normalizeText(filters.category)) &&
        (!filters.city || normalizeText(event.city) === normalizeText(filters.city)) &&
        (!filters.date || eventDateKey(event.date) === filters.date),
    )
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        Date.parse(a.date) - Date.parse(b.date) ||
        a.id.localeCompare(b.id),
    )
}

export function paginateEvents<T>(items: readonly T[], requestedPage: number, pageSize = 6) {
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.trunc(pageSize)) : 6
  const totalPages = Math.max(1, Math.ceil(items.length / size))
  const page = Math.min(
    totalPages,
    Math.max(1, Number.isFinite(requestedPage) ? Math.trunc(requestedPage) : 1),
  )
  return {
    items: items.slice((page - 1) * size, page * size),
    page,
    totalPages,
    total: items.length,
  }
}
