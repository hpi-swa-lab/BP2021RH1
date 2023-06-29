import { AddCircleOutlineOutlined, HighlightOff } from '@mui/icons-material';
import { MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const SearchFilterInputItem = ({
  key,
  index,
  attribute,
  updateFilterProps,
}: {
  key: string;
  index: number;
  attribute: string;
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

  return (
    <div className='flex flex-row'>
      <span>{t(`search.${attribute}`)}</span>
      <Select
        onChange={event => {
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
            onChange={event => {
              updateFilterProps(index, 'set', 'firstValue', event.target.value);
            }}
          ></TextField>
          <TextField
            onChange={event => {
              updateFilterProps(index, 'set', 'secondValue', event.target.value);
            }}
          ></TextField>
        </>
      ) : displayedTextFieldsAmount === 1 ? (
        <TextField
          onChange={event => {
            updateFilterProps(index, 'set', 'firstValue', event.target.value);
          }}
        ></TextField>
      ) : (
        <></>
      )}

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
      <HighlightOff onClick={() => updateFilterProps(index, 'delete', '', '')}></HighlightOff>
      <AddCircleOutlineOutlined
        onClick={() => updateFilterProps(index, 'add', '', '')}
      ></AddCircleOutlineOutlined>
    </div>
  );
};
