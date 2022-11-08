import { intersectionWith, isEqual } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PictureFiltersInput, useGetMultiplePictureInfoQuery } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import PictureInfo from '../picture/sidebar/picture-info/PictureInfo';
import './BulkEditView.scss';

const getPictureFilters = (pictures: string[]) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    id: {
      in: pictures,
    },
  });

  return filters;
};

const combineToSingle = <T,>(
  pictures: FlatPicture[],
  selector: (picture: FlatPicture) => T
): T | undefined => {
  const properties = pictures.map(selector);
  if (properties.length === 0) {
    return undefined;
  }
  if (properties.every(property => isEqual(property, properties[0]))) {
    return properties[0];
  } else {
    return undefined;
  }
};

const combineToIntersection = <T,>(
  pictures: FlatPicture[],
  selector: (picture: FlatPicture) => T[] | undefined
): T[] => {
  const properties = pictures.map(selector).filter(array => array !== undefined);
  return intersectionWith(...properties, isEqual);
};

const combinePictures = (pictures: FlatPicture[]): FlatPicture => {
  return {
    id: pictures.map(picture => picture.id).join(','),
    archive_tag: combineToSingle(pictures, picture => picture.archive_tag),
    collections: combineToIntersection(pictures, picture => picture.collections),
    comments: combineToIntersection(pictures, picture => picture.comments),
    descriptions: combineToIntersection(pictures, picture => picture.descriptions),
    keyword_tags: combineToIntersection(pictures, picture => picture.keyword_tags),
    location_tags: combineToIntersection(pictures, picture => picture.location_tags),
    person_tags: combineToIntersection(pictures, picture => picture.person_tags),
    time_range_tag: combineToSingle(pictures, picture => picture.time_range_tag),
  };
};

const BulkEditView = ({ pictureIds }: { pictureIds: string[] }) => {
  const { t } = useTranslation();

  const { data, loading, error } = useGetMultiplePictureInfoQuery({
    variables: {
      pictureIds,
    },
  });

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (pictures) {
    const combinedPicture = combinePictures(pictures);
    return (
      <div className='bulk-edit'>
        <div className='bulk-edit-picture-grid'>
          <ScrollContainer>
            {(scrollPos: number, scrollHeight: number) => (
              <PictureScrollGrid
                queryParams={getPictureFilters(pictureIds)}
                scrollPos={scrollPos}
                scrollHeight={scrollHeight}
                hashbase={'yippie'}
                viewOnly
              />
            )}
          </ScrollContainer>
        </div>

        <div className='bulk-edit-picture-info'>
          <PictureInfo picture={combinedPicture} onSave={() => {}} />
        </div>
      </div>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default BulkEditView;
