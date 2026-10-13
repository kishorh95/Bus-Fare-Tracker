import { describe, expect, it } from 'vitest';
import { percentageChange, validateFareObservation } from '../src';

describe('percentageChange', () => {
  it('calculates an increase', () => expect(percentageChange(1000, 1100)).toBeCloseTo(10));
  it('calculates a decrease', () => expect(percentageChange(800, 600)).toBeCloseTo(-25));
  it('rejects a zero previous fare', () => expect(() => percentageChange(0, 100)).toThrow());
});

describe('validateFareObservation', () => {
  it('accepts a valid fare', () => {
    expect(validateFareObservation({ origin: 'Bengaluru', destination: 'Pune', travelDate: '2026-11-20', fareAmount: 1499 })).toEqual([]);
  });
  it('rejects same origin and destination and a negative fare', () => {
    expect(validateFareObservation({ origin: 'Pune', destination: 'Pune', travelDate: '2026-11-20', fareAmount: -10 })).toContain('Origin and destination must differ.');
  });
});
