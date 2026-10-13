export type FareObservationInput = {
  origin: string;
  destination: string;
  travelDate: string;
  fareAmount: number;
  currency?: 'INR';
  busType?: string;
  operatorName?: string;
};

export function percentageChange(previous: number, current: number): number {
  if (!Number.isFinite(previous) || !Number.isFinite(current) || previous <= 0) {
    throw new Error('Previous and current fares must be finite; previous fare must be greater than zero.');
  }
  return ((current - previous) / previous) * 100;
}

export function validateFareObservation(input: FareObservationInput): string[] {
  const errors: string[] = [];
  if (!input.origin.trim()) errors.push('Origin is required.');
  if (!input.destination.trim()) errors.push('Destination is required.');
  if (input.origin.trim().toLowerCase() === input.destination.trim().toLowerCase()) errors.push('Origin and destination must differ.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.travelDate) || Number.isNaN(Date.parse(`${input.travelDate}T00:00:00Z`))) errors.push('Travel date must be a valid YYYY-MM-DD date.');
  if (!Number.isFinite(input.fareAmount) || input.fareAmount <= 0) errors.push('Fare must be a positive number.');
  return errors;
}
