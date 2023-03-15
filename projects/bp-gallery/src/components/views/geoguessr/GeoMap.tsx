import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup } from 'react-leaflet';
import { useState } from 'react';
import { Button } from '@mui/material';
import {
  GetPictureGeoInfoQuery,
  useCreatePictureGeoInfoMutation,
} from '../../../graphql/APIConnector';

const LocationMarker = ({
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
const GeoMap = ({
  onNextPicture,
  pictureId,
  allGuesses,
}: {
  onNextPicture: () => void;
  pictureId: string;
  allGuesses: GetPictureGeoInfoQuery['data'];
}) => {
  const [guess, setGuess] = useState({ lat: 51.505, lng: -0.09 });
  const [guessComplete, setGuessComplete] = useState(false);

  const [createPictureGeoInfo] = useCreatePictureGeoInfoMutation();

  const nextPicture = () => {
    setGuessComplete(false);
    onNextPicture();
  };

  const sendGuess = () => {
    createPictureGeoInfo({
      variables: {
        data: { picture: pictureId, latitude: guess.lat, longitude: guess.lng, radius: 0 },
      },
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
        <LocationMarker position={guess} setPosition={setGuess} />
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
