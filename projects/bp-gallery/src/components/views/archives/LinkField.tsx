import React, { useState } from 'react';
import { FormControl, FormHelperText, OutlinedInput } from '@mui/material';
import { LinkInfo } from './ArchiveEditView';

interface LinkFieldProps {
  link: LinkInfo;
  onBlur: (title: string, url: string) => void;
}

const LinkField = ({ link, onBlur }: LinkFieldProps) => {
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);

  return (
    <div>
      <FormControl>
        <OutlinedInput
          className='archive-form-input'
          id='archive-form-link-title'
          type='text'
          name='title'
          placeholder='Meine Homepage'
          inputProps={{
            onBlur: () => {
              onBlur(title ?? '', url);
            },
          }}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
        <FormHelperText>Titel</FormHelperText>
      </FormControl>
      <FormControl>
        <OutlinedInput
          className='archive-form-input'
          id='archive-form-link-url'
          type='url'
          name='url'
          placeholder='meine-homepage.de'
          inputProps={{
            onBlur: () => {
              onBlur(title ?? '', url);
            },
          }}
          value={url}
          onChange={event => setUrl(event.target.value)}
        />
        <FormHelperText>URL</FormHelperText>
      </FormControl>
    </div>
  );
};

export default LinkField;
