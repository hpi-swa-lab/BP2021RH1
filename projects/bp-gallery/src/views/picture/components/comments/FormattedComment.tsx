import React from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import './FormattedComment.scss';
import { FlatComment } from '../../../../graphql/additionalFlatTypes';

const FormattedComment = ({ comment }: { comment: FlatComment }) => {
  const { t } = useTranslation();

  const parseNewLine = (text: string) => text.replace(/\\n/gm, '\n');

  return (
    <div className='comment' key={comment.id}>
      <div className='comment-details'>
        {comment.author} {t('common.wrote-on')} {dayjs(comment.date as string).format('DD.MM.YYYY')}
        :<br />
      </div>
      <div className='comment-text'>&quot; {parseNewLine(comment.text ?? '')} &quot;</div>
    </div>
  );
};

export default FormattedComment;
