import { MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AdvancedSearch = ({ setFilters }: { setFilters: (filters: string) => void }) => {
  const { t } = useTranslation();
  const BASIC_FILTER_OPTIONS = ['default', 'equal', 'unequal', 'is-empty', 'is-not-empty'];
  const ADDITIONAL_TIME_FILTER_OPTIONS = ['lower', 'lower-equal', 'greater', 'greater-equal', 'to'];

  const ATTRIBUTES = [
    'keyword',
    'description',
    'comment',
    'person',
    'face-tag',
    'location',
    'collection',
    'archive',
    'time-range',
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

  const [keywordFilter, SetKeywordFilter] = useState('');
  const [descriptionFilter, SetDescriptionFilter] = useState('');
  const [commentFilter, SetCommentFilter] = useState('');
  const [personFilter, SetPersonFilter] = useState('');
  const [faceTagFilter, SetFaceTagFilter] = useState('');
  const [locationFilter, SetLocationFilter] = useState('');
  const [collectionFilter, SetCollecionFilter] = useState('');
  const [archiveFilter, SetArchiveFilter] = useState('');
  const [timeRangeFilter, SetTimeFilter] = useState('');

  return (
    <div className='advanced-search'>
      <div className='advanced-search-content'>
        <div className='advanced-search-filter'>
          {ATTRIBUTES.map(attr => (
            <div className='flex flex-row' key={attr}>
              <span>{t(`search.${attr}`)}</span>
              <Select defaultValue={'default'} renderValue={value => t(`search.${value}`)}>
                {BASIC_FILTER_OPTIONS.map(option => (
                  <MenuItem key={option} value={option}>
                    {t(`search.${option}`)}
                  </MenuItem>
                ))}
              </Select>
              <TextField></TextField>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;
