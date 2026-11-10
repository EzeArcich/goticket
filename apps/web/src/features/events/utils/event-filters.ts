import type { Event } from '../types/event';

export function filterEventsByCity(
    events: Event[],
    city: string,
): Event[] {
    // return events.filter((event) => event.city.toLowerCase().trim() === city.toLowerCase().trim());
    const normalizedCity = normalizeText(city);

    return events.filter(
        (event) => normalizeText(event.city) === normalizedCity
    )
}

export function filterEventsByTitle(
    events: Event[],
    title: string,
): Event[] {
    const normalizedTitle = normalizeText(title);

    return events.filter(
        (event) => normalizeText(event.title).includes(normalizedTitle)
    )       
}

export function normalizeText(text: string): string {
  const normalized = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return normalized
}