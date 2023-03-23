import './leaflet.css';
import { MapContainer, TileLayer, useMapEvent, Marker, useMap } from 'react-leaflet';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import {
  GetPictureGeoInfoQuery,
  useCreatePictureGeoInfoMutation,
  useIncreaseNotAPlaceCountMutation,
} from '../../../graphql/APIConnector';
import { LatLngBounds, Icon } from 'leaflet';
import { useTranslation } from 'react-i18next';

const PlayerMarkers = ({
  allGuesses,
  myGuess,
}: {
  allGuesses: GetPictureGeoInfoQuery['pictureGeoInfos'];
  myGuess: { lat: number; lng: number };
}) => {
  const map = useMap();
  const coords = useMemo(
    () =>
      allGuesses?.data.map(x => ({
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
            lat: Math.min(...coords.map(x => x.lat), myGuess.lat),
            lng: Math.min(...coords.map(x => x.lng), myGuess.lng),
          },
          {
            lat: Math.max(...coords.map(x => x.lat), myGuess.lat),
            lng: Math.max(...coords.map(x => x.lng), myGuess.lng),
          }
        )
      );
    }, 300);
  }, [coords, myGuess, map]);
  const othersIcon = new Icon({
    iconUrl: '/images/location-map-pin.svg',
    iconSize: Icon.Default.prototype.options.iconSize,
    iconAnchor: Icon.Default.prototype.options.iconAnchor,
    popupAnchor: Icon.Default.prototype.options.popupAnchor,
    shadowUrl: 'images/marker-shadow.png',
    shadowSize: Icon.Default.prototype.options.shadowSize,
    shadowAnchor: Icon.Default.prototype.options.shadowAnchor,
  });
  return (
    <div>
      {coords.map((x, index) => (
        <Marker icon={othersIcon} position={x} key={index} />
      ))}
    </div>
  );
};
const MyMarker = ({
  position,
  isPositionable,
  setPosition,
}: {
  position: { lat: number; lng: number };
  isPositionable: boolean;
  setPosition: (pos: { lat: number; lng: number }) => void;
}) => {
  useMapEvent('click', event => {
    isPositionable && setPosition({ lat: event.latlng.lat, lng: event.latlng.lng });
  });

  return <Marker position={position} />;
};

// this is a dummy element to reset the map for every new picture
const SizeResetter = ({
  needsRepositioning,
  initialValues,
}: {
  needsRepositioning: boolean;
  initialValues: { center: { lat: number; lng: number }; zoom: number };
}) => {
  const map = useMap();
  useEffect(() => {
    if (needsRepositioning) {
      map.invalidateSize();
      map.flyTo(initialValues.center, initialValues.zoom);
    }
  }, [initialValues, needsRepositioning, map]);
  return <></>;
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
  const { t } = useTranslation();
  const initialMapValues = { center: { lat: 51.8392573, lng: 10.5279953 }, zoom: 10 };
  const initialGuess = { lat: 0, lng: 0 };
  const [needsRepositioning, setNeedsRepositioning] = useState(false);
  const [guess, setGuess] = useState(initialGuess);
  const [guessComplete, setGuessComplete] = useState(false);
  const [createPictureGeoInfo] = useCreatePictureGeoInfoMutation();
  const nextPicture = () => {
    setGuess(initialGuess);
    setGuessComplete(false);
    onNextPicture();
    setNeedsRepositioning(true);
    setInterval(() => setNeedsRepositioning(false), 300);
  };

  const sendGuess = () => {
    if (guess.lat === initialGuess.lat && guess.lng === initialGuess.lng) {
      alert(t('geo.explanation-reminder'));
      return;
    }
    createPictureGeoInfo({
      variables: {
        data: { picture: pictureId, latitude: guess.lat, longitude: guess.lng, radius: 0 },
      },
    });
    setGuessComplete(true);
  };

  const [IncreaseNotAPlaceCountMutation] = useIncreaseNotAPlaceCountMutation({
    variables: { pictureId: pictureId },
  });

  const sendNotAPlace = () => {
    IncreaseNotAPlaceCountMutation();
  };

  return (
    <div className={'map-container ' + (guessComplete ? 'guess-complete' : '')}>
      {guessComplete && (
        <div className='guess-complete-text'>
          <h2>{t('geo.tip')}</h2>
          <p>{t('geo.tip-sub')}</p>
        </div>
      )}
      <MapContainer
        center={initialMapValues.center}
        zoom={initialMapValues.zoom}
        className='map'
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {guessComplete && <PlayerMarkers allGuesses={allGuesses} myGuess={guess} />}
        <MyMarker position={guess} setPosition={setGuess} isPositionable={!guessComplete} />
        {needsRepositioning && (
          <SizeResetter needsRepositioning={needsRepositioning} initialValues={initialMapValues} />
        )}
      </MapContainer>
      {!guessComplete && (
        <div className='flex gap-2'>
          <Button variant='contained' onClick={sendGuess} className='flex-1'>
            {t('geo.submit-place')}
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setGuessComplete(true);
            }}
            className='flex-1'
          >
            {t('geo.dontKnow')}
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              sendNotAPlace();
              nextPicture();
            }}
            className='flex-1'
          >
            {t('geo.no-place')}
          </Button>
        </div>
      )}
      {guessComplete && (
        <Button variant='contained' onClick={nextPicture}>
          {t('geo.next-picture')}
        </Button>
      )}
    </div>
  );
};

export default GeoMap;
