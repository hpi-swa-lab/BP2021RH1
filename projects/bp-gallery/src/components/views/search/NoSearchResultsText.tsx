import { useTranslation } from 'react-i18next';
import { SearchType } from './helpers/search-filters';
import { getDecadeTranslation, getSearchTypeTranslation } from './helpers/search-translation';

const quoteAll = (s: string[]) => {
  return s.map(str => `"${decodeURIComponent(str)}"`);
};

const NoSearchResultsText = ({ searchParams }: { searchParams: URLSearchParams }) => {
  const { t } = useTranslation();
  let params: string[];
  const infoTextParts: string[] = [];

  const enumerate = (params: string[]) => {
    let enumeration = ' ';
    switch (params.length) {
      case 0:
        return '';
      case 1:
        return params[0];
      case 2:
        return `${params[0]} ${t('common.and-alternative')} ${params[1]}`;
      default:
        for (let i = 0; i < params.length - 1; i++) {
          enumeration += params[i];
          if (i < params.length - 2) {
            enumeration += ', ';
          }
        }
        enumeration += ` ${t('common.and')} ${params[params.length - 1]}`;
        return enumeration;
    }
  };

  for (const searchType of Object.values(SearchType)) {
    params = searchParams.getAll(searchType);
    if (params.length === 0) continue;

    if (searchType === SearchType.DECADE) {
      params = params.map(decadeParam => getDecadeTranslation(t, decadeParam));
    }

    const enumeratedParams = enumerate(quoteAll(params));
    const searchTypeTranslation =
      searchType === 'all' ? '' : ' in ' + t(getSearchTypeTranslation(searchType));

    infoTextParts.push(`${t('search.for')} ${enumeratedParams} ${searchTypeTranslation}`);
  }

  const infoText = t('search.no-results-info', {
    searchQueryText:
      infoTextParts.length > 1 ? t('search.searchQueryPlural') : t('search.searchQuerySingular'),
    paramEnumeration: enumerate(infoTextParts),
  });

  return <>{infoText}</>;
};

export default NoSearchResultsText;
