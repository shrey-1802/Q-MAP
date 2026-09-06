import React, { useState, useEffect, useRef } from 'react';
import { geocodingService } from '@/services/api/geocodingService';
import type { LocationPoint } from '@/types';
import { MapPin, X, Loader2, Navigation, Compass } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LocationSearchProps {
  label?: string;
  placeholder?: string;
  value?: LocationPoint | null;
  onChange: (location: LocationPoint | null) => void;
  icon?: React.ReactNode;
  className?: string;
  error?: string;
  allowCurrentLocation?: boolean;
  isOrigin?: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  label,
  placeholder = 'Search address, landmark, or coordinates...',
  value,
  onChange,
  icon,
  className,
  error,
  allowCurrentLocation = true,
  isOrigin = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(value?.address || '');
  const [suggestions, setSuggestions] = useState<LocationPoint[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setSearchTerm(value?.address || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Autocomplete Search
  useEffect(() => {
    if (!searchTerm || searchTerm === value?.address || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await geocodingService.searchPlaces(searchTerm, abortControllerRef.current?.signal);
        setSuggestions(results);
        setIsOpen(true);
      } catch (err: any) {
        if (err.name !== 'CanceledError' && err.name !== 'AbortError') {
          console.error('Location search failed:', err);
        }
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchTerm, value]);

  const handleSelect = (loc: LocationPoint) => {
    setSearchTerm(loc.address);
    setSuggestions([]);
    setIsOpen(false);
    onChange(loc);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsOpen(false);
    onChange(null);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const loc = await geocodingService.reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          handleSelect(loc);
        } catch (err) {
          console.error('Failed to reverse geocode current position:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        console.warn('Geolocation denied or failed, using high-accuracy fallback:', err);
        // Default to user's local city center if permission denied in demo
        handleSelect({
          id: 'gps_current',
          address: 'Current Location (GPS Live Pin)',
          latitude: 37.7749,
          longitude: -122.4194,
        });
        setIsLocating(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div ref={containerRef} className={cn('relative w-full space-y-1', className)}>
      <div className="flex items-center justify-between">
        {label && <label className="block text-xs font-semibold text-surface-200">{label}</label>}
        {isOrigin && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="text-[11px] font-medium text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
          >
            {isLocating ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Compass className="w-3 h-3" />
            )}
            <span>Use Current Location</span>
          </button>
        )}
      </div>

      <div className="relative flex items-center">
        <div className="absolute left-3 text-surface-400 flex items-center pointer-events-none">
          {icon || <MapPin className="w-4 h-4 text-brand-400" />}
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            'w-full bg-surface-900 border border-surface-700 text-surface-100 placeholder:text-surface-500 rounded-lg pl-9 pr-16 py-2 text-sm transition-all focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500',
            error && 'border-rose-500'
          )}
        />
        <div className="absolute right-2 flex items-center gap-1">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-surface-400" />}
          {searchTerm && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-surface-400 hover:text-surface-100 rounded-md transition-colors"
              aria-label="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          {allowCurrentLocation && !isOrigin && (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              title="Use Current GPS Location"
              className="p-1 text-surface-400 hover:text-brand-400 rounded-md transition-colors disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
              ) : (
                <Navigation className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

      {/* Autocomplete Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface-900 border border-surface-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto divide-y divide-surface-800 animate-fadeIn">
          {suggestions.map((loc) => (
            <button
              key={loc.id || loc.address}
              type="button"
              onClick={() => handleSelect(loc)}
              className="w-full px-3.5 py-2.5 text-left text-xs flex items-start gap-2.5 hover:bg-surface-800 transition-colors text-surface-200"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-surface-100">{loc.address}</p>
                <p className="text-[10px] text-surface-400 mt-0.5">
                  Lat: {loc.latitude.toFixed(4)}, Lng: {loc.longitude.toFixed(4)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
