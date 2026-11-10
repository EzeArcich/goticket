import type { Event } from '../types/event';

export const events: Event[] = [
  {
    id: 'evt-001',
    title: 'Festival de Rock',
    description: 'Una noche de rock en Buenos Aires',
    date: '2027-01-15T21:00:00-03:00',
    city: 'Buenos Aires',
    price: 35000,
    featured: true,
  },
  {
    id: 'evt-002',
    title: 'Noche de Teatro en Córdoba',
    description: 'Una comedia para disfrutar del teatro en Córdoba',
    date: '2027-02-06T20:30:00-03:00',
    city: 'Córdoba',
    price: 18000,
    featured: false,
  },
  {
    id: 'evt-003',
    title: 'Copa de Básquet en Rosario',
    description: 'Una jornada deportiva con equipos de básquet de la región',
    date: '2027-02-20T18:00:00-03:00',
    city: 'Rosario',
    price: 12000,
    featured: true,
  },
]
