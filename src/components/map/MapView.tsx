import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { env } from '@/config/env';
import type { LocationPoint, RouteOption } from '@/types';
import { MapPin, Navigation, AlertTriangle } from 'lucide-react';

export interface MapViewProps {
  origin?: LocationPoint | null;
  destination?: LocationPoint | null;
  stops?: LocationPoint[];
  routes?: RouteOption[];
  selectedRouteId?: string;
  onMapClick?: (lat: number, lng: number) => void;
  className?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  origin,
  destination,
  stops = [],
  routes = [],
  selectedRouteId,
  onMapClick,
  className = 'h-full w-full min-h-[400px]',
  center = [37.7749, -122.4194],
  zoom = 12,
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapError, setMapError] = React.useState<boolean>(false);

  // Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: false,
        attributionControl: false,
        dragging: interactive,
        touchZoom: interactive,
        scrollWheelZoom: interactive,
        doubleClickZoom: interactive,
      });

      // Add Carto Dark / Voyager tile layer
      L.tileLayer(env.VITE_MAP_TILE_URL, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add Zoom Controls at top-right
      if (interactive) {
        L.control.zoom({ position: 'topright' }).addTo(map);
      }

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Handle map clicks
      if (onMapClick) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }
    } catch (err) {
      console.error('Failed to initialize Leaflet Map:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Layers & Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds = L.latLngBounds([]);

    // Custom Marker Icons
    const createCustomIcon = (bgColor: string, text: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div style="background-color: ${bgColor}; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #020617; font-weight: 800; font-size: 11px; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">${text}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    // 1. Origin Marker
    if (origin && origin.latitude && origin.longitude) {
      const originMarker = L.marker([origin.latitude, origin.longitude], {
        icon: createCustomIcon('#2dd4bf', 'A'),
      }).bindPopup(`<b>Origin:</b><br/>${origin.address}`);
      layerGroup.addLayer(originMarker);
      bounds.extend([origin.latitude, origin.longitude]);
    }

    // 2. Intermediate Stops
    stops.forEach((stop, index) => {
      if (stop.latitude && stop.longitude) {
        const stopMarker = L.marker([stop.latitude, stop.longitude], {
          icon: createCustomIcon('#818cf8', `${index + 1}`),
        }).bindPopup(`<b>Stop ${index + 1}:</b><br/>${stop.address}`);
        layerGroup.addLayer(stopMarker);
        bounds.extend([stop.latitude, stop.longitude]);
      }
    });

    // 3. Destination Marker
    if (destination && destination.latitude && destination.longitude) {
      const destMarker = L.marker([destination.latitude, destination.longitude], {
        icon: createCustomIcon('#f43f5e', 'B'),
      }).bindPopup(`<b>Destination:</b><br/>${destination.address}`);
      layerGroup.addLayer(destMarker);
      bounds.extend([destination.latitude, destination.longitude]);
    }

    // 4. Polylines for Routes
    routes.forEach((route) => {
      if (!route.coordinates || route.coordinates.length < 2) return;

      const isSelected = selectedRouteId ? route.id === selectedRouteId : route.rank === 1;
      const isQiga = route.algorithm === 'QIGA';

      let color = '#64748b'; // Inactive
      let weight = 4;
      let opacity = 0.5;

      if (isSelected) {
        color = isQiga ? '#14b8a6' : '#6366f1';
        weight = 6;
        opacity = 0.95;
      }

      const polyline = L.polyline(route.coordinates, {
        color,
        weight,
        opacity,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.bindPopup(`
        <div style="font-size: 12px; font-family: Inter, sans-serif;">
          <b style="color: ${isQiga ? '#2dd4bf' : '#818cf8'};">${route.name}</b><br/>
          <span>Algorithm: <b>${route.algorithm}</b></span><br/>
          <span>Duration: <b>${Math.round(route.durationSeconds / 60)} mins</b></span><br/>
          <span>Distance: <b>${(route.distanceMeters / 1000).toFixed(1)} km</b></span>
        </div>
      `);

      layerGroup.addLayer(polyline);

      if (isSelected) {
        route.coordinates.forEach((coord) => bounds.extend(coord));
      }
    });

    // Fit map bounds smoothly if we have valid coordinates
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [origin, destination, stops, routes, selectedRouteId]);

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-900 border border-surface-800 rounded-2xl text-center min-h-[300px]">
        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
        <h4 className="text-sm font-semibold text-surface-100">Map Temporarily Unavailable</h4>
        <p className="text-xs text-surface-400 max-w-xs mt-1">
          Route information and QIGA optimization telemetry remain fully operational.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner border border-surface-800">
      <div ref={mapContainerRef} className={className} />
    </div>
  );
};
