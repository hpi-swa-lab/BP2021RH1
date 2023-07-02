import { Map } from 'leaflet';
import { useMemo, useRef, useState } from 'react';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import { useVisit } from '../../helpers/history';
import useGetTagsWithThumbnail, { NO_LIMIT } from '../../hooks/get-tags-with-thumbnail.hook';
import { TagType } from '../../types/additionalFlatTypes';
import { BAD_HARZBURG_COORDINATES } from '../views/location-curating/tag-structure-helpers';
import Loading from './Loading';
import PictureMapView, { ExtendedFlatTag } from './PictureMapView';
import QueryErrorDisplay from './QueryErrorDisplay';

const PictureMap = () => {
  const { location } = useVisit();

  const initialMapValues = useMemo(() => {
    return location.state?.mapState ?? { center: BAD_HARZBURG_COORDINATES, zoom: 10 };
  }, [location.state?.mapState]);

  const [isMaximized, setIsMaximized] = useState<boolean>(location.state?.open ?? false);
  const map = useRef<Map>(null);

  const { data, loading, error } = useGetTagsWithThumbnail(
    {},
    {},
    TagType.LOCATION,
    ['name:asc'],
    NO_LIMIT,
    'cache-first'
  );

  const flattened = useSimplifiedQueryResponseData(data);
  const flattenedTags: ExtendedFlatTag[] | undefined = flattened
    ? Object.values(flattened)[0]
    : undefined;

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
        widthStyle='w-full'
        heightStyle={isMaximized ? 'h-full' : 'h-[500px]'}
        map={map}
      />
    ),
    [flattenedTags, initialMapValues.center, initialMapValues.zoom, isMaximized]
  );

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
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
