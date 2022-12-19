import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useState } from 'react';
import { LinkInfo, LinkStatus } from './ArchiveEditView';
import LinkField from './LinkField';

interface LinkFormProps {
  links: LinkInfo[] | undefined;
  archiveId: string;
}

const LinkForm = ({ links, archiveId }: LinkFormProps) => {
  const [selectEdit, setSelectEdit] = useState<LinkInfo | undefined>();
  const [removedLinks, setRemovedLinks] = useState<LinkInfo[]>([]);

  return (
    <div className='archive-form-div'>
      <label className='archive-form-label'>Links:</label>
      <div className='archive-form-input'>
        {links?.map(
          link =>
            !removedLinks.find(removedLink => removedLink === link) && (
              <div className='archive-link-entry' key={link.id}>
                {selectEdit === link ? (
                  <>
                    <LinkField
                      link={link}
                      onBlur={(title, url) => {
                        link.title = title;
                        link.url = url;
                        link.status =
                          link.status === LinkStatus.Created
                            ? LinkStatus.Created
                            : LinkStatus.Updated;
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        setSelectEdit(undefined);
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
                        setSelectEdit(link);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </>
                )}

                <IconButton
                  onClick={() => {
                    link.status = LinkStatus.Deleted;
                    setRemovedLinks([
                      links.filter(linkInfo => linkInfo === link)[0],
                      ...removedLinks,
                    ]);
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
            const newLink = {
              id: `${links?.length ?? '0'}`,
              url: '',
              status: LinkStatus.Created,
            };
            console.log(newLink);
            links?.push(newLink);
            setSelectEdit(newLink);
          }}
        >
          Link hinzufügen
        </Button>
      </div>
    </div>
  );
};

export default LinkForm;
