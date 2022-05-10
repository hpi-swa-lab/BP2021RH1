import React, { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './FormattedComment.scss';
import { FlatComment } from '../../../types/additionalFlatTypes';
import { Button } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const FormattedComment = ({ comment }: { comment: FlatComment }) => {
  const { t } = useTranslation();

  const parseNewLine = (text: string) => text.replace(/\\n/gm, '\n');

  const isLong = comment.text.length > 500;

  const [isOpen, setIsOpen] = useState<boolean>(!isLong);

  return (
    <div className={`comment${isOpen ? ' open' : ''}${isLong ? ' long' : ''}`} key={comment.id}>
      <div className='comment-details'>
        <strong>{comment.author}</strong> {t('common.wrote-on')}{' '}
        {dayjs(comment.date as string).format('DD.MM.YYYY')}
        :<br />
      </div>
      <div className='comment-text'>{parseNewLine(comment.text)}</div>
      {isLong && (
        <Button
          className='expand-button'
          onClick={() => setIsOpen(!isOpen)}
          startIcon={<ExpandMore />}
        >
          {isOpen ? t('common.showLess') : t('common.showMore')}
        </Button>
      )}
    </div>
  );
};

export default FormattedComment;
