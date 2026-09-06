/**
 * Production GIS & Metric Formatters
 */

export function formatDistance(meters: number, unit: 'METRIC' | 'IMPERIAL' = 'METRIC'): string {
  if (unit === 'IMPERIAL') {
    const miles = meters * 0.000621371;
    if (miles < 0.1) {
      const feet = Math.round(meters * 3.28084);
      return `${feet} ft`;
    }
    return `${miles.toFixed(1)} mi`;
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export function formatEta(secondsFromNow: number): string {
  const arrivalTime = new Date(Date.now() + secondsFromNow * 1000);
  return arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amountUsd?: number): string {
  if (amountUsd === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amountUsd);
}

export function formatEmission(co2Kg?: number): string {
  if (co2Kg === undefined) return 'N/A';
  if (co2Kg < 1) {
    return `${Math.round(co2Kg * 1000)} g CO₂`;
  }
  return `${co2Kg.toFixed(2)} kg CO₂`;
}

export function formatFitness(score?: number): string {
  if (score === undefined) return 'N/A';
  return (score * 100).toFixed(1);
}
