import { MenuItem, Select, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
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
};

const SearchFilterInput = ({ key, attribute }: { key: string; attribute: string }) => {
  const [rowKeys, SetRowKeys] = useState([0]);

  return rowKeys.map(key => (
    <SearchFilterInputItem key={key.toString()} attribute={attribute}></SearchFilterInputItem>
  ));
};

const SearchFilterInputItem = ({ key, attribute }: { key: string; attribute: string }) => {
  const { t } = useTranslation();
  const Text_FILTER_OPTIONS = ['default', 'equal', 'unequal', 'is-empty', 'is-not-empty'];
  const TIME_FILTER_OPTIONS = ['default', 'to', 'lower', 'lower-equal', 'greater', 'greater-equal'];
  const Filter_COMBINATION_OPTIONS = ['default', 'and', 'or'];
  const filterOPtions = attribute === 'timeRange' ? TIME_FILTER_OPTIONS : Text_FILTER_OPTIONS;

  const [displayTwoTextFields, SetDisplayTwoTextFields] = useState(false);
  const [filterProps, SetFilterProps] = useState<FilterProps>({
    attribute: attribute,
    operatorOption: '',
    firstValue: '',
    secondValue: '',
  });

  const setFilterOperatorOption = useCallback(
    (option: string) => {
      SetFilterProps(filterProps => ({ ...filterProps, operatorOption: option }));
      SetDisplayTwoTextFields(option === 'to');
    },
    [SetFilterProps]
  );

  const setFilterValue = useCallback(
    <T extends keyof FilterProps>(key: T, value: string) => {
      SetFilterProps(filterProps => ({ ...filterProps, [key]: value }));
    },
    [SetFilterProps]
  );

  const setFilterCombinationOption = useCallback(() => {}, []);
  console.log(key);

  return (
    <div className='flex flex-row'>
      <span>{t(`search.${attribute}`)}</span>
      <Select
        onChange={event => setFilterOperatorOption(event.target.value)}
        defaultValue={'default'}
        renderValue={value => t(`search.${value}`)}
      >
        {filterOPtions.map(option => (
          <MenuItem key={option} value={option}>
            {t(`search.${option}`)}
          </MenuItem>
        ))}
      </Select>
      {displayTwoTextFields ? (
        <>
          <TextField
            onChange={event => setFilterValue('firstValue', event.target.value)}
          ></TextField>
          <TextField
            onChange={event => setFilterValue('secondValue', event.target.value)}
          ></TextField>
        </>
      ) : (
        <TextField onChange={event => setFilterValue('firstValue', event.target.value)}></TextField>
      )}

      <Select
        onChange={event => setFilterCombinationOption()}
        defaultValue={'default'}
        renderValue={value => t(`search.${value}`)}
      >
        {Filter_COMBINATION_OPTIONS.map(option => (
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

  const FILTER_KEYWORDS = {
    keyword: 'keyword_tags',
    description: 'descriptions',
    comment: 'comments',
    person: 'person_tags',
    'face-tag': 'face_tags',
    location: 'location_tags',
    collection: 'collections',
    archive: 'archive_tag',
  };
  const TIME_START = 'time_range_tag_start';
  const TIME_END = 'time_range_tag_end';

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
      <div className='advanced-search-content'></div>
    </div>
  );
};

export default AdvancedSearch;
