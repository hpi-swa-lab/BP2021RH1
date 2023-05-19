import { History } from 'history';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  PictureFiltersInput,
  useBulkEditMutation,
  useGetMultiplePictureInfoQuery,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { useCanUseBulkEditView } from '../../../hooks/can-do-hooks';
import { FlatPicture } from '../../../types/additionalFlatTypes';
import Loading from '../../common/Loading';
import ProtectedRoute from '../../common/ProtectedRoute';
import QueryErrorDisplay from '../../common/QueryErrorDisplay';
import PictureScrollGrid from '../../common/picture-gallery/PictureScrollGrid';
import { HideStats } from '../../provider/ShowStatsProvider';
import { PictureToolbar } from '../picture/overlay/PictureToolbar';
import PictureInfo, { Field } from '../picture/sidebar/picture-info/PictureInfo';
import './BulkEditView.scss';
import { PictureDiff, combinePictures, computePictureDiff } from './helpers/diffing';

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
  onSave,
}: {
  pictureIds: string[];
  onBack?: (pictureIds: string[]) => void;
  onSave?: (diff: PictureDiff) => void;
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
    refetchQueries: ['getPictureInfo', 'getMultiplePictureInfo', 'getPictures'],
    awaitRefetchQueries: true,
  });
  const save = useCallback(
    (diff: PictureDiff) => {
      bulkEdit({
        variables: {
          pictureIds,
          data: diff,
        },
      });
      onSave?.(diff);
    },
    [bulkEdit, pictureIds, onSave]
  );

  const saveStatus = useCallback(
    (anyFieldTouched: boolean, isSaving: boolean) => {
      if (anyFieldTouched) {
        return t('curator.saveStatus.pending');
      }
      if (bulkEditResponse.loading || isSaving) {
        return t('curator.saveStatus.saving');
      }
      if (bulkEditResponse.error) {
        return t('curator.saveStatus.error');
      }
      return t('curator.saveStatus.saved');
    },
    [bulkEditResponse, t]
  );

  const { canUseBulkEditView, loading: canUseBulkEditViewLoading } =
    useCanUseBulkEditView(pictureIds);

  return (
    <ProtectedRoute canUse={canUseBulkEditView} canUseLoading={canUseBulkEditViewLoading}>
      {() => {
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
          const hasHiddenLinks =
            (combinedPicture.linked_pictures?.length ?? 0) === 0 &&
            (combinedPicture.linked_texts?.length ?? 0) === 0 &&
            pictures.some(
              picture =>
                (picture.linked_pictures?.length ?? 0) > 0 ||
                (picture.linked_texts?.length ?? 0) > 0
            );
          return (
            <div className='bulk-edit'>
              <div className='bulk-edit-grid-wrapper'>
                <div className='grid-ui'>
                  <PictureToolbar calledViaLink={!onBack} />
                </div>
                <div className='bulk-edit-picture-grid'>
                  <HideStats>
                    <PictureScrollGrid
                      queryParams={getPictureFilters(pictureIds)}
                      hashbase={'A'}
                      showDefaultAdornments={false}
                      allowClicks={false}
                    />
                  </HideStats>
                </div>
              </div>
              <div className='bulk-edit-picture-info'>
                <PictureInfo
                  picture={combinedPicture}
                  pictureIds={pictureIds}
                  hasHiddenLinks={hasHiddenLinks}
                  onSave={onSave}
                  topInfo={(anyFieldTouched, isSaving) => (
                    <div className='curator-ops'>
                      <span className='save-state'>{saveStatus(anyFieldTouched, isSaving)}</span>
                    </div>
                  )}
                />
              </div>
            </div>
          );
        } else {
          return <div> {t('common.no-picture')} </div>;
        }
      }}
    </ProtectedRoute>
  );
};

export default BulkEditView;
