import React, { useMemo, useState } from 'react';
import { sanitize } from 'dompurify';
import './CollectionDescription.scss';
import { Icon, IconButton } from '@mui/material';
import getLineBreaks from '../helpers/get-linebreaks';

const CollectionDescription = ({ description, name }: { description: string; name: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isDescriptionLong = useMemo(() => {
    const buffer = document.createElement('div');
    buffer.className = 'collection-description open';
    buffer.innerText = description;
    document.body.appendChild(buffer);
    const split = getLineBreaks(buffer.childNodes[0]);
    buffer.remove();

    return split.length > 3;
  }, [description]);

  return (
    <div className='collection-container'>
      <h2>{name}</h2>
      {description && (
        <div
          className={
            isOpen || !isDescriptionLong
              ? 'collection-description open'
              : 'collection-description closed'
          }
          dangerouslySetInnerHTML={{ __html: sanitize(description) }}
        />
      )}
      {isDescriptionLong && (
        <IconButton
          className='icon-button'
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <Icon className='icon'>{isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</Icon>
        </IconButton>
      )}
    </div>
  );
};
export default CollectionDescription;
