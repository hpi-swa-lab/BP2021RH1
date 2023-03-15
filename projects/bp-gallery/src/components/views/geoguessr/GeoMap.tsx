import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { Button } from '@mui/material';

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
const GeoMap = ({ onNextPicture }: { onNextPicture: () => void }) => {
  const [guessComplete, setGuessComplete] = useState(false);

  const nextPicture = () => {
    setGuessComplete(false);
    onNextPicture();
  };
  const guess = () => {
    setGuessComplete(true);
  };

  return (
    <div className={'map-container ' + (guessComplete ? 'guess-complete' : '')}>
      {guessComplete && (
        <div className='guess-complete-text'>
          <h2>Guter Tipp!</h2>
          <p>So haben die anderen geraten:</p>
        </div>
      )}
      <MapContainer
        center={{ lat: 51.505, lng: -0.09 }}
        zoom={13}
        className='map'
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <LocationMarker />
      </MapContainer>
      {!guessComplete && (
        <Button variant='contained' onClick={guess}>
          Ort bestätigen
        </Button>
      )}
      {guessComplete && (
        <Button variant='contained' onClick={nextPicture}>
          Nächstes Bild
        </Button>
      )}
    </div>
  );
};

export default GeoMap;
