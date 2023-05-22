import React, { MouseEventHandler, useMemo } from 'react';
import './PictureOverview.scss';
import PictureGrid from './picture-gallery/PictureGrid';
import { PictureFiltersInput } from '../../graphql/APIConnector';
import { FlatPicture, PictureOverviewType } from '../../types/additionalFlatTypes';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';
import { useSimplifiedQueryResponseData } from '../../graphql/queryUtils';
import useGenericPictureEndpoints from '../../hooks/generic-picture-endpoints';
import { AuthRole, useAuth } from '../provider/AuthProvider';

interface PictureOverviewProps {
  title?: string;
  queryParams: PictureFiltersInput | { searchTerms: string[]; searchTimes: string[][] };
  onClick: MouseEventHandler<HTMLButtonElement>;
  sortBy?: string[];
  rows?: number;
  type?: PictureOverviewType;
}

const ABSOLUTE_MAX_PICTURES_PER_ROW = 6;

const PictureOverview = ({
  title,
  queryParams,
  onClick,
  sortBy,
  rows = 2,
  type = PictureOverviewType.CUSTOM,
}: PictureOverviewProps) => {
  const { t } = useTranslation();
  const { role } = useAuth();

  const { getPicturesQuery } = useGenericPictureEndpoints(type);

  const textFilter = useMemo(() => {
    return role < AuthRole.CURATOR
      ? {
          and: [
            {
              or: [
                {
                  is_text: {
                    eq: false,
                  },
                },
                {
                  is_text: {
                    null: true,
                  },
                },
              ],
            },
            {} as PictureFiltersInput,
            queryParams as PictureFiltersInput,
          ],
        }
      : queryParams;
  }, [queryParams, role]);

  const { data, loading, refetch } = getPicturesQuery({
    variables: {
      filters: textFilter as PictureFiltersInput,
      pagination: {
        start: 0,
        limit: ABSOLUTE_MAX_PICTURES_PER_ROW * rows,
      },
      sortBy,
    },
    fetchPolicy: 'network-only',
  });

  const pictures: FlatPicture[] | undefined = useSimplifiedQueryResponseData(
    data as { [key: string]: any } | undefined
  )?.pictures;

  return (
    <div className='overview-container'>
      {title && <h2 className='overview-title'>{title}</h2>}
      {pictures && (
        <div className='overview-picture-grid-container'>
          <PictureGrid
            pictures={pictures}
            hashBase={'overview'}
            loading={loading}
            refetch={refetch}
            showDefaultAdornments={false}
            rows={rows}
          />
        </div>
      )}
      <PrimaryButton onClickFn={onClick} isShowMore={true}>
        {t('common.showMore')}
      </PrimaryButton>
    </div>
  );
};

export default PictureOverview;
