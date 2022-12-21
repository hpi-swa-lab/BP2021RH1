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

  console.log(title);
  console.log(url);

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
        onBlur={() => onBlur(title, url, regex.test(url))}
        helperText='Titel (optional)'
      />
      <ArchiveInput
        id='url'
        placeholder='meine-homepage.de'
        type='url'
        value={url}
        onChange={event => setUrl(event.target.value)}
        onBlur={() => {
          setUrl(sanitizeLink(url));
          onBlur(title, url, regex.test(url));
        }}
        helperText='URL'
      />
    </div>
  );
};

export default ArchiveLinkField;
