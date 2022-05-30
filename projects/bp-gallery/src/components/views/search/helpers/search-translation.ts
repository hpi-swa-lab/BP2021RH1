export const getSearchTypeTranslation = (searchType: string) => {
  return `search.${searchType}`;
};

export const getDecadeTranslation = (t: (key: string) => string, decadeIdentifier: string) => {
  return decadeIdentifier === '4' ? t('common.past') : `${decadeIdentifier}${t('common.0s')}`;
};
