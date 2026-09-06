import { describe, it, expect } from 'vitest';
import { formatDistance, formatDuration, formatFitness, formatEmission } from '../utils/formatters';

describe('GIS and Metric Formatters', () => {
  it('correctly formats distances in metric', () => {
    expect(formatDistance(500)).toBe('500 m');
    expect(formatDistance(1500)).toBe('1.5 km');
    expect(formatDistance(23400)).toBe('23.4 km');
  });

  it('correctly formats distances in imperial', () => {
    expect(formatDistance(1609.34, 'IMPERIAL')).toBe('1.0 mi');
  });

  it('correctly formats travel durations', () => {
    expect(formatDuration(45)).toBe('45s');
    expect(formatDuration(180)).toBe('3 min');
    expect(formatDuration(3660)).toBe('1h 1m');
  });

  it('correctly formats fitness scores', () => {
    expect(formatFitness(0.962)).toBe('96.2');
    expect(formatFitness(0.85)).toBe('85.0');
  });

  it('correctly formats CO2 emissions', () => {
    expect(formatEmission(0.45)).toBe('450 g CO₂');
    expect(formatEmission(4.25)).toBe('4.25 kg CO₂');
  });
});
