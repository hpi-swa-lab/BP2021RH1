import { differenceWith, intersectionWith, isEqual, unionWith } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect, useHistory } from 'react-router-dom';
import {
  PictureFiltersInput,
  useBulkEditMutation,
  useGetMultiplePictureInfoQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import PictureInfo, { Field } from '../picture/sidebar/picture-info/PictureInfo';
import './BulkEditView.scss';
import { History } from 'history';
import { PictureToolbar } from '../picture/overlay/PictureToolbar';
import { AuthRole, useAuth } from '../../provider/AuthProvider';
import { FALLBACK_PATH } from '../../routes';

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

type PictureDiff = {
  [K in keyof FlatPicture]?: FlatPicture[K] extends (infer T)[] | undefined
    ? {
        added: T[];
        removed: T[];
      }
    : FlatPicture[K];
};

const computePictureDiff = (oldPicture: Field, newPicture: Field): PictureDiff => {
  // entries => fromEntries instead of literal object notation like in combinePictures
  // to only keep keys that are on newPicture
  return Object.fromEntries(
    Object.entries(newPicture).map(([key, newValues]) => {
      if (!(newValues instanceof Array)) {
        // just plainly overwrite values which aren't arrays
        return [key, newValues];
      }
      type Element = typeof newValues[number];
      const oldValues = oldPicture[key as keyof Field] as Field[keyof Field] & Array<any>;
      const diff = {
        added: differenceWith<Element, Element>(newValues, oldValues, isEqual),
        removed: differenceWith<Element, Element>(oldValues, newValues, isEqual),
      };
      return [key, diff];
    })
  );
};

const applyPictureDiff = (picture: FlatPicture, diff: PictureDiff): Partial<FlatPicture> => {
  return Object.fromEntries(
    Object.entries(diff).map(([key, diff]) => {
      const value = picture[key as keyof FlatPicture];
      if (!(value instanceof Array)) {
        // this is not a diff, just the new value (see computePictureDiff)
        return [key, diff];
      }
      const { added, removed } = diff;
      const applied = unionWith(differenceWith(value, removed, isEqual), added, isEqual);
      return [key, applied];
    })
  );
};

const BulkEditView = ({
  pictureIds,
  onBack,
}: {
  pictureIds: string[];
  onBack?: (pictureIds: string[]) => void;
}) => {
  const { t } = useTranslation();
  const { role, loading: authLoading } = useAuth();

  const history: History = useHistory();

  const { data, loading, error, refetch } = useGetMultiplePictureInfoQuery({
    variables: {
      pictureIds,
    },
  });

  useEffect(() => {
    const unblock = history.block(() => {
      if (onBack) {
        refetch();
        onBack(pictureIds);
      }
    });
    return () => {
      unblock();
    };
  }, [history, pictureIds, onBack, refetch]);

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(data)?.pictures;

  const [bulkEdit, bulkEditResponse] = useBulkEditMutation({
    refetchQueries: ['getPictureInfo', 'getMultiplePictureInfo'],
  });
  const save = useCallback(
    (diff: PictureDiff) => {
      bulkEdit({
        variables: {
          pictureIds,
          data: diff,
        },
      });
    },
    [bulkEdit, pictureIds]
  );

  const saveStatus = useCallback(
    anyFieldTouched => {
      if (anyFieldTouched) {
        return t('curator.saveStatus.pending');
      }
      if (bulkEditResponse.loading) {
        return t('curator.saveStatus.saving');
      }
      if (bulkEditResponse.error) {
        return t('curator.saveStatus.error');
      }
      return t('curator.saveStatus.saved');
    },
    [bulkEditResponse, t]
  );

  if (role < AuthRole.CURATOR) {
    // protect from unauthorized access (e. g. people manually entering the bulk edit url)
    console.log('authLoading', authLoading);
    if (authLoading) {
      console.log('checking thing');
      return <>Checking authorization...</>;
    } else {
      console.log('redirecting');
      return <Redirect to={FALLBACK_PATH} />;
    }
  }

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (pictures) {
    const combinedPicture = combinePictures(pictures);
    const onSave = (field: Field) => {
      const combinedPictureAsField = {
        ...combinedPicture,
        archive_tag: combinedPicture.archive_tag?.id,
      };
      const diff = computePictureDiff(combinedPictureAsField, field);
      save(diff);
    };
    return (
      <div className='bulk-edit'>
        <div className='bulk-edit-grid-wrapper'>
          <div className='grid-ui'>
            <PictureToolbar calledViaLink={!onBack} />
          </div>
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
        </div>
        <div className='bulk-edit-picture-info'>
          <PictureInfo
            picture={combinedPicture}
            onSave={onSave}
            topInfo={anyFieldTouched => (
              <div className='curator-ops'>
                <span className='save-state'>{saveStatus(anyFieldTouched)}</span>
              </div>
            )}
          />
        </div>
      </div>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default BulkEditView;
