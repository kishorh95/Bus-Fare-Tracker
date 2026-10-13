export type MockFareObservation = {
  observedAt: string;
  label: string;
  fare: number;
};

export type MockBusService = {
  id: string;
  operator: string;
  busType: string;
  departure: string;
  arrival: string;
  duration: string;
  amenities: string[];
  observations: MockFareObservation[];
  nextDemoFares: number[];
};

// Fictional data for development only. These are NOT actual supplier quotes.
export const mockBusServices: MockBusService[] = [
  {
    id: 'demo-sleeper-1',
    operator: 'Western Star Travels (Demo)',
    busType: 'AC Sleeper (2+1)',
    departure: '18:30',
    arrival: '10:15',
    duration: '15h 45m',
    amenities: ['AC', 'Sleeper', 'Charging point'],
    observations: [
      { observedAt: '2026-10-07T09:00:00+05:30', label: 'Oct 7 · 9 AM', fare: 1499 },
      { observedAt: '2026-10-08T09:00:00+05:30', label: 'Oct 8 · 9 AM', fare: 1549 },
      { observedAt: '2026-10-09T09:00:00+05:30', label: 'Oct 9 · 9 AM', fare: 1449 },
      { observedAt: '2026-10-10T09:00:00+05:30', label: 'Oct 10 · 9 AM', fare: 1399 },
      { observedAt: '2026-10-11T09:00:00+05:30', label: 'Oct 11 · 9 AM', fare: 1499 },
      { observedAt: '2026-10-12T09:00:00+05:30', label: 'Oct 12 · 9 AM', fare: 1349 },
      { observedAt: '2026-10-13T09:00:00+05:30', label: 'Oct 13 · 9 AM', fare: 1449 },
    ],
    nextDemoFares: [1399, 1299, 1349, 1499],
  },
  {
    id: 'demo-seater-2',
    operator: 'Deccan Roadlines (Demo)',
    busType: 'Non-AC Seater (2+2)',
    departure: '20:15',
    arrival: '12:10',
    duration: '15h 55m',
    amenities: ['Seater', 'Water bottle'],
    observations: [
      { observedAt: '2026-10-07T09:15:00+05:30', label: 'Oct 7 · 9:15 AM', fare: 899 },
      { observedAt: '2026-10-08T09:15:00+05:30', label: 'Oct 8 · 9:15 AM', fare: 949 },
      { observedAt: '2026-10-09T09:15:00+05:30', label: 'Oct 9 · 9:15 AM', fare: 899 },
      { observedAt: '2026-10-10T09:15:00+05:30', label: 'Oct 10 · 9:15 AM', fare: 849 },
      { observedAt: '2026-10-11T09:15:00+05:30', label: 'Oct 11 · 9:15 AM', fare: 899 },
      { observedAt: '2026-10-12T09:15:00+05:30', label: 'Oct 12 · 9:15 AM', fare: 799 },
      { observedAt: '2026-10-13T09:15:00+05:30', label: 'Oct 13 · 9:15 AM', fare: 829 },
    ],
    nextDemoFares: [799, 779, 849, 829],
  },
  {
    id: 'demo-sleeper-3',
    operator: 'Sahyadri Express Coaches (Demo)',
    busType: 'AC Seater/Sleeper (2+1)',
    departure: '19:45',
    arrival: '11:30',
    duration: '15h 45m',
    amenities: ['AC', 'Semi-sleeper', 'USB charging'],
    observations: [
      { observedAt: '2026-10-07T09:30:00+05:30', label: 'Oct 7 · 9:30 AM', fare: 1199 },
      { observedAt: '2026-10-08T09:30:00+05:30', label: 'Oct 8 · 9:30 AM', fare: 1249 },
      { observedAt: '2026-10-09T09:30:00+05:30', label: 'Oct 9 · 9:30 AM', fare: 1299 },
      { observedAt: '2026-10-10T09:30:00+05:30', label: 'Oct 10 · 9:30 AM', fare: 1249 },
      { observedAt: '2026-10-11T09:30:00+05:30', label: 'Oct 11 · 9:30 AM', fare: 1199 },
      { observedAt: '2026-10-12T09:30:00+05:30', label: 'Oct 12 · 9:30 AM', fare: 1249 },
      { observedAt: '2026-10-13T09:30:00+05:30', label: 'Oct 13 · 9:30 AM', fare: 1299 },
    ],
    nextDemoFares: [1349, 1299, 1249, 1399],
  },
];
