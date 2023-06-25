import { MenuItem, Select, TextField } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type SearchFilters = {
  keywordFilters: string[];
  descriptionFilters: string[];
  commentFilters: string[];
  personFilters: string[];
  faceTagFilters: string[];
  locationFilters: string[];
  collectionFilters: string[];
  archiveFilters: string[];
  timeRangeFilters: string[];
};

type FilterProps = {
  attribute: string;
  operatorOption: string;
  firstValue: string;
  secondValue: string;
  combinatorOption: string;
};

const SearchFilterInput = ({ key, attribute }: { key: string; attribute: string }) => {
  const [rowKeys, SetRowKeys] = useState([0]);
  const [filters, SetFilters] = useState(['']);
  console.log(rowKeys);

  const deleteRow = useCallback(
    (key: string) => {
      if (rowKeys.length > 1) {
        SetRowKeys(current => current.splice(parseInt(key), 1));
        SetFilters(current => current.splice(parseInt(key), 0, ''));
      }
    },
    [rowKeys]
  );

  const incrementRows = useCallback(() => {
    SetRowKeys(current => current.splice(rowKeys.length, 0, rowKeys[rowKeys.length - 1] + 1));
  }, [rowKeys]);

  const filter = useMemo(() => {
    return filters.join(' ');
  }, [filters]);

  return (
    <>
      {rowKeys.map(key => (
        <SearchFilterInputItem
          key={key.toString()}
          attribute={attribute}
          deleteRow={deleteRow}
          incrementRows={incrementRows}
        ></SearchFilterInputItem>
      ))}
    </>
  );
};

