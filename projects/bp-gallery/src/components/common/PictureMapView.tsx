import { ZoomInMapOutlined, ZoomOutMapOutlined } from '@mui/icons-material';
import { DivIcon, LatLng, Map, MarkerCluster, MarkerOptions, Point } from 'leaflet';
import myMarkerIcon from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { PictureOrigin, asUploadPath } from '../../helpers/app-helpers';
import { useVisit } from '../../helpers/history';
import { FlatPicture, FlatTag, Thumbnail } from '../../types/additionalFlatTypes';
import { useGetChildMatrix } from '../views/location-curating/tag-structure-helpers';

const PictureMapView = ({
  isMaximized,
  setIsMaximized,
  initialMapValues,
  locations,
  width,
  height,
  map,
}: {
  isMaximized: boolean;
  setIsMaximized: Dispatch<SetStateAction<boolean>>;
  initialMapValues: {
    center: LatLng;
    zoom: number;
  };
  locations:
    | (FlatTag & {
        thumbnail: Thumbnail[];
        pictures: FlatPicture[];
        verified_pictures: FlatPicture[];
      })[]
    | undefined;
  width: string;
  height: string;
  map: RefObject<Map>;
}) => {
  const { childMatrix } = useGetChildMatrix(locations);

  const getDividerIcon = (
    locationTags: (FlatTag & {
      thumbnail: Thumbnail[];
      pictures: FlatPicture[];
      verified_pictures: FlatPicture[];
    })[],
    clusterLocationCount?: number
  ) => {
    if (locationTags.length === 1) {
      const locationTag = locationTags[0];
      return new DivIcon({
        html: renderToStaticMarkup(
          <div className='flex relative'>
            <div className='w-[150px] h-[150px] overflow-hidden z-50 border-solid border-white border-2'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(locationTag.thumbnail[0].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='bg-white w-[150px] h-[150px] absolute bottom-2 left-1 z-10 border-solid border-white border-2'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(locationTag.thumbnail[0].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='bg-white w-[150px] h-[150px] absolute bottom-4 left-3 z-0 shadow-[5px_-5px_10px_10px_rgba(0,0,0,0.2)] border-solid border-white border-2'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(locationTag.thumbnail[0].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='absolute bottom-[112px] left-[166px] p-1 flex flex-col bg-white/50 whitespace-nowrap'>
              <h2 className='mb-0 ml-0 mt-[-5px] text-black'>{locationTag.name}</h2>
              <div className='ml-[2px] mt-[-4px] text-black'>{`${locationTag.pictures.length} Bilder`}</div>
              <div className='ml-[2px] mt-[-4px] text-black mb-auto'>
                {`${locationTag.child_tags?.length ?? 0} Unterorte`}
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
            <div className='w-[40px] h-[40px] absolute left-[202px] bottom-[52px]'>
              <img className='object-fit !w-full !h-full' src={markerShadow} />
            </div>
          </div>
        ),
        iconSize: new Point(150, 150),
        iconAnchor: new Point(215, 105),
      });
    } else {
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
            <div className='w-[150px] h-[150px] overflow-hidden z-50 border-solid border-white border-2 z-20'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(thumbnails[0 % thumbnails.length].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='bg-white w-[150px] h-[150px] absolute bottom-2 left-1 z-10 border-solid border-white border-2 z-20'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(thumbnails[1 % thumbnails.length].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='bg-white w-[150px] h-[150px] absolute bottom-4 left-3 z-0 shadow-[5px_-5px_10px_10px_rgba(0,0,0,0.2)] border-solid border-white border-2 z-20'>
              <img
                className='object-cover !w-full !h-full'
                src={asUploadPath(thumbnails[2 % thumbnails.length].media, {
                  highQuality: false,
                  pictureOrigin: PictureOrigin.REMOTE,
                })}
              />
            </div>
            <div className='absolute bottom-[112px] left-[166px] p-1 flex flex-col bg-white/50 whitespace-nowrap  z-20'>
              <h2 className='mb-0 ml-0 mt-[-5px] text-black'>{`${
                clusterLocationCount ?? 0
              } Orte`}</h2>
              <div className='ml-[2px] mt-[-4px] text-black'>{`${pictureCount} Bilder`}</div>
              <div className='ml-[2px] mt-[-4px] text-black mb-auto'>
                {`${subLocationCount} Unterorte`}
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
        iconSize: new Point(150, 150),
        iconAnchor: new Point(215, 105),
      });
    }
  };

  const MyMarker = ({
    position,
    locationTag,
  }: {
    position: LatLng;
    locationTag: FlatTag & {
      thumbnail: Thumbnail[];
      pictures: FlatPicture[];
      verified_pictures: FlatPicture[];
    };
  }) => {
    const { visit } = useVisit();
    const dividerIcon = getDividerIcon([locationTag]);

    const options = {
      icon: dividerIcon,
      position: position,
      eventHandlers: {
        click: (_: any) => {
          visit('/show-more/location/' + locationTag.id, { wasOpen: true });
        },
      },
      locationTag: locationTag,
    };

    return <Marker {...options}></Marker>;
  };

  const createClusterCustomIcon = (cluster: MarkerCluster) => {
    const tags = cluster.getAllChildMarkers().map(
      marker =>
        (
          marker.options as MarkerOptions & {
            locationTag?: FlatTag & {
              thumbnail: Thumbnail[];
              pictures: FlatPicture[];
              verified_pictures: FlatPicture[];
            };
          }
        ).locationTag
    );
    const tagsWithoutParents = tags.filter(tag => tag && !tag.parent_tags?.length);
    return tagsWithoutParents.length
      ? getDividerIcon(
          tagsWithoutParents as (FlatTag & {
            thumbnail: Thumbnail[];
            pictures: FlatPicture[];
            verified_pictures: FlatPicture[];
          })[],
          tags.length
        )
      : childMatrix &&
        tags.some(
          parent =>
            parent &&
            tags.every(
              child => child && (parent.id === child.id || childMatrix[child.id][parent.id])
            )
        )
      ? getDividerIcon(
          tags.filter(
            parent =>
              parent &&
              tags.every(
                child => child && (parent.id === child.id || childMatrix[child.id][parent.id])
              )
          ) as (FlatTag & {
            thumbnail: Thumbnail[];
            pictures: FlatPicture[];
            verified_pictures: FlatPicture[];
          })[],
          tags.length
        )
      : getDividerIcon(
          tags as (FlatTag & {
            thumbnail: Thumbnail[];
            pictures: FlatPicture[];
            verified_pictures: FlatPicture[];
          })[],
          tags.length
        );
  };

  return (
    <div className={`${width} ${height} z-0 relative`}>
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
          className='z-10'
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MarkerClusterGroup
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={200}
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
