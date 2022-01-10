import React from 'react';
import { Picture } from '../../../graphql/APIConnector';
import { asApiPath } from '../../../App';
import { useTranslation } from 'react-i18next';
import './SearchResultBanner.scss';
import { SearchParam } from './SearchView';

const SearchResultBanner = ({
  scrollPos,
  searchParams,
  previewPicture,
}: {
  scrollPos: number;
  searchParams: SearchParam[];
  previewPicture: Picture;
}) => {
  const { t } = useTranslation();

  return (
    <div className='search-result-banner'>
      <div className='search-result-banner-background'>
        <img
          style={{ transform: `translateY(${scrollPos * 0.5}px)` }}
          src={asApiPath(String(previewPicture.media?.formats.large.url ?? ''))}
          alt={`${t('common.titleFor', {
            query: `${searchParams.map(param => param.value).join(',')}`,
          })}`}
        />
      </div>
      <div className='search-result-breadcrumbs'>
        {searchParams.map((param: SearchParam) => {
          return (
            <div key={param.value} className='breadcrumb'>
              {param.value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultBanner;
