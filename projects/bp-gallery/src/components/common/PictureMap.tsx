import { LatLng, Map } from 'leaflet';
import { useMemo, useRef, useState } from 'react';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useVisit } from '../../helpers/history';
import useGetTagsWithThumbnail from '../../hooks/get-tags-with-thumbnail.hook';
import { FlatPicture, FlatTag, TagType, Thumbnail } from '../../types/additionalFlatTypes';
import Loading from './Loading';
import PictureMapView from './PictureMapView';

const PictureMap = () => {
  const { location } = useVisit();

  const initialMapValues = useMemo(() => {
    return location.state?.mapState ?? { center: new LatLng(51.8392573, 10.5279953), zoom: 10 };
  }, [location.state?.mapState]);

  const [isMaximized, setIsMaximized] = useState<boolean>(location.state?.open ?? false);
  const map = useRef<Map>(null);

  const { data, loading } = useGetTagsWithThumbnail(
    {},
    {},
    TagType.LOCATION,
    ['name:asc'],
    undefined,
    'cache-first',
    true
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags:
    | (FlatTag & {
        thumbnail: Thumbnail[];
        pictures: FlatPicture[];
        verified_pictures: FlatPicture[];
      })[]
    | undefined = flattened ? Object.values(flattened)[0] : undefined;

  const localMap = useMemo(
    () => (
      <PictureMapView
        isMaximized={isMaximized}
        setIsMaximized={setIsMaximized}
        initialMapValues={{
          center: map.current?.getCenter() ?? initialMapValues.center,
          zoom: map.current?.getZoom() ?? initialMapValues.zoom,
        }}
        locations={flattenedTags}
        width='w-full'
        height={isMaximized ? 'h-full' : 'h-[500px]'}
        map={map}
      />
    ),
    [flattenedTags, initialMapValues.center, initialMapValues.zoom, isMaximized]
  );

  if (loading) {
    return <Loading />;
  } else {
    return (
      <>
        {isMaximized ? (
          <div className='w-full h-full overflow-hidden fixed left-0 top-0 z-[999]'>{localMap}</div>
        ) : (
          localMap
        )}
      </>
    );
  }
};

export default PictureMap;
