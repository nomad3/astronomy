'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dummy ISS position data
const issPosition = { lat: 51.505, lng: -0.09 };

const issIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function ISSTrackerMap() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          🛰️ ISS Tracker
        </Typography>
        <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden' }}>
          <MapContainer center={[issPosition.lat, issPosition.lng]} zoom={3} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={[issPosition.lat, issPosition.lng]} icon={issIcon}>
              <Popup>International Space Station</Popup>
            </Marker>
          </MapContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

