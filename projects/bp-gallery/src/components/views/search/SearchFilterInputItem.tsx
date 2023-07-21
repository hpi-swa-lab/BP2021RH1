import { AddCircleOutlineOutlined, HighlightOff } from '@mui/icons-material';
import { MenuItem, Select, TextField, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributeFilterProps } from './AdvancedSearch';

export const SearchFilterInputItem = ({
  filterIndex,
  itemIndex,
  attribute,
  updateFilterProps,
  advancedSearchProps,
  archiveTags,
}: {
  filterIndex: number;
  itemIndex: number;
  attribute: string;
  advancedSearchProps: AttributeFilterProps[];
  archiveTags: string[];
  updateFilterProps: (index: number, action: string, property: string, value: string) => void;
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
  const TIME_FILTER_OPERATOR_OPTIONS = [DEFAULT_OPTION, 'span', 'is-empty', 'is-not-empty'];
  const Filter_COMBINATOR_OPTIONS = ['and', 'or'];
  const filterOperatorOptions =
    attribute === 'timeRange' ? TIME_FILTER_OPERATOR_OPTIONS : Text_FILTER_OPERATOR_OPTIONS;

  const [displayedTextFieldsAmount, SetDisplayedTextFieldsAmount] = useState(
    attribute === 'archive' ? 0 : 1
  );
  const switchTextFieldsAmount = useCallback(
    (option: string) => {
      if (attribute === 'archive') {
        SetDisplayedTextFieldsAmount(0);
        return;
      }

      switch (option) {
        case 'is-empty':
        case 'is-not-empty':
          SetDisplayedTextFieldsAmount(0);
          break;
        case 'span':
          SetDisplayedTextFieldsAmount(2);
          break;
        default:
          SetDisplayedTextFieldsAmount(1);
      }
    },
    [attribute, SetDisplayedTextFieldsAmount]
  );

  const AttributeFilterProps = advancedSearchProps.filter(
    entry => entry.attribute === attribute
  )[0];

  return (
    <div className='flex flex-col pr-1 '>
      {itemIndex === 0 ? (
        <Typography gutterBottom={true}>{t(`search.${attribute}`)}</Typography>
      ) : (
        <></>
      )}
      <div className='flex flex-row items-center'>
        <Select
          className='mr-1'
          onChange={event => {
            switchTextFieldsAmount(event.target.value);
            updateFilterProps(itemIndex, 'set', 'filterOperator', event.target.value);
          }}
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
              sx={{ marginRight: '0.25rem' }}
              value={AttributeFilterProps.filterProps[itemIndex].values[0] ?? ''}
              onChange={event => {
                updateFilterProps(itemIndex, 'set', 'firstValue', event.target.value);
              }}
            ></TextField>
            <TextField
              sx={{ marginRight: '0.25rem' }}
              value={AttributeFilterProps.filterProps[itemIndex].values[1] ?? ''}
              onChange={event => {
                updateFilterProps(itemIndex, 'set', 'secondValue', event.target.value);
              }}
            ></TextField>
          </>
        ) : displayedTextFieldsAmount === 1 ? (
          <TextField
            sx={{ marginRight: '0.25rem' }}
            value={AttributeFilterProps.filterProps[itemIndex].values[0] ?? ''}
            onChange={event => {
              updateFilterProps(itemIndex, 'set', 'firstValue', event.target.value);
            }}
          ></TextField>
        ) : attribute === 'archive' &&
          AttributeFilterProps.filterProps[itemIndex].filterOperator !== 'is-empty' &&
          AttributeFilterProps.filterProps[itemIndex].filterOperator !== 'is-not-empty' ? (
          <Select
            className='w-fit'
            defaultValue={'default'}
            renderValue={value => (value === 'default' ? t(`search.${value}`) : value)}
            onChange={event => {
              updateFilterProps(itemIndex, 'set', 'firstValue', event.target.value);
            }}
          >
            <MenuItem value={'default'}>{t('search.default')}</MenuItem>
            {archiveTags.map((tag, index) => (
              <MenuItem value={tag} key={tag}>
                {tag}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <></>
        )}

        {AttributeFilterProps.filterProps[itemIndex + 1] ? (
          <Select
            sx={{ marginRight: '0.25rem' }}
            onChange={event => {
              updateFilterProps(itemIndex, 'set', 'combinationOperator', event.target.value);
            }}
            defaultValue={'and'}
            renderValue={value => t(`search.${value}`)}
          >
            {Filter_COMBINATOR_OPTIONS.map(option => (
              <MenuItem key={option} value={option}>
                {t(`search.${option}`)}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <></>
        )}
        {itemIndex !== 0 ? (
          <HighlightOff
            sx={{ padding: '0.25rem', fontSize: 30 }}
            onClick={() => updateFilterProps(itemIndex, 'delete', '', '')}
          ></HighlightOff>
        ) : (
          <></>
        )}
        <AddCircleOutlineOutlined
          sx={{ padding: '0.25rem', fontSize: 30 }}
          fontSize='large'
          onClick={() => {
            updateFilterProps(itemIndex, 'set', 'combinationOperator', 'and');
            updateFilterProps(itemIndex, 'add', '', '');
          }}
        ></AddCircleOutlineOutlined>
      </div>
    </div>
  );
};
