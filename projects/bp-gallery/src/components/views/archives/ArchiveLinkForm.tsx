import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LinkInfo, LinkStatus } from './ArchiveEditView';
import ArchiveLinkField from './ArchiveLinkField';

interface LinkFormProps {
  links: LinkInfo[] | undefined;
  onChange: (links: LinkInfo[], invalid: boolean) => void;
}

const ArchiveLinkForm = ({ links: defaultLinks, onChange }: LinkFormProps) => {
  const [selectedLink, setSelectedLink] = useState<string>();
  const [links, setLinks] = useState<LinkInfo[]>(defaultLinks ?? []);

  const { t } = useTranslation();

  const updateLink = (link: LinkInfo) => {
    setLinks(links.map(oldLink => (oldLink.id === link.id ? link : oldLink)));
  };

  useEffect(() => {
    setLinks(defaultLinks ?? []);
    setSelectedLink(undefined);
  }, [defaultLinks]);

  useEffect(() => {
    const invalid = links.find(link => link.invalid) ? true : false;
    if (links !== defaultLinks) onChange(links, invalid);
  }, [defaultLinks, links, onChange]);

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label'>{t('archives.edit.links.label')}:</label>
      <div className='archive-form-input archive-form-link-input'>
        {links.map(
          link =>
            !(link.status === LinkStatus.Deleted) && (
              <div className='archive-link-entry' key={link.id}>
                {selectedLink === link.id ? (
                  <>
                    <ArchiveLinkField
                      link={link}
                      onBlur={(title, url, invalid) => {
                        if (title === link.title && url === link.url) return;
                        const updatedLink = {
                          id: link.id,
                          title: title,
                          url: url,
                          invalid: invalid,
                          status:
                            link.status === LinkStatus.Created
                              ? LinkStatus.Created
                              : LinkStatus.Updated,
                        };
                        updateLink(updatedLink);
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        if (!link.invalid) setSelectedLink(undefined);
                      }}
                    >
                      <Save />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <a href={`http://${link.url}/`}>{link.title ? link.title : link.url}</a>
                    <IconButton
                      onClick={() => {
                        if (!links.find(value => value.id === selectedLink)?.invalid)
                          setSelectedLink(link.id);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </>
                )}

                <IconButton
                  onClick={() => {
                    link.status === LinkStatus.Created
                      ? setLinks(links.filter(createdLink => createdLink.id !== link.id))
                      : updateLink({ ...link, status: LinkStatus.Deleted, invalid: false });
                  }}
                >
                  <Delete />
                </IconButton>
              </div>
            )
        )}
        <Button
          className='button-filled'
          startIcon={<Add />}
          onClick={() => {
            if (!links.find(value => value.id === selectedLink)?.invalid) {
              const newLink = {
                // ID doesn't actually get used when creating a new link, but is necessary so that react doesn't see two links with the same key
                id: `new${Date.now()}`,
                url: '',
                status: LinkStatus.Created,
              };
              setLinks([...links, newLink]);
              setSelectedLink(newLink.id);
            }
          }}
        >
          {t('archives.edit.links.addLink')}
        </Button>
      </div>
    </div>
  );
};

export default ArchiveLinkForm;
