import './GeoMap.scss';
import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';

const LocationMarker = () => {
  const [position, setPosition] = useState({ lat: 51.505, lng: -0.09 });
  useMapEvent('click', event => {
    setPosition({ lat: event.latlng.lat, lng: event.latlng.lng });
  });

  return (
    <Marker position={position}>
      <Popup>You clicked that</Popup>
    </Marker>
  );
};
const GeoMap = () => {
  return (
    <MapContainer center={{ lat: 51.505, lng: -0.09 }} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <LocationMarker />
    </MapContainer>
  );
};

export default GeoMap;
