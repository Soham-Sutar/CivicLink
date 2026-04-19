

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Report, Department } from '../types';

// Marker color mapping for each department
const categoryColors: Record<string, string> = {
  'Potholes': 'orange',
  'Streetlights': 'yellow',
  'Garbage': 'brown',
  'Water Works': 'blue',
  'Parks & Recreation': 'green',
};

function getMarkerIcon(category: string) {
  const color = categoryColors[category] || 'gray';
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 4px #333;"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

interface MapComponentProps {
  reports: Report[];
}


const MapComponent: React.FC<MapComponentProps> = ({ reports }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView([20.5937, 78.9629], 5); // Center on India
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(leafletMapRef.current);
    }

    // Remove previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add colored markers for each report
    reports.forEach(report => {
      console.log('MapComponent report:', {
        id: report.id,
        title: report.title,
        category: report.category,
        location: report.location
      });
      if (!report.location) return;
      const lat = typeof report.location.lat === 'number' ? report.location.lat : parseFloat(report.location.lat);
      const lng = typeof report.location.lng === 'number' ? report.location.lng : parseFloat(report.location.lng);
      if (isNaN(lat) || isNaN(lng)) return;
      const marker = L.marker([lat, lng], {
        icon: getMarkerIcon(report.category)
      }).addTo(leafletMapRef.current!);
      marker.bindPopup(`<b>${report.title}</b><br>${report.category}`);
      markersRef.current.push(marker);
    });
  }, [reports]);

  // Legend for categories
  const legendStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 12,
    right: 12,
    background: 'rgba(255,255,255,0.9)',
    padding: '8px 12px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px #0002',
    fontSize: '14px',
    zIndex: 1000,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px', borderRadius: '12px', overflow: 'hidden', margin: 'auto' }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <div style={legendStyle}>
        <b>Category Legend</b>
        <div style={{ marginTop: 6 }}>
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', background: color, marginRight: 8, border: '2px solid #fff', boxShadow: '0 0 2px #333' }}></span>
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
