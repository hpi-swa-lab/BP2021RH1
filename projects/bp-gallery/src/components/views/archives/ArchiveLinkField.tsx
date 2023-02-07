import { useState } from 'react';
import { LinkInfo } from './ArchiveEditView';
import { sanitizeLink } from './helpers/link-helpers';
import ArchiveInput from './ArchiveInput';
import { useTranslation } from 'react-i18next';

interface LinkFieldProps {
  link: LinkInfo;
  onBlur: (title: string, url: string, match: boolean) => void;
}

const ArchiveLinkField = ({ link, onBlur }: LinkFieldProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(link.title ?? '');
  const [url, setUrl] = useState(link.url);
  const [invalid, setInvalid] = useState(false);

  const regex =
    // eslint-disable-next-line no-useless-escape
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

  return (
    <div className='archive-link-entry-form'>
      <ArchiveInput
        id='title'
        placeholder={t('archives.edit.links.title.placeholder')}
        value={title}
        onChange={event => setTitle(event.target.value)}
        onBlur={() => {
          const match = regex.test(url);
          setInvalid(!match);
          onBlur(title, url, match);
        }}
        helperText={t('archives.edit.links.title.helperText')}
      />
      <ArchiveInput
        id='url'
        placeholder={t('archives.edit.links.url.placeholder')}
        type='url'
        value={url}
        error={invalid}
        onChange={event => {
          setUrl(event.target.value);
          setInvalid(!regex.test(event.target.value));
        }}
        onBlur={() => {
          setUrl(sanitizeLink(url));
          const match = regex.test(url);
          setInvalid(!match);
          onBlur(title, url, match);
        }}
        helperText={t(`archives.edit.links.url.helperText${invalid ? 'Invalid' : 'Valid'}`)}
      />
    </div>
  );
};

export default ArchiveLinkField;
