import { Button } from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { SearchFilterInput } from './SearchFilterInput';

export type SingleFilterProps = {
  filterOperator: string;
  combinationOperator: string;
  values: string[];
};

export type AttributeFilterProps = { attribute: string; filterProps: SingleFilterProps[] };

export const AdvancedSearch = ({ setFilter }: { setFilter: Dispatch<SetStateAction<string>> }) => {
  const ATTRIBUTES = [
    'keyword',
    'description',
    'comment',
    'person',
    'face-tag',
    'location',
    'collection',
    'archive',
    'timeRange',
  ];

  const [advancedSearchProps, SetAdvancedSearchProps] = useState<AttributeFilterProps[]>(
    ATTRIBUTES.map(attr => ({
      attribute: attr,
      filterProps: [{ filterOperator: '', combinationOperator: '', values: ['', ''] }],
    }))
  );

  const optionTranslator = useCallback((option: string) => {
    switch (option) {
      case 'equal':
        return '=';
      case 'unequal':
        return '!=';
      case 'lower':
        return '<';
      case 'lower-equal':
        return '<=';
      case 'greater':
        return '>';
      case 'greater-equal':
        return '>=';
      case 'and':
        return 'AND';
      case 'or':
        return 'OR';
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
            )} IS NULL) ${optionTranslator(combinatorOption)} `
          : `((${TIME_START} IS EMPTY OR ${TIME_START} IS NULL) AND (${TIME_END} IS EMPTY OR ${TIME_END} IS NULL)) ${optionTranslator(
              combinatorOption
            )} `;
      } else if (operatorOption === 'is-not-empty') {
        return attribute !== 'timeRange'
          ? `(${attributeTranslator(attribute)} IS NOT EMPTY AND ${attributeTranslator(
              attribute
            )} IS NOT NULL) ${optionTranslator(combinatorOption)} `
          : `(${TIME_START} IS NOT EMPTY AND ${TIME_START} IS NOT NULL AND ${TIME_END} IS NOT EMPTY AND ${TIME_END} IS NOT NULL) ${optionTranslator(
              combinatorOption
            )} `;
      } else if (attribute === 'timeRange') {
        return operatorOption === 'span'
          ? `(${TIME_START} >= ${startTimeParser(firstValue)} AND ${TIME_END} <= ${endTimeparser(
              secondValue
            )}) ${optionTranslator(combinatorOption)} `
          : `(${TIME_START} ${optionTranslator(operatorOption)} ${startTimeParser(
              firstValue
            )} AND ${TIME_END} ${optionTranslator(operatorOption)} ${startTimeParser(
              firstValue
            )}) ${optionTranslator(combinatorOption)} `;
      } else {
        return `${attributeTranslator(attribute)} ${optionTranslator(
          operatorOption
        )} ${firstValue} ${optionTranslator(combinatorOption)} `;
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

  const filter: string = advancedSearchProps
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

  return (
    <div className='advanced-search'>
      <div className='advanced-search-content'>
        {advancedSearchProps.map(props => (
          <SearchFilterInput
            key={props.attribute}
            attribute={props.attribute}
            advancedSearchProps={advancedSearchProps}
            setAdvancedSearchProps={SetAdvancedSearchProps}
          ></SearchFilterInput>
        ))}
      </div>
      <Button
        onClick={() => {
          setFilter(filter);
          console.log(advancedSearchProps);
        }}
      >
        Filter Anwenden
      </Button>
    </div>
  );
};

export default AdvancedSearch;
