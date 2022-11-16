import { differenceWith, intersectionWith, isEqual, unionWith } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  PictureFiltersInput,
  useGetMultiplePictureInfoQuery,
  useUpdatePictureMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import ScrollContainer from '../../common/ScrollContainer';
import PictureInfo from '../picture/sidebar/picture-info/PictureInfo';
import './BulkEditView.scss';
import { History } from 'history';
import { PictureToolbar } from '../picture/overlay/PictureToolbar';
import { MutationResult } from '@apollo/client';

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

const computePictureDiff = (
  oldPicture: FlatPicture,
  newPicture: Partial<FlatPicture>
): PictureDiff => {
  // entries => fromEntries instead of literal object notation like in combinePictures
  // to only keep keys that are on newPicture
  return Object.fromEntries(
    Object.entries(newPicture).map(([key, newValues]) => {
      if (!(newValues instanceof Array)) {
        // just plainly overwrite values which aren't arrays
        return [key, newValues];
      }
      const oldValues = oldPicture[key as keyof FlatPicture];
      const diff = {
        added: differenceWith(newValues, oldValues, isEqual),
        removed: differenceWith(oldValues, newValues, isEqual),
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

// Component to keep track of multiple updateMutationResponses in parallel
// (useUpdatePictureMutation doesn't support that by itself and we can't call it
// in a loop, because it's a hook)
const UpdatePicture = ({
  pictureId,
  data,
  index,
  onResponseChange,
}: {
  pictureId: string;
  data: any;
  index: number;
  onResponseChange: (
    index: number,
    result: Pick<MutationResult<unknown>, 'loading' | 'error'>
  ) => void;
}) => {
  const [updatePicture, updateMutationResponse] = useUpdatePictureMutation({
    refetchQueries: ['getMultiplePictureInfo'],
  });

  useEffect(() => {
    updatePicture({
      variables: {
        pictureId,
        data,
      },
    });
  }, [updatePicture, pictureId, data]);

  useEffect(() => {
    onResponseChange(index, {
      loading: updateMutationResponse.loading,
      error: updateMutationResponse.error,
    });
  }, [onResponseChange, index, updateMutationResponse.loading, updateMutationResponse.error]);

  return null;
};

const BulkEditView = ({
  pictureIds,
  onBack,
}: {
  pictureIds: string[];
  onBack?: (pictureIds: string[]) => void;
}) => {
  const { t } = useTranslation();

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

  // setting this state triggers a an updatePicture call inside the UpdatePicture components rendered below
  const [updatedPictures, setUpdatedPictures] = useState<{ pictureId: string; data: any }[] | null>(
    null
  );
  const [combinedPicture, setCombinedPicture] = useState<FlatPicture | undefined>(undefined);

  // keep track of the responses from the updatePicture calls here to show a saveStatus
  const [updateMutationResponses, setUpdateMutationResponses] = useState<
    (Pick<MutationResult<unknown>, 'loading' | 'error'> | null)[] | null
  >(null);

  const onResponseChange = useCallback((index, newResult) => {
    setUpdateMutationResponses(
      updateMutationResponses =>
        updateMutationResponses?.map((oldResult, responseIndex) =>
          index === responseIndex ? newResult : oldResult
        ) ?? null
    );
  }, []);

  const saveStatus = useCallback(
    (anyFieldTouched: boolean) => {
      if (anyFieldTouched) {
        return t('curator.saveStatus.pending');
      }
      if (updateMutationResponses) {
        if (updateMutationResponses.some(result => result?.error)) {
          return t('curator.saveStatus.error');
        }
        const readyCount = updateMutationResponses.reduce(
          (count, result) => (result?.loading ? count : count + 1),
          0
        );
        if (readyCount < pictures!.length) {
          return (
            t('curator.saveStatus.saving') + ` (${readyCount}/${updateMutationResponses.length})`
          );
        }
      }
      return t('curator.saveStatus.saved') + (pictures ? ` (${pictures.length})` : '');
    },
    [t, updateMutationResponses, pictures]
  );

  console.log(combinedPicture);

  if (error) {
    return <QueryErrorDisplay error={error} />;
  } else if (loading) {
    return <Loading />;
  } else if (pictures) {
    if (!combinedPicture) setCombinedPicture(combinePictures(pictures));
    if (!combinedPicture) return <></>;
    const onSave = (field: Partial<FlatPicture>) => {
      const diff = computePictureDiff(combinedPicture, field);
      setCombinedPicture({ ...combinedPicture, ...field });
      setUpdatedPictures(
        pictures.map(picture => {
          const applied = applyPictureDiff(picture, diff);
          return {
            pictureId: picture.id,
            data: applied,
          };
        })
      );
      // there are no responses at first, they will be populated by the onResponseChange callbacks below
      setUpdateMutationResponses(pictures.map(_ => null));
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
            loading={
              updateMutationResponses
                ? updateMutationResponses.some(result => result?.loading)
                : false
            }
            topInfo={anyFieldTouched => (
              <div className='curator-ops'>
                <span className='save-state'>{saveStatus(anyFieldTouched)}</span>
              </div>
            )}
          />
        </div>
        {updatedPictures?.map((updatedPicture, index) => (
          <UpdatePicture
            key={updatedPicture.pictureId}
            {...updatedPicture}
            index={index}
            onResponseChange={onResponseChange}
          />
        ))}
      </div>
    );
  } else {
    return <div> {t('common.no-picture')} </div>;
  }
};

export default BulkEditView;
