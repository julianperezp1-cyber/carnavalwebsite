'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Route, Landmark, Eye, X } from 'lucide-react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// ═══ MAP DATA ═══

// Parade route — Via 40 (approximate real coordinates)
const VIA_40_ROUTE: [number, number][] = [
  [-74.8100, 10.9830],
  [-74.8085, 10.9845],
  [-74.8065, 10.9860],
  [-74.8045, 10.9878],
  [-74.8020, 10.9898],
  [-74.7995, 10.9918],
  [-74.7970, 10.9938],
  [-74.7948, 10.9955],
  [-74.7925, 10.9970],
  [-74.7905, 10.9982],
  [-74.7880, 10.9995],
];

// Guacherna route (Calle 44)
const GUACHERNA_ROUTE: [number, number][] = [
  [-74.8050, 10.9850],
  [-74.8020, 10.9855],
  [-74.7990, 10.9860],
  [-74.7960, 10.9870],
  [-74.7935, 10.9880],
  [-74.7910, 10.9895],
];

interface MapMarker {
  name: string;
  type: 'carnaval' | 'turistico' | 'palco' | 'desfile';
  description: string;
  coordinates: [number, number]; // [lng, lat]
  icon: string;
}

const MARKERS: MapMarker[] = [
  // Carnaval
  { name: 'Casa del Carnaval', type: 'carnaval', description: 'Sede de Carnaval de Barranquilla S.A.S. Cra 54 No. 49B-39', coordinates: [-74.7953, 10.9878], icon: '🎭' },
  { name: 'Museo del Carnaval', type: 'carnaval', description: 'Tres salas de exposicion con la historia y arte del Carnaval.', coordinates: [-74.7948, 10.9882], icon: '🏛️' },
  // Turistico
  { name: 'Barrio Abajo', type: 'turistico', description: 'Cuna del Carnaval. Barrio historico donde nacieron las primeras comparsas.', coordinates: [-74.7920, 10.9920], icon: '🏘️' },
  { name: 'Gran Malecon del Rio', type: 'turistico', description: 'Paseo peatonal a orillas del Rio Magdalena. Gastronomia, cultura y vistas.', coordinates: [-74.7780, 10.9980], icon: '🌊' },
  { name: 'Ventana al Mundo', type: 'turistico', description: 'Monumento iconico y mirador de Barranquilla sobre el rio Magdalena.', coordinates: [-74.7785, 10.9985], icon: '🪟' },
  { name: 'Rueda de la Luna', type: 'turistico', description: 'Noria gigante con vista panoramica de Barranquilla y el rio.', coordinates: [-74.7775, 10.9990], icon: '🎡' },
  { name: 'Aleta del Tiburon', type: 'turistico', description: 'Escultura moderna que se ha convertido en simbolo de la nueva Barranquilla.', coordinates: [-74.7790, 10.9975], icon: '🦈' },
  { name: 'Plaza de San Nicolas', type: 'turistico', description: 'Centro historico de Barranquilla. Iglesia de San Nicolas de Tolentino.', coordinates: [-74.7830, 10.9640], icon: '⛪' },
  // Palcos
  { name: 'Palco Oficial Norte', type: 'palco', description: 'Palco principal con vista privilegiada al desfile. Sector norte Via 40.', coordinates: [-74.7920, 10.9965], icon: '🏟️' },
  { name: 'Palco Oficial Sur', type: 'palco', description: 'Palco oficial con graderias. Sector sur Via 40.', coordinates: [-74.8060, 10.9845], icon: '🏟️' },
  { name: 'Palco Batalla de Flores', type: 'palco', description: 'Palco especial para la Batalla de Flores. Tribuna central.', coordinates: [-74.7990, 10.9910], icon: '🌺' },
  { name: 'Estadio Romelio Martinez', type: 'desfile', description: 'Sede del Festival de Orquestas. El cierre musical del Carnaval.', coordinates: [-74.7960, 10.9850], icon: '🎵' },
];

const TYPE_COLORS: Record<string, string> = {
  carnaval: '#E83331',
  turistico: '#0064C8',
  palco: '#00AB25',
  desfile: '#FFCE38',
};

const TYPE_LABELS: Record<string, string> = {
  carnaval: 'Carnaval',
  turistico: 'Turismo',
  palco: 'Palcos',
  desfile: 'Eventos',
};

