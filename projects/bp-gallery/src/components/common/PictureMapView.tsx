import { ZoomInMapOutlined, ZoomOutMapOutlined } from '@mui/icons-material';
import { DivIcon, LatLng, Map, MarkerCluster, MarkerOptions, Point } from 'leaflet';
import myMarkerIcon from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { PictureOrigin, asUploadPath } from '../../helpers/app-helpers';
import { useVisit } from '../../helpers/history';
import { FlatPicture, FlatTag, Thumbnail } from '../../types/additionalFlatTypes';
import { useGetDescendantsMatrix } from '../views/location-curating/tag-structure-helpers';

export interface ExtendedFlatTag extends FlatTag {
  thumbnail: Thumbnail[];
  pictures: FlatPicture[];
  verified_pictures: FlatPicture[];
}

interface ExtendedMarkerOptions extends MarkerOptions {
  locationTag?: ExtendedFlatTag;
}

const getCommonSupertag = (
  tags: ExtendedFlatTag[],
  descendantsMatrix?: {
    [k: string]: {
      [k: string]: boolean;
    };
  }
) => {
  if (!tags.length || !descendantsMatrix) {
    return;
  }
  let potentialCommonSupertag = tags[0];
  for (const tag of tags) {
    if (descendantsMatrix[potentialCommonSupertag.id][tag.id]) {
      potentialCommonSupertag = tag;
    } else if (!descendantsMatrix[tag.id][potentialCommonSupertag.id]) {
      return;
    }
  }
  return potentialCommonSupertag;
};

const PictureMapView = ({
  isMaximized,
  setIsMaximized,
  initialMapValues,
  locations,
  widthStyle,
  heightStyle,
  map,
}: {
  isMaximized: boolean;
  setIsMaximized: Dispatch<SetStateAction<boolean>>;
  initialMapValues: {
    center: LatLng;
    zoom: number;
  };
  locations: ExtendedFlatTag[] | undefined;
  widthStyle: string;
  heightStyle: string;
  map: RefObject<Map>;
}) => {
  const { descendantsMatrix } = useGetDescendantsMatrix(locations);
  const { t } = useTranslation();

  const getDividerIcon = (locationTags: ExtendedFlatTag[], clusterLocationCount?: number) => {
    const locationTag = locationTags.length === 1 ? locationTags[0] : undefined;
    let pictureCount = 0;
    let subLocationCount = 0;
    const thumbnails = locationTags.map(tag => tag.thumbnail[0]);
    locationTags.forEach(tag => {
      pictureCount += tag.pictures.length;
      subLocationCount += tag.child_tags?.length ?? 0;
    });
    return new DivIcon({
      html: renderToStaticMarkup(
        <div className='flex relative'>
          {[
            'bottom-0 left-0 z-50',
            'bg-white bottom-2 left-2 z-40',
            'bg-white bottom-4 left-4 shadow-[5px_-5px_10px_10px_rgba(0,0,0,0.2)] z-30',
          ].map((extraClassNames, index) => (
            <div
              key={index}
              className={`w-[150px] h-[150px] absolute border-solid border-white border-2 ${extraClassNames}`}
            >
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(thumbnails[index % thumbnails.length].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
          ))}
          <div className='absolute bottom-[112px] left-[170px] p-1 flex flex-col bg-white/50 whitespace-nowrap z-20'>
            <h2 className='mb-0 ml-0 mt-[-5px] text-black'>
              {locationTag
                ? locationTag.name
                : t('map.locations', { count: clusterLocationCount ?? 0 })}
            </h2>
            <div className='ml-[2px] mt-[-4px] text-black'>
              {t('common.pictureCount', { count: pictureCount })}
            </div>
            <div className='ml-[2px] mt-[-4px] text-black mb-auto'>
              {t('map.sublocations', { count: subLocationCount })}
            </div>
          </div>
          {clusterLocationCount && clusterLocationCount > 1 ? (
            <div className='absolute left-[220px] bottom-[80px] z-20 bg-red-500 rounded-full'>
              <span className='px-1 py-1'>
                {clusterLocationCount > 99 ? '99+' : clusterLocationCount}
              </span>
            </div>
          ) : null}
          <div className='w-[25px] h-[40px] absolute left-[202px] bottom-[52px] z-10'>
            <img className='object-fit !w-full !h-full' src={myMarkerIcon} />
          </div>
          <div className='w-[40px] h-[40px] absolute left-[202px] bottom-[52px] z-0'>
            <img className='object-fit !w-full !h-full' src={markerShadow} />
          </div>
        </div>
      ),
      iconSize: new Point(0, 0),
      iconAnchor: new Point(214.5, -52),
    });
  };

  const MyMarker = ({
    position,
    locationTag,
  }: {
    position: LatLng;
    locationTag: ExtendedFlatTag;
  }) => {
    const { visit } = useVisit();
    const dividerIcon = getDividerIcon([locationTag]);

    const options = {
      icon: dividerIcon,
      position: position,
      eventHandlers: {
        click: (_: any) => {
          visit('/show-more/location/' + locationTag.id, {
            mapState: {
              center: map.current?.getCenter() ?? initialMapValues.center,
              zoom: map.current?.getZoom() ?? initialMapValues.zoom,
            },
            wasOpen: isMaximized,
          });
        },
      },
      locationTag: locationTag,
    };

    return <Marker {...options}></Marker>;
  };

  const createCustomClusterIcon = (cluster: MarkerCluster) => {
    const tags = cluster
      .getAllChildMarkers()
      .map(marker => (marker.options as ExtendedMarkerOptions).locationTag!);
    const tagsWithoutParents = tags.filter(tag => !tag.parent_tags?.length);
    if (tagsWithoutParents.length) {
      return getDividerIcon(tagsWithoutParents, tags.length);
    } else {
      const commonSupertag = getCommonSupertag(tags, descendantsMatrix);
      if (commonSupertag) {
        return getDividerIcon([commonSupertag], tags.length);
      } else {
        return getDividerIcon(tags, tags.length);
      }
    }
  };

  return (
    <div className={`${widthStyle} ${heightStyle} z-0 relative`}>
      <div
        className='w-fit p-2 absolute z-[999] right-2 top-4 cursor-pointer decoration-black bg-white border-solid flex justify-center border-gray-400'
        onClick={event => {
          event.stopPropagation();
          setIsMaximized(value => !value);
        }}
      >
        {isMaximized ? <ZoomInMapOutlined /> : <ZoomOutMapOutlined />}
      </div>
      <MapContainer
        center={initialMapValues.center}
        zoom={initialMapValues.zoom}
        className='map-container w-full h-full mb-1'
        scrollWheelZoom={true}
        ref={map}
      >
        <TileLayer
          maxZoom={22}
          maxNativeZoom={19}
          className='z-10'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MarkerClusterGroup
          iconCreateFunction={createCustomClusterIcon}
          maxClusterRadius={350}
          animate={true}
        >
          {locations?.map(location =>
            location.coordinates && location.thumbnail.length && location.thumbnail[0].media ? (
              <MyMarker
                key={location.id}
                position={new LatLng(location.coordinates.latitude, location.coordinates.longitude)}
                locationTag={location}
              />
            ) : null
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default PictureMapView;
