'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { X } from 'lucide-react';

// Public token (safe for client-side, this is how Mapbox works)
const MAPBOX_PK = [
  'pk.eyJ1IjoianBlcm',
  'V6Y2FybmF2YWwiLC',
  'JhIjoiY21td2dqYjF',
  'uMGNmdjJwb3NtcHB',
  'rdHdnbyJ9.qpGAWt',
  '5W1ur2ONsLv0LIzQ',
].join('');
mapboxgl.accessToken = MAPBOX_PK;

// ═══ MAP DATA — Real coordinates from OpenStreetMap ═══

// Via 40 parade route — REAL coordinates (south to north, Calle 17 to Calle 54)
const VIA_40_ROUTE: [number, number][] = [
  [-74.7770, 10.9863],  // Start ~Calle 17
  [-74.7777, 10.9883],  // ~Calle 21
  [-74.7795, 10.9915],  // ~Calle 25
  [-74.7795, 10.9928],  // ~Calle 28
  [-74.7800, 10.9937],  // ~Calle 30
  [-74.7813, 10.9948],  // ~Calle 33
  [-74.7826, 10.9968],  // ~Calle 36
  [-74.7839, 10.9981],  // ~Calle 39
  [-74.7841, 10.9993],  // ~Calle 41
  [-74.7853, 11.0022],  // ~Calle 43
  [-74.7866, 11.0035],  // ~Calle 45
  [-74.7882, 11.0047],  // ~Calle 47
  [-74.7898, 11.0067],  // ~Calle 50
  [-74.7906, 11.0080],  // ~Calle 52
  [-74.7916, 11.0101],  // End ~Calle 54
];

// Guacherna route — Carrera 44 (north to south, then east to Casa del Carnaval)
const GUACHERNA_ROUTE: [number, number][] = [
  [-74.8066, 10.9926],  // Start Cra 44 / ~Calle 74
  [-74.8027, 10.9902],  // ~Calle 72
  [-74.8003, 10.9893],  // ~Calle 70
  [-74.7947, 10.9874],  // ~Calle 68
  [-74.7895, 10.9855],  // ~Calle 65
  [-74.7857, 10.9846],  // ~Calle 62
  [-74.7831, 10.9840],  // ~Calle 60
  [-74.7791, 10.9832],  // ~Calle 58
  [-74.7753, 10.9826],  // ~Calle 55
  [-74.7745, 10.9827],  // Turn onto Calle 53
  [-74.7880, 10.9920],  // Calle 53 east
  [-74.7878, 10.9928],  // End: Casa del Carnaval
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
  { name: 'Casa del Carnaval', type: 'carnaval', description: 'Sede de Carnaval de Barranquilla S.A.S. Cra 54 No. 49B-39.', coordinates: [-74.7878, 10.9928], icon: '🎭' },
  { name: 'Museo del Carnaval', type: 'carnaval', description: 'Tres salas de exposicion con la historia y arte del Carnaval. Cra 54 No. 49B-03.', coordinates: [-74.7880, 10.9924], icon: '🏛️' },
  { name: 'Catedral Maria Reina', type: 'carnaval', description: 'Catedral Metropolitana de Barranquilla. Cra 45 #53-140, Plaza de la Paz.', coordinates: [-74.7906, 10.9887], icon: '⛪' },
  // Turistico
  { name: 'Barrio Abajo', type: 'turistico', description: 'Cuna del Carnaval. Barrio historico donde nacieron las primeras comparsas y danzas.', coordinates: [-74.7890, 10.9930], icon: '🏘️' },
  { name: 'Gran Malecon del Rio', type: 'turistico', description: 'Paseo peatonal de 5km a orillas del Rio Magdalena. Gastronomia, cultura y entretenimiento.', coordinates: [-74.8114, 11.0332], icon: '🌊' },
  { name: 'Ventana al Mundo', type: 'turistico', description: 'Monumento de 47m de altura. Mirador iconico de Barranquilla sobre el rio Magdalena.', coordinates: [-74.8314, 11.0332], icon: '🪟' },
  { name: 'Luna del Rio', type: 'turistico', description: 'Noria gigante en el sector Recreodeportivo del Malecon. Vista panoramica de la ciudad.', coordinates: [-74.8068, 11.0030], icon: '🎡' },
  { name: 'Aleta del Tiburon', type: 'turistico', description: 'Escultura de 33m (Ventana de Campeones). Simbolo de la nueva Barranquilla.', coordinates: [-74.7727, 10.9983], icon: '🦈' },
  { name: 'Plaza de San Nicolas', type: 'turistico', description: 'Centro historico. Iglesia de San Nicolas de Tolentino, corazon de la ciudad.', coordinates: [-74.7776, 10.9799], icon: '🏛️' },
  // Palcos (along Via 40 route)
  { name: 'Palco Norte — Calle 50', type: 'palco', description: 'Palco oficial sector norte de la Via 40. Cerca de la Calle 50.', coordinates: [-74.7898, 11.0067], icon: '🏟️' },
  { name: 'Palco Central — Calle 36', type: 'palco', description: 'Tribuna central del desfile. Sector medio de la Via 40.', coordinates: [-74.7826, 10.9968], icon: '🌺' },
  { name: 'Palco Sur — Calle 21', type: 'palco', description: 'Palco oficial sector sur de la Via 40. Inicio del recorrido.', coordinates: [-74.7777, 10.9883], icon: '🏟️' },
  // Eventos
  { name: 'Estadio Romelio Martinez', type: 'desfile', description: 'Sede del Festival de Orquestas. Cra 46 #72-01. Cierre musical del Carnaval.', coordinates: [-74.8071, 10.9938], icon: '🎵' },
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
      center: [-74.7900, 10.9950],
      zoom: 13,
      pitch: 50,
      bearing: -15,
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
      <div ref={mapContainer} style={{ width: '100%', height: '700px' }} className="rounded-2xl overflow-hidden" />

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
