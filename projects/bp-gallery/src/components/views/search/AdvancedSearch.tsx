import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionSummary, Button, MenuItem, Select, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllArchiveTagsQuery } from '../../../graphql/APIConnector';
import { useAuth } from '../../../hooks/context-hooks';
import { HelpTooltip } from '../../common/HelpTooltip';
import SearchBar from './SearchBar';
import SearchBreadcrumbs from './SearchBreadcrumbs';
import { SearchFilterInput } from './SearchFilterInput';

export type SingleFilterProps = {
  filterOperator: string;
  combinationOperator: string;
  values: string[];
};

export type AttributeFilterProps = { attribute: string; filterProps: SingleFilterProps[] };

export const AdvancedSearch = ({
  activeFilter,
  setFilter,
  searchIndex,
  setSearchIndex,
  searchParams,
  isAllSearchActive,
}: {
  activeFilter: string;
  setFilter: Dispatch<SetStateAction<string>>;
  searchIndex: string;
  setSearchIndex: Dispatch<SetStateAction<string>>;
  searchParams: URLSearchParams;
  isAllSearchActive: boolean;
}) => {
  const authContext = useAuth();
  const isLoggedIn = authContext.loggedIn;
  const { data } = useGetAllArchiveTagsQuery();
  const archiveTags = data?.archiveTags?.data
    ? data.archiveTags.data.map(tagData =>
        tagData.attributes?.name ? tagData.attributes.name : ''
      )
    : [''];

  const { t } = useTranslation();

  const ATTRIBUTES = [
    'keyword',
    'description',
    'person',
    'face-tag',
    'location',
    'archive',
    'timeRange',
  ];

  const emptyProps = ATTRIBUTES.map(attr => ({
    attribute: attr,
    filterProps: [{ filterOperator: '', combinationOperator: '', values: ['', ''] }],
  }));

  const [advancedSearchProps, SetAdvancedSearchProps] =
    useState<AttributeFilterProps[]>(emptyProps);

  const resetProps = useCallback(
    () => SetAdvancedSearchProps(currentProps => emptyProps),
    [emptyProps, SetAdvancedSearchProps]
  );

  const optionTranslator = useCallback((option: string) => {
    switch (option) {
      case 'equal':
        return ' = ';
      case 'unequal':
        return ' != ';
      case 'lower':
        return ' < ';
      case 'lower-equal':
        return ' <= ';
      case 'greater':
        return ' > ';
      case 'greater-equal':
        return ' >= ';
      case 'and':
        return ' AND ';
      case 'or':
        return ' OR ';
      default:
        return '';
    }
  }, []);

  const attributeTranslator = useCallback((attribute: string) => {
    switch (attribute) {
      case 'keyword':
        return 'keyword_tags';
      case 'description':
        return 'descriptions';
      case 'comment':
        return 'comments';
      case 'person':
        return 'person_tags';
      case 'face-tag':
        return 'face_tags';
      case 'location':
        return 'location_tags';
      case 'collection':
        return 'collections';
      case 'archive':
        return 'archive_tag';
      default:
        return '';
    }
  }, []);

  const startTimeParser = (startYear: string) => {
    return Date.parse(`${startYear}-01-01T00:00:00Z`) / 1000;
  };
  const endTimeparser = (endYear: string) => {
    return Date.parse(`${endYear}-12-31T23:59:59Z`) / 1000;
  };

  const buildSingleFilter = useCallback(
    (
      attribute: string,
      operatorOption: string,
      firstValue: string,
      secondValue: string,
      combinatorOption: string
    ) => {
      const TIME_START = 'time_range_tag_start';
      const TIME_END = 'time_range_tag_end';
      if (operatorOption === 'default' || operatorOption === '') {
        return '';
      } else if (operatorOption === 'is-empty') {
        return attribute !== 'timeRange'
          ? `(${attributeTranslator(attribute)} IS EMPTY OR ${attributeTranslator(
              attribute
            )} IS NULL)${optionTranslator(combinatorOption)}`
          : `((${TIME_START} IS EMPTY OR ${TIME_START} IS NULL) AND (${TIME_END} IS EMPTY OR ${TIME_END} IS NULL))${optionTranslator(
              combinatorOption
            )}`;
      } else if (operatorOption === 'is-not-empty') {
        return attribute !== 'timeRange'
          ? `(${attributeTranslator(attribute)} IS NOT EMPTY AND ${attributeTranslator(
              attribute
            )} IS NOT NULL)${optionTranslator(combinatorOption)}`
          : `(${TIME_START} IS NOT EMPTY AND ${TIME_START} IS NOT NULL AND ${TIME_END} IS NOT EMPTY AND ${TIME_END} IS NOT NULL)${optionTranslator(
              combinatorOption
            )}`;
      } else if (attribute === 'timeRange') {
        return operatorOption === 'span'
          ? `(${TIME_START} >= ${startTimeParser(firstValue)} AND ${TIME_END} <= ${endTimeparser(
              secondValue
            )})${optionTranslator(combinatorOption)}`
          : `(${TIME_START}${optionTranslator(operatorOption)}${startTimeParser(
              firstValue
            )} AND ${TIME_END}${optionTranslator(operatorOption)}${startTimeParser(
              firstValue
            )})${optionTranslator(combinatorOption)}`;
      } else {
        return `${attributeTranslator(attribute)}${optionTranslator(
          operatorOption
        )}'${firstValue}'${optionTranslator(combinatorOption)}`;
      }
    },
    [optionTranslator, attributeTranslator]
  );

  const buildAttributeFilter = useCallback(
    (attributeFilterProps: AttributeFilterProps) => {
      const filter = `${attributeFilterProps.filterProps.reduce(
        (accumulator, currentValue) =>
          `${accumulator}${buildSingleFilter(
            attributeFilterProps.attribute,
            currentValue.filterOperator,
            currentValue.values[0],
            currentValue.values[1],
            currentValue.combinationOperator
          )}`,
        ''
      )}`;
      return filter !== '' ? `(${filter})` : '';
    },
    [buildSingleFilter]
  );

  const filter: string = useMemo(() => {
    return advancedSearchProps
      .map(attributeFilterProps => buildAttributeFilter(attributeFilterProps))
      .reduce((accumulator, currentvalue) => {
        if (accumulator !== '' && currentvalue === '') {
          return accumulator;
        } else if (accumulator === '' && currentvalue !== '') {
          return currentvalue;
        } else if (accumulator !== '' && currentvalue !== '') {
          return `${accumulator} AND ${currentvalue}`;
        } else {
          return '';
        }
      }, '');
  }, [advancedSearchProps, buildAttributeFilter]);

  const searchIndices = ['picture', 'comment'];

  return (
    <div className='flex flex-col m-auto w-fit'>
      <div className='breadcrumb m-1'>
        <SearchBreadcrumbs searchParams={searchParams} />
      </div>
      <div className='flex flex-row'>
        <div className='search-bar-container shadow'>
          <SearchBar searchParams={searchParams} isAllSearchActive={isAllSearchActive} />
          <Accordion
            key={0}
            disableGutters={true}
            square={true}
            sx={{
              backgroundColor: '#e9e9e9',
              boxShadow: '0px -1px 0px rgba(0, 0, 0, 0.3)',
              width: 'fit-content',
            }}
          >
            <AccordionSummary expandIcon={<ExpandMore />}>
              <div className='flex flex-row flex-nowrap items-center'>
                <Typography fontWeight='bold'>{t('search.advanced-search-title')}</Typography>
                <HelpTooltip
                  title={t('search.advanced-question')}
                  content={t('search.advanced-help')}
                />
              </div>
            </AccordionSummary>
            <div className='advanced-search w-fit p-4 flex flex-col'>
              {
                <div className='flex flex-row flex-nowrap justify-start items-center'>
                  <Typography fontWeight={'bold'}>{t(`search.setIndex`)}</Typography>
                  <Select
                    value={searchIndex}
                    onChange={event => setSearchIndex(event.target.value)}
                  >
                    {searchIndices.map(searchIndex => (
                      <MenuItem key={searchIndex} value={searchIndex}>
                        {t(`search.${searchIndex}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              }
              {searchIndex === 'picture' ? (
                <>
                  <div className='advanced-search-filters flex flex-row flex-nowrap justify-evenly m-auto'>
                    <div className='advanced-left-filters flex flex-col flex-nowrap'>
                      {advancedSearchProps
                        .filter(props =>
                          ATTRIBUTES.slice(0, Math.round(ATTRIBUTES.length / 2)).includes(
                            props.attribute
                          )
                        )
                        .map((props, index) => (
                          <div
                            className={`flex flex-col flex-nowrap ${
                              !isLoggedIn &&
                              (props.attribute === 'description' || props.attribute === 'face-tag')
                                ? 'hidden'
                                : ''
                            }`}
                            key={props.attribute}
                          >
                            <SearchFilterInput
                              key={props.attribute}
                              filterIndex={index}
                              attribute={props.attribute}
                              advancedSearchProps={advancedSearchProps}
                              setAdvancedSearchProps={SetAdvancedSearchProps}
                              archiveTags={archiveTags}
                            ></SearchFilterInput>
                          </div>
                        ))}
                    </div>
                    <div className='advanced-right-filters flex flex-col flex-nowrap'>
                      {advancedSearchProps
                        .filter(props =>
                          ATTRIBUTES.slice(
                            Math.round(ATTRIBUTES.length / 2),
                            ATTRIBUTES.length
                          ).includes(props.attribute)
                        )
                        .map((props, index) => (
                          <div
                            className={`flex flex-col flex-nowrap ${
                              !isLoggedIn &&
                              (props.attribute === 'description' || props.attribute === 'face-tag')
                                ? 'hidden'
                                : ''
                            }`}
                            key={props.attribute}
                          >
                            <SearchFilterInput
                              key={props.attribute}
                              filterIndex={index}
                              attribute={props.attribute}
                              advancedSearchProps={advancedSearchProps}
                              setAdvancedSearchProps={SetAdvancedSearchProps}
                              archiveTags={archiveTags}
                            ></SearchFilterInput>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className='advanced-search-button-wrapper w-full flex flex-col flex-nowrap justifiy-start m-auto pt-4'>
                    {filter !== activeFilter ? (
                      <Typography>{t('search.filter-mismatch')}</Typography>
                    ) : (
                      <></>
                    )}
                    <div className='advanced-search-button flex flex-row w-fit justify-between'>
                      <Button
                        className='!m-1'
                        variant='contained'
                        onClick={() => {
                          setFilter(filter);
                        }}
                      >
                        {t('search.appy-filter')}
                      </Button>

                      <Button
                        className='!m-1'
                        variant='contained'
                        onClick={() => {
                          resetProps;
                          setFilter('');
                        }}
                      >
                        {t('search.reset-filter')}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          </Accordion>
        </div>
        <div className='help'>
          <HelpTooltip title={t('search.question')} content={t('search.help')} />
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
