import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkInfo } from './ArchiveEditView';
import ArchiveInput from './ArchiveInput';
import { sanitizeLink } from './helpers/link-helpers';

interface LinkFieldProps {
  link: LinkInfo;
  onBlur: (title: string, url: string, match: boolean) => void;
}

const ArchiveLinkField = ({ link, onBlur }: LinkFieldProps) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(link.title ?? '');
  const [url, setUrl] = useState(link.url);
  const [invalid, setInvalid] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validUrl =
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
          const valid = validUrl.test(url);
          dirty && setInvalid(!valid);
          onBlur(title, url, valid);
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
          if (invalid) {
            const sanitizedUrl = sanitizeLink(event.target.value);
            setInvalid(!validUrl.test(sanitizedUrl));
          }
        }}
        onBlur={() => {
          const sanitizedUrl = sanitizeLink(url);
          const valid = validUrl.test(sanitizedUrl);
          setUrl(sanitizedUrl);
          setDirty(sanitizedUrl !== link.url);
          setInvalid(!valid);
          onBlur(title, sanitizedUrl, valid);
        }}
        helperText={t(`archives.edit.links.url.helperText${invalid ? 'Invalid' : 'Valid'}`)}
      />
    </div>
  );
};

export default ArchiveLinkField;
