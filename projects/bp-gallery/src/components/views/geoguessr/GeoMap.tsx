import { Button } from '@mui/material';
import { Icon, LatLng, Map, latLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, TileLayer, useMap, useMapEvent } from 'react-leaflet';
import {
  useCreatePictureGeoInfoMutation,
  useIncreaseNotAPlaceCountMutation,
} from '../../../graphql/APIConnector';
import { FlatPictureGeoInfo } from '../../../types/additionalFlatTypes';

const PlayerMarkers = ({
  allGuesses,
  myGuess,
}: {
  allGuesses: FlatPictureGeoInfo[];
  myGuess?: LatLng;
}) => {
  const map = useMap();
  const coords = useMemo(
    () => allGuesses.map(x => new LatLng(x.latitude!, x.longitude!)),
    [allGuesses]
  );

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
      const allCoords = myGuess ? [...coords, myGuess] : coords;
      coords.length !== 0 && map.flyToBounds(latLngBounds(allCoords));
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
  position: LatLng;
  isPositionable: boolean;
  setPosition: (pos: LatLng) => void;
}) => {
  useMapEvent('click', event => {
    isPositionable && setPosition(event.latlng.clone());
  });

  return <Marker position={position} />;
};

const GeoMap = ({
  onNextPicture,
  pictureId,
  allGuesses,
  needsExplanation,
}: {
  onNextPicture: () => void;
  pictureId: string;
  allGuesses: FlatPictureGeoInfo[];
  needsExplanation: () => void;
}) => {
  const { t } = useTranslation();
  const initialMapValues = useMemo(() => {
    return { center: new LatLng(51.8392573, 10.5279953), zoom: 10 };
  }, []);
  const initialGuess = new LatLng(0, 0);
  const map = useRef<Map>(null);
  const [guess, setGuess] = useState<LatLng>(initialGuess);
  const [guessComplete, setGuessComplete] = useState(false);
  const [unknown, setUnknown] = useState(false);
  const [createPictureGeoInfo] = useCreatePictureGeoInfoMutation();
  const nextPicture = () => {
    setGuess(initialGuess);
    setGuessComplete(false);
    setUnknown(false);
    onNextPicture();
  };

  const sendGuess = () => {
    if (guess.equals(initialGuess)) {
      needsExplanation();
      return;
    }
    createPictureGeoInfo({
      variables: {
        data: { picture: pictureId, latitude: guess.lat, longitude: guess.lng, radius: 0 },
      },
    });
    setGuessComplete(true);
  };

  useEffect(() => {
    if (!map.current) return;
    map.current.invalidateSize();
    map.current.flyTo(initialMapValues.center, initialMapValues.zoom);
  }, [pictureId, initialMapValues]);

  const [sendNotAPlace] = useIncreaseNotAPlaceCountMutation({
    variables: { pictureId: pictureId },
  });

  return (
    <div
      className={`fixed w-[480px] h-[360px] bottom-1 right-1 items-stretch flex flex-col transition-all
        ${guessComplete ? 'w-[80%] h-[80%] bottom-[10%] right-[10%]' : ''}`}
    >
      {guessComplete && (
        <div className='guess-complete-text self-center bg-white p-5 mb-2 text-center rounded-2xl w-[350px]'>
          <h2>{unknown ? t('geo.tip-unknown') : t('geo.tip')}</h2>
          <p>{t('geo.tip-sub')}</p>
        </div>
      )}
      <MapContainer
        center={initialMapValues.center}
        zoom={initialMapValues.zoom}
        className='map-container w-full h-full mb-1'
        scrollWheelZoom={true}
        ref={map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {guessComplete && (
          <PlayerMarkers allGuesses={allGuesses} myGuess={unknown ? undefined : guess} />
        )}
        {!unknown && (
          <MyMarker position={guess} setPosition={setGuess} isPositionable={!guessComplete} />
        )}
      </MapContainer>
      {!guessComplete && (
        <div className='flex gap-2'>
          <Button
            data-testid='submit-guess'
            variant='contained'
            onClick={sendGuess}
            className='flex-1'
          >
            {t('geo.submit-place')}
          </Button>
          <Button
            data-testid='dont-know'
            variant='contained'
            onClick={() => {
              setGuessComplete(true);
              setUnknown(true);
            }}
            className='flex-1'
          >
            {t('geo.dontKnow')}
          </Button>
          <Button
            data-testid='not-a-place'
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
        <Button data-testid='next-picture' variant='contained' onClick={nextPicture}>
          {t('geo.next-picture')}
        </Button>
      )}
    </div>
  );
};

export default GeoMap;