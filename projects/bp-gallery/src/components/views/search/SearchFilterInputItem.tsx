import { AddCircleOutlineOutlined, HighlightOff } from '@mui/icons-material';
import { MenuItem, Select, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttributeFilterProps } from './AdvancedSearch';

export const SearchFilterInputItem = ({
  key,
  index,
  attribute,
  updateFilterProps,
  advancedSearchProps,
}: {
  key: string;
  index: number;
  attribute: string;
  advancedSearchProps: AttributeFilterProps[];
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
  const Filter_COMBINATOR_OPTIONS = ['and', 'or'];
  const filterOperatorOptions =
    attribute === 'timeRange' ? TIME_FILTER_OPERATOR_OPTIONS : Text_FILTER_OPERATOR_OPTIONS;

  const [displayedTextFieldsAmount, SetDisplayedTextFieldsAmount] = useState(1);
  const switchTextFieldsAmount = useCallback((option: string) => {
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
  }, []);

  const AttributeFilterProps = advancedSearchProps.filter(
    entry => entry.attribute === attribute
  )[0];

  return (
    <div className='flex flex-col'>
      {index === 0 ? <span>{t(`search.${attribute}`)}</span> : <></>}
      <div className='flex flex-row items-center'>
        <Select
          onChange={event => {
            switchTextFieldsAmount(event.target.value);
            updateFilterProps(index, 'set', 'filterOperator', event.target.value);
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
              value={AttributeFilterProps.filterProps[index].values[0] ?? ''}
              onChange={event => {
                updateFilterProps(index, 'set', 'firstValue', event.target.value);
              }}
            ></TextField>
            <TextField
              value={AttributeFilterProps.filterProps[index].values[1] ?? ''}
              onChange={event => {
                updateFilterProps(index, 'set', 'secondValue', event.target.value);
              }}
            ></TextField>
          </>
        ) : displayedTextFieldsAmount === 1 ? (
          <TextField
            value={AttributeFilterProps.filterProps[index].values[0] ?? ''}
            onChange={event => {
              updateFilterProps(index, 'set', 'firstValue', event.target.value);
            }}
          ></TextField>
        ) : (
          <></>
        )}

        {AttributeFilterProps.filterProps[index + 1] ? (
          <Select
            onChange={event => {
              updateFilterProps(index, 'set', 'combinationOperator', event.target.value);
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
        {index !== 0 ? (
          <HighlightOff onClick={() => updateFilterProps(index, 'delete', '', '')}></HighlightOff>
        ) : (
          <></>
        )}
        <AddCircleOutlineOutlined
          onClick={() => {
            updateFilterProps(index, 'set', 'combinationOperator', 'and');
            updateFilterProps(index, 'add', '', '');
          }}
        ></AddCircleOutlineOutlined>
      </div>
    </div>
  );
};
