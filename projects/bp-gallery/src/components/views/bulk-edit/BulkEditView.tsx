import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
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
import { combinePictures, computePictureDiff, PictureDiff } from './helpers/diffing';

const getPictureFilters = (pictures: string[]) => {
  const filters: PictureFiltersInput = { and: [] };

  filters.and?.push({
    id: {
      in: pictures,
    },
  });

  return filters;
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
                  hashbase={'A'}
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