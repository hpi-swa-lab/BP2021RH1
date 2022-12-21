import React, { useState } from 'react';
import { LinkInfo } from './ArchiveEditView';
import { sanitizeLink } from './helpers/link-helpers';
import ArchiveInput from './ArchiveInput';

interface LinkFieldProps {
  link: LinkInfo;
  onBlur: (title: string, url: string, match: boolean) => void;
}

const ArchiveLinkField = ({ link, onBlur }: LinkFieldProps) => {
  const [title, setTitle] = useState(link.title ?? '');
  const [url, setUrl] = useState(link.url);
  const [invalid, setInvalid] = useState(false);

  const regex =
    // eslint-disable-next-line no-useless-escape
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  return (
    <div>
      <ArchiveInput
        id='title'
        placeholder='Meine Homepage'
        value={title}
        onChange={event => setTitle(event.target.value)}
        onBlur={() => {
          const match = regex.test(url);
          setInvalid(!match);
          onBlur(title, url, match);
        }}
        helperText='Titel (optional)'
      />
      <ArchiveInput
        id='url'
        placeholder='meine-homepage.de'
        type='url'
        value={url}
        error={invalid}
        onChange={event => setUrl(event.target.value)}
        onBlur={() => {
          setUrl(sanitizeLink(url));
          const match = regex.test(url);
          setInvalid(!match);
          onBlur(title, url, match);
        }}
        helperText={invalid ? 'Bitte geben sie eine gültige URL an.' : 'URL'}
      />
    </div>
  );
};

export default ArchiveLinkField;
