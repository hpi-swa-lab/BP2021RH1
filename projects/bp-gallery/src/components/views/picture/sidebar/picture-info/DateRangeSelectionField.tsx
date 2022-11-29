import { Popover } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatTimeRangeTag } from '../../../../../types/additionalFlatTypes';
import { formatTimeStamp } from '../../../../../helpers/format-timestamp';
import { DateRangePicker, InputRange, Range } from 'react-date-range';
import dayjs from 'dayjs';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { de } from 'date-fns/locale';
import { AuthRole, useAuth } from '../../../../provider/AuthProvider';
import i18n from '../../../../../i18n';
import { cloneDeep } from 'lodash';

const DateRangeSelectionField = ({
  timeRangeTag,
  onChange,
  onTouch,
  onResetTouch,
}: {
  timeRangeTag?: FlatTimeRangeTag;
  onChange: (timeRangeTag: FlatTimeRangeTag) => void;
  onTouch: () => void;
  onResetTouch: () => void;
}) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);
  const [timeRange, setTimeRange] = useState<FlatTimeRangeTag | undefined>();

  useEffect(() => {
    setTimeRange(cloneDeep(timeRangeTag));
  }, [setTimeRange, timeRangeTag]);

  const open = Boolean(anchorElement);

  const selectionRange = useMemo(() => {
    if (!timeRange) {
      return {
        startDate: dayjs().toDate(),
        endDate: dayjs().toDate(),
        key: 'selection',
      };
    }
    return {
      startDate: dayjs(timeRange.start as string).toDate(),
      endDate: dayjs(timeRange.end as string).toDate(),
      key: 'selection',
    };
  }, [timeRange]);

  return (
    <>
      <div
        className='date-indicator'
        onClick={event => {
          if (role < AuthRole.CURATOR) return;
          setAnchorElement(event.currentTarget);
        }}
      >
        {timeRange ? formatTimeStamp(timeRange) : `${t('pictureFields.noTime')}`}
      </div>
      {role >= AuthRole.CURATOR && (
        <Popover
          open={open}
          anchorEl={anchorElement}
          onClose={() => {
            setAnchorElement(null);
            if (
              timeRange &&
              (timeRange.start !== timeRangeTag?.start || timeRangeTag?.end !== timeRange.end)
            ) {
              onChange(timeRange);
            } else {
              onResetTouch();
            }
            resetInputFields();
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <DateRangePicker
            ranges={[selectionRange]}
            locale={de}
            editableDateInputs={true}
            rangeColors={['#690e6e']}
            staticRanges={[]}
            inputRanges={INPUT_RANGES}
            dateDisplayFormat={'dd.MM.yyyy'}
            minDate={dayjs(`1000-01-01`).toDate()}
            maxDate={dayjs().add(1, 'year').toDate()}
            onChange={range => {
              if (range.selection.startDate && range.selection.endDate) {
                const s = range.selection.startDate.toISOString();
                const e = range.selection.endDate.toISOString();
                onTouch();
                setTimeRange(oldTimeRange => {
                  const tRT = oldTimeRange ?? ({} as FlatTimeRangeTag);
                  tRT.start = s;
                  tRT.end = e;
                  return { ...tRT };
                });
                resetInputFields();
              }
            }}
          />
        </Popover>
      )}
    </>
  );
};

export default DateRangeSelectionField;

let yearValue = '';
let decadeValue = '';

let resetDecade = false;
let resetYear = false;

const resetInputFields = () => {
  if (resetDecade) {
    decadeValue = '';
  }
  if (resetYear) {
    yearValue = '';
  }
  resetDecade = true;
  resetYear = true;
};

const INPUT_RANGES: InputRange[] = [
  {
    label: 'Jahr',
    range(value: number, props) {
      yearValue = `${value}`;
      resetYear = false;
      if (yearValue.length < 4) {
        return props?.ranges?.[0] as unknown as Range;
      }
      const returnRange = {
        startDate: dayjs(`${yearValue}-01-01`).toDate(),
        endDate: dayjs(`${yearValue}-12-31`).toDate(),
      } as unknown as Range;
      return returnRange;
    },
    getCurrentValue(): string {
      if (yearValue.length) {
        return yearValue;
      }
      return '0';
    },
  },
  {
    label: i18n.t('common.0s'),
    range(value: number, props) {
      decadeValue = `${value}`;
      resetDecade = false;
      if (decadeValue.length !== 3) {
        return props?.ranges?.[0] as unknown as Range;
      }
      const returnRange = {
        startDate: dayjs(`${decadeValue}0-01-01`).toDate(),
        endDate: dayjs(`${decadeValue}9-12-31`).toDate(),
      } as unknown as Range;
      return returnRange;
    },
    getCurrentValue(): string {
      if (decadeValue.length) {
        return decadeValue;
      }
      return '0';
    },
  },
];