export function CarnavalMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-74.7950, 10.9880],
      zoom: 13.5,
      pitch: 55,
      bearing: -20,
      antialias: true,
    });

    const m = map.current;

    m.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right');

    m.on('load', () => {
      setMapLoaded(true);

      // 3D buildings
      const layers = m.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      m.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 12,
          paint: {
            'fill-extrusion-color': [
              'interpolate', ['linear'], ['get', 'height'],
              0, '#1a1a2e',
              50, '#16213e',
              100, '#0f3460',
            ],
            'fill-extrusion-height': ['get', 'height'],
            'fill-extrusion-base': ['get', 'min_height'],
            'fill-extrusion-opacity': 0.7,
          },
        },
        labelLayerId
      );

      // Via 40 parade route
      m.addSource('via40-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: VIA_40_ROUTE },
        },
      });

      // Route glow (wider, faded)
      m.addLayer({
        id: 'via40-glow',
        type: 'line',
        source: 'via40-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#E83331',
          'line-width': 12,
          'line-opacity': 0.2,
          'line-blur': 8,
        },
      });

      // Route line
      m.addLayer({
        id: 'via40-line',
        type: 'line',
        source: 'via40-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#E83331',
          'line-width': 4,
          'line-opacity': 0.9,
          'line-dasharray': [2, 2],
        },
      });

      // Guacherna route
      m.addSource('guacherna-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: { type: 'LineString', coordinates: GUACHERNA_ROUTE },
        },
      });

      m.addLayer({
        id: 'guacherna-glow',
        type: 'line',
        source: 'guacherna-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#FFCE38', 'line-width': 10, 'line-opacity': 0.15, 'line-blur': 6 },
      });

      m.addLayer({
        id: 'guacherna-line',
        type: 'line',
        source: 'guacherna-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#FFCE38', 'line-width': 3, 'line-opacity': 0.8, 'line-dasharray': [2, 2] },
      });

      // Add markers
      addMarkers(MARKERS);
    });

    return () => { m.remove(); map.current = null; };
  }, []);

  function addMarkers(markers: MapMarker[]) {
    // Remove existing
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'carnaval-marker';
      el.style.cssText = `
        width: 40px; height: 40px; border-radius: 12px;
        background: ${TYPE_COLORS[marker.type]};
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; cursor: pointer;
        box-shadow: 0 4px 12px ${TYPE_COLORS[marker.type]}40;
        border: 2px solid rgba(255,255,255,0.3);
        transition: transform 0.2s;
      `;
      el.innerHTML = marker.icon;
      el.onmouseenter = () => { el.style.transform = 'scale(1.2)'; };
      el.onmouseleave = () => { el.style.transform = 'scale(1)'; };
      el.onclick = (e) => { e.stopPropagation(); setSelectedMarker(marker); };

      const m = new mapboxgl.Marker(el)
        .setLngLat(marker.coordinates)
        .addTo(map.current!);

      markersRef.current.push(m);
    });
  }

  function filterMarkers(type: string | null) {
    setActiveFilter(type);
    setSelectedMarker(null);
    const filtered = type ? MARKERS.filter(m => m.type === type) : MARKERS;
    addMarkers(filtered);

    // Show/hide routes based on filter
    if (map.current && mapLoaded) {
      const showRoutes = !type || type === 'desfile';
      ['via40-glow', 'via40-line', 'guacherna-glow', 'guacherna-line'].forEach(id => {
        if (map.current!.getLayer(id)) {
          map.current!.setLayoutProperty(id, 'visibility', showRoutes ? 'visible' : 'none');
        }
      });
    }
  }

  function flyTo(coords: [number, number]) {
    map.current?.flyTo({ center: coords, zoom: 15.5, pitch: 60, bearing: -10, duration: 1500 });
  }

  return (
    <div className="relative">
      {/* Map container */}
      <div ref={mapContainer} className="w-full h-[500px] sm:h-[600px] lg:h-[700px] rounded-2xl overflow-hidden" />

      {/* Filter pills overlay */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
        <button
          onClick={() => filterMarkers(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-all ${
            !activeFilter ? 'bg-white text-brand-dark shadow-lg' : 'bg-black/40 text-white/70 hover:bg-black/60'
          }`}
        >
          Todos
        </button>
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => filterMarkers(activeFilter === key ? null : key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm transition-all flex items-center gap-1.5 ${
              activeFilter === key ? 'bg-white text-brand-dark shadow-lg' : 'bg-black/40 text-white/70 hover:bg-black/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: TYPE_COLORS[key] }} />
            {label}
          </button>
        ))}
      </div>

      {/* Route legend */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-3 z-10">
        <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">Rutas</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-carnaval-red rounded" />
            <span className="text-[11px] text-white/70">Via 40 — Desfiles principales</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gold rounded" />
            <span className="text-[11px] text-white/70">Guacherna — Desfile nocturno</span>
          </div>
        </div>
      </div>

      {/* Selected marker popup */}
      {selectedMarker && (
        <div className="absolute bottom-4 right-4 w-72 bg-white rounded-2xl shadow-2xl z-20 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedMarker.icon}</span>
                <div>
                  <h3 className="text-sm font-display font-black text-brand-dark">{selectedMarker.name}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: TYPE_COLORS[selectedMarker.type] }}>
                    {TYPE_LABELS[selectedMarker.type]}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedMarker(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed">{selectedMarker.description}</p>
            <button
              onClick={() => flyTo(selectedMarker.coordinates)}
              className="mt-3 w-full bg-brand-dark hover:bg-brand-dark-light text-white text-xs font-bold py-2 rounded-lg transition-colors"
            >
              Ver en el mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