const SearchFilterInputItem = ({
  key,
  attribute,
  deleteRow,
  incrementRows,
}: {
  key: string;
  attribute: string;
  deleteRow: (key: string) => void;
  incrementRows: () => void;
}) => {
  const { t } = useTranslation();
  const DEFAULT_OPTION = 'default';
  const Text_FILTER_OPERATOR_OPTIONS = [
    DEFAULT_OPTION,
    'equal',
    'unequal',
    'is-empty',
    'is-not-empty',
  ];
  const TIME_FILTER_OPERATOR_OPTIONS = [
    DEFAULT_OPTION,
    'span',
    'lower',
    'lower-equal',
    'greater',
    'greater-equal',
    'is-empty',
    'is-not-empty',
  ];
  const Filter_COMBINATOR_OPTIONS = [DEFAULT_OPTION, 'and', 'or'];
  const filterOperatorOptions =
    attribute === 'timeRange' ? TIME_FILTER_OPERATOR_OPTIONS : Text_FILTER_OPERATOR_OPTIONS;

  const [displayedTextFieldsAmount, SetDisplayedTextFieldsAmount] = useState(1);
  const [filterProps, SetFilterProps] = useState<FilterProps>({
    attribute: attribute,
    operatorOption: '',
    firstValue: '',
    secondValue: '',
    combinatorOption: '',
  });

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
        return 'and';
      case 'or':
        return 'or';
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

  const buildFilter = useCallback(
    ({
      attribute,
      operatorOption,
      firstValue,
      secondValue,
      combinatorOption,
    }: {
      attribute: string;
      operatorOption: string;
      firstValue: string;
      secondValue: string;
      combinatorOption: string;
    }) => {
      const TIME_START = 'time_range_tag_start';
      const TIME_END = 'time_range_tag_end';

      if (operatorOption === 'is-empty') {
        return attribute !== 'timeRange'
          ? `(${attributeTranslator(attribute)} IS EMPTY OR ${attributeTranslator(
              attribute
            )} IS NULL) ${optionTranslator(operatorOption)}`
          : `((${TIME_START} IS EMPTY OR ${TIME_START} IS NULL) AND (${TIME_END} IS EMPTY OR ${TIME_END} IS NULL)) ${optionTranslator(
              combinatorOption
            )}`;
      } else if (operatorOption === 'is-not-empty') {
        return attribute !== 'timeRange'
          ? `(${attributeTranslator(attribute)} IS NOT EMPTY AND ${attributeTranslator(
              attribute
            )} IS NOT NULL) ${optionTranslator(operatorOption)}`
          : `(${TIME_START} IS NOT EMPTY AND ${TIME_START} IS NOT NULL AND ${TIME_END} IS NOT EMPTY AND ${TIME_END} IS NOT NULL) ${optionTranslator(
              combinatorOption
            )}`;
      }

      if (attribute === 'timeRange') {
        return operatorOption === 'span'
          ? `(${TIME_START} >= ${firstValue} AND ${TIME_END} <= ${secondValue}) ${optionTranslator(
              combinatorOption
            )}`
          : `(${TIME_START} ${optionTranslator(
              operatorOption
            )} ${firstValue} AND ${TIME_END} ${optionTranslator(
              operatorOption
            )} ${firstValue}) ${optionTranslator(combinatorOption)}`;
      } else {
        return `${attributeTranslator(attribute)} ${optionTranslator(
          operatorOption
        )} ${firstValue} ${optionTranslator(combinatorOption)}`;
      }
    },
    [optionTranslator, attributeTranslator]
  );

  const filter = useMemo(() => {
    return buildFilter(filterProps);
  }, [filterProps, buildFilter]);

  const setFilterOperatorOption = useCallback((option: string) => {
    SetFilterProps(filterProps => ({ ...filterProps, operatorOption: option }));
    SetDisplayedTextFieldsAmount(
      option === 'span' ? 2 : option === 'is-empty' || option === 'is-not-empty' ? 0 : 1
    );
  }, []);

  const setFilterValue = useCallback(
    <T extends keyof FilterProps>(key: T, value: string) => {
      SetFilterProps(filterProps => ({ ...filterProps, [key]: value }));
    },
    [SetFilterProps]
  );

  const setFilterCombinatorOption = useCallback(
    (option: string) => {
      if (option === DEFAULT_OPTION) {
        SetFilterProps(filterProps => ({ ...filterProps, combinatorOption: '' }));
        deleteRow(key);
      } else {
        SetFilterProps(filterProps => ({ ...filterProps, combinatorOption: option }));
        incrementRows();
      }
    },
    [deleteRow, incrementRows, key]
  );

  return (
    <div className='flex flex-row'>
      <span>{t(`search.${attribute}`)}</span>
      <Select
        onChange={event => setFilterOperatorOption(event.target.value)}
        defaultValue={'default'}
        renderValue={value => t(`search.${value}`)}
      >
        {filterOperatorOptions.map(option => (
          <MenuItem key={option} value={option}>
            {t(`search.${option}`)}
          </MenuItem>
        ))}
      </Select>
      {displayedTextFieldsAmount === 2 ? (
        <>
          <TextField
            onChange={event => setFilterValue('firstValue', event.target.value)}
          ></TextField>
          <TextField
            onChange={event => setFilterValue('secondValue', event.target.value)}
          ></TextField>
        </>
      ) : displayedTextFieldsAmount === 1 ? (
        <TextField onChange={event => setFilterValue('firstValue', event.target.value)}></TextField>
      ) : (
        <></>
      )}

      <Select
        onChange={event => setFilterCombinatorOption(event.target.value)}
        defaultValue={'default'}
        renderValue={value => t(`search.${value}`)}
      >
        {Filter_COMBINATOR_OPTIONS.map(option => (
          <MenuItem key={option} value={option}>
            {t(`search.${option}`)}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

const AdvancedSearch = ({
  setFilters,
  searchFilters,
}: {
  setFilters: (filters: string) => void;
  searchFilters: SearchFilters;
}) => {
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

  const IS_TEXT = 'is_text';

  //   const [keywordFilter, SetKeywordFilter] = useState('');
  //   const [descriptionFilter, SetDescriptionFilter] = useState('');
  //   const [commentFilter, SetCommentFilter] = useState('');
  //   const [personFilter, SetPersonFilter] = useState('');
  //   const [faceTagFilter, SetFaceTagFilter] = useState('');
  //   const [locationFilter, SetLocationFilter] = useState('');
  //   const [collectionFilter, SetCollecionFilter] = useState('');
  //   const [archiveFilter, SetArchiveFilter] = useState('');
  //   const [timeRangeFilter, SetTimeFilter] = useState('');

  return (
    <div className='advanced-search'>
      <div className='advanced-search-content'>
        {ATTRIBUTES.map(attr => (
          <SearchFilterInput key={attr} attribute={attr}></SearchFilterInput>
        ))}
      </div>
    </div>
  );
};

export default AdvancedSearch;
