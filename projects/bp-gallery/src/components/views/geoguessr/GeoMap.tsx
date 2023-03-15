import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import {
  GetPictureGeoInfoQuery,
  useCreatePictureGeoInfoMutation,
} from '../../../graphql/APIConnector';
import { LatLngBounds } from 'leaflet';

const PlayerMarkers = ({
  allGuesses,
}: {
  allGuesses: GetPictureGeoInfoQuery['pictureGeoInfos'];
}) => {
  const map = useMap();
  const coords = useMemo(
    () =>
      allGuesses?.data?.map(x => ({
        lat: x.attributes!.latitude!,
        lng: x.attributes!.longitude!,
      })) ?? [],
    [allGuesses]
  ) as { lat: number; lng: number }[];

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      map.flyToBounds(
        new LatLngBounds(
          {
            lat: Math.min(...coords.map(x => x.lat)),
            lng: Math.min(...coords.map(x => x.lng)),
          },
          {
            lat: Math.max(...coords.map(x => x.lat)),
            lng: Math.max(...coords.map(x => x.lng)),
          }
        )
      );
    }, 300);
  }, [coords, map]);
  return (
    <div>
      {coords.map((x, index) => (
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
const GeoMap = ({
  onNextPicture,
  pictureId,
  allGuesses,
}: {
  onNextPicture: () => void;
  pictureId: string;
  allGuesses: GetPictureGeoInfoQuery['pictureGeoInfos'];
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
        {guessComplete && <PlayerMarkers allGuesses={allGuesses} />}
        <MyMarker position={guess} setPosition={setGuess} />
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
