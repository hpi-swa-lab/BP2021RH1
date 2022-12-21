import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { LinkInfo, LinkStatus } from './ArchiveEditView';
import ArchiveLinkField from './ArchiveLinkField';

interface LinkFormProps {
  links: LinkInfo[] | undefined;
  onChange: (links: LinkInfo[], invalid: boolean) => void;
}

const ArchiveLinkForm = ({ links: defaultLinks, onChange }: LinkFormProps) => {
  const [selectedLink, setselectedLink] = useState<string>();
  const [links, setLinks] = useState<LinkInfo[]>(defaultLinks ?? []);

  const updateLink = (link: LinkInfo) => {
    setLinks(links.map(oldLink => (oldLink.id === link.id ? link : oldLink)));
  };

  useEffect(() => {
    setLinks(defaultLinks ?? []);
  }, [defaultLinks]);

  useEffect(() => {
    const invalid = links.find(link => link.invalid) ? true : false;
    links !== defaultLinks && onChange(links, invalid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [links]);

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label'>Links:</label>
      <div className='archive-form-input'>
        {links.map(
          link =>
            !(link.status === LinkStatus.Deleted) && (
              <div className='archive-link-entry' key={link.id}>
                {selectedLink === link.id ? (
                  <>
                    <ArchiveLinkField
                      link={link}
                      onBlur={(title, url, match) => {
                        const updatedLink = {
                          id: link.id,
                          title: title,
                          url: url,
                          invalid: !match,
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
                        if (!link.invalid) setselectedLink(undefined);
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
                          setselectedLink(link.id);
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
          endIcon={<Add />}
          onClick={() => {
            if (!links.find(value => value.id === selectedLink)?.invalid) {
              const newLink = {
                // ID doesn't actually get used when creating a new link, but is necessary so that react doesn't see two links with the same key
                id: `new${Date.now()}`,
                url: '',
                status: LinkStatus.Created,
              };
              const newLinks = [...links, newLink];
              setLinks(newLinks);
              setselectedLink(newLink.id);
            }
          }}
        >
          Link hinzufügen
        </Button>
      </div>
    </div>
  );
};

export default ArchiveLinkForm;
