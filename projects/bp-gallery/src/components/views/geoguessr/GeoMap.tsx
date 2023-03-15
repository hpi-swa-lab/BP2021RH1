import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { useCreatePictureGeoInfoMutation } from '../../../graphql/APIConnector';
import { LatLngBounds } from 'leaflet';

const PlayerMarkers = () => {
  const map = useMap();
  const hardcodedLatLng = useMemo(
    () => [
      { lat: 51.509, lng: -0.05 },
      { lat: 51.504, lng: -0.08 },
      { lat: 51.503, lng: -0.07 },
    ],
    []
  );
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.flyToBounds(
        new LatLngBounds(
          {
            lat: Math.min(...hardcodedLatLng.map(x => x.lat)),
            lng: Math.min(...hardcodedLatLng.map(x => x.lng)),
          },
          {
            lat: Math.max(...hardcodedLatLng.map(x => x.lat)),
            lng: Math.max(...hardcodedLatLng.map(x => x.lng)),
          }
        )
      );
    }, 300);
  }, [hardcodedLatLng, map]);
  return (
    <div>
      {hardcodedLatLng.map((x, index) => (
        <Marker position={x} key={index} />
      ))}
    </div>
  );
};
const MyMarker = ({
  position,
  setPosition,
}: {
  position: { lat: number; lng: number };
  setPosition: (pos: { lat: number; lng: number }) => void;
}) => {
  useMapEvent('click', event => {
    setPosition({ lat: event.latlng.lat, lng: event.latlng.lng });
  });

  return (
    <Marker position={position}>
      <Popup>You clicked that</Popup>
    </Marker>
  );
};
const GeoMap = ({ onNextPicture, pictureId }: { onNextPicture: () => void; pictureId: string }) => {
  const [guess, setGuess] = useState({ lat: 51.505, lng: -0.09 });
  const [guessComplete, setGuessComplete] = useState(false);

  const [createPictureGeoInfo] = useCreatePictureGeoInfoMutation();

  const nextPicture = () => {
    setGuessComplete(false);
    onNextPicture();
  };

  const sendGuess = () => {
    createPictureGeoInfo({
      variables: { data: { picture: pictureId, latitude: guess.lat, longitude: guess.lng } },
    });
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
        center={{ lat: 51.8392573, lng: 10.5279953 }}
        zoom={10}
        className='map'
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {guessComplete ? <PlayerMarkers /> : <MyMarker position={guess} setPosition={setGuess} />}
      </MapContainer>
      {!guessComplete && (
        <Button variant='contained' onClick={sendGuess}>
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
