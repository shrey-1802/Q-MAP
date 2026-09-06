import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { env } from '@/config/env';
import type { LocationPoint, RouteOption } from '@/types';
import { AlertTriangle, MapPin, Navigation } from 'lucide-react';

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

  // Initialize Leaflet Map Instance once
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

      // Carto Dark Voyager tiles
      L.tileLayer(env.VITE_MAP_TILE_URL, {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      if (interactive) {
        L.control.zoom({ position: 'topright' }).addTo(map);
      }

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;

      // Map click handler for interactive coordinate picking
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

  // Update Waypoint Markers and Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();
    const bounds = L.latLngBounds([]);

    // Custom CSS Pin Icons
    const createPin = (bgColor: string, text: string, ringColor: string) => {
      return L.divIcon({
        className: 'custom-pin-marker',
        html: `
          <div style="
            background: ${bgColor};
            color: #020617;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 12px;
            border: 2.5px solid #ffffff;
            box-shadow: 0 0 15px ${ringColor}, 0 4px 10px rgba(0,0,0,0.6);
            transform: translate(-16px, -16px);
          ">
            ${text}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // 1. Origin Pin (Teal)
    if (origin && origin.latitude && origin.longitude) {
      const originMarker = L.marker([origin.latitude, origin.longitude], {
        icon: createPin('#14b8a6', 'A', 'rgba(20, 184, 166, 0.6)'),
      }).bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px;">
          <b style="color: #14b8a6;">Start Origin:</b><br/>
          <span>${origin.address}</span>
        </div>
      `);
      layerGroup.addLayer(originMarker);
      bounds.extend([origin.latitude, origin.longitude]);
    }

    // 2. Intermediate Waypoint Stops (Indigo)
    stops.forEach((stop, index) => {
      if (stop.latitude && stop.longitude) {
        const stopMarker = L.marker([stop.latitude, stop.longitude], {
          icon: createPin('#818cf8', `${index + 1}`, 'rgba(129, 140, 248, 0.6)'),
        }).bindPopup(`
          <div style="font-family: Inter, sans-serif; font-size: 12px;">
            <b style="color: #818cf8;">Stop ${index + 1}:</b><br/>
            <span>${stop.address}</span>
          </div>
        `);
        layerGroup.addLayer(stopMarker);
        bounds.extend([stop.latitude, stop.longitude]);
      }
    });

    // 3. Destination Pin (Rose)
    if (destination && destination.latitude && destination.longitude) {
      const destMarker = L.marker([destination.latitude, destination.longitude], {
        icon: createPin('#f43f5e', 'B', 'rgba(244, 63, 94, 0.6)'),
      }).bindPopup(`
        <div style="font-family: Inter, sans-serif; font-size: 12px;">
          <b style="color: #f43f5e;">Destination:</b><br/>
          <span>${destination.address}</span>
        </div>
      `);
      layerGroup.addLayer(destMarker);
      bounds.extend([destination.latitude, destination.longitude]);
    }

    // 4. Polylines for Calculated Routes
    routes.forEach((route) => {
      if (!route.coordinates || route.coordinates.length < 2) return;

      const isSelected = selectedRouteId ? route.id === selectedRouteId : route.rank === 1;
      const isQiga = route.algorithm === 'QIGA';

      let color = '#475569';
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
        <div style="font-family: Inter, sans-serif; font-size: 12px; color: #f8fafc;">
          <b style="color: ${isQiga ? '#2dd4bf' : '#818cf8'}; font-size: 13px;">${route.name}</b><br/>
          <div style="margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
            <span>Algorithm: <b>${route.algorithm}</b></span>
            <span>Duration: <b>${Math.round(route.durationSeconds / 60)} mins</b></span>
            <span>Distance: <b>${(route.distanceMeters / 1000).toFixed(1)} km</b></span>
            <span>Fitness Score: <b>${(route.fitnessScore * 100).toFixed(1)}%</b></span>
          </div>
        </div>
      `);

      layerGroup.addLayer(polyline);

      if (isSelected) {
        route.coordinates.forEach((coord) => bounds.extend(coord));
      }
    });

    // Fit map bounds smoothly
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
    }
  }, [origin, destination, stops, routes, selectedRouteId]);

  if (mapError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-surface-900 border border-surface-800 rounded-2xl text-center min-h-[350px]">
        <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
        <h4 className="text-sm font-semibold text-surface-100">GIS Map Layer Offline</h4>
        <p className="text-xs text-surface-400 max-w-xs mt-1">
          Optimization results, route telemetry, and turn-by-turn guidance remain active.
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
