import React, { useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import './SearchView.scss';
import SearchHub from './SearchHub';
import PictureScrollGrid from '../common/PictureScrollGrid';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Picture } from '../../../graphql/APIConnector';
import { apiBase } from '../../../App';

const SearchView = ({
  params,
  scrollPos,
  scrollHeight,
}: {
  params?: string[];
  scrollPos: number;
  scrollHeight: number;
}) => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search as string), [search]);

  const [previewPicture, setPreviewPicture] = useState<Picture>();

  const decade = parseInt(queryParams.get('decade') ?? '-1');

  const queryObject: { [key: string]: any } = {};
  if (params && params.length !== 0) {
    queryObject['descriptions'] = { text_contains: params[params.length - 1] };
  }

  if (decade && decade !== -1) {
    const startTime = new Date(`19${decade / 10}0-01-01`);
    const endTime = new Date(`19${decade / 10}9-12-31`);
    queryObject['time_range_tag'] = {
      start_gte: dayjs(startTime).format('YYYY-MM-DDTHH:mm'),
      end_lte: dayjs(endTime).format('YYYY-MM-DDTHH:mm'),
    };
  }

  return (
    <div className='search-view'>
      {((params && params.length > 0) || (decade && decade !== -1)) && (
        <div className='search-result-banner'>
          <div className='search-result-banner-background'>
            <img
              style={{ transform: `translateY(${scrollPos * 0.5}px)` }}
              src={`${apiBase}${String(previewPicture?.media?.formats.large.url ?? '')}`}
              alt={`${t('common.titleFor', {
                query: `${params?.join(',') ?? ''}, ${String(decade)}`,
              })}`}
            />
          </div>
          <div className='search-result-breadcrumbs'>
            {params?.map((crumb: string) => {
              return (
                <div key={crumb} className='breadcrumb'>
                  {crumb}
                </div>
              );
            })}
            {decade && decade !== -1 && (
              <div key={decade} className='breadcrumb decade'>
                {`${decade}er`}
              </div>
            )}
          </div>
        </div>
      )}
      <div className='search-content'>
        <div className='below-search-bar'>
          <SearchBar value={params?.length ? params[0] : undefined} />
          {(!params || params.length === 0) && (!decade || decade === -1) ? (
            <SearchHub />
          ) : (
            <PictureScrollGrid
              where={queryObject}
              scrollPos={scrollPos}
              scrollHeight={scrollHeight}
              hashbase={
                params ? params[params.length - 1] : String(queryParams.get('decade') ?? '')
              }
              previewPictureCallback={(pic: Picture) => {
                if (pic !== previewPicture) {
                  setPreviewPicture(pic);
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchView;
