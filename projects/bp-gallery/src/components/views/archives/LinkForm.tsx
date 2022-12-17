import { Add, Delete, Edit, Save } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import React, { useState } from 'react';
import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useUpdateLinkMutation,
} from '../../../graphql/APIConnector';
import { FlatLink } from '../../../types/additionalFlatTypes';
import LinkField from './LinkField';

interface LinkFormProps {
  links: FlatLink[] | undefined;
  archiveId: string;
}

const LinkForm = ({ links, archiveId }: LinkFormProps) => {
  const [createLink] = useCreateLinkMutation({ refetchQueries: ['getArchive'] });
  const [updateLink] = useUpdateLinkMutation({ refetchQueries: ['getArchive'] });
  const [deleteLink] = useDeleteLinkMutation({ refetchQueries: ['getArchive'] });
  const [selectEdit, setSelectEdit] = useState<string | undefined>();

  return (
    <div className='archive-link-form'>
      <label className='archive-form-label'>Links:</label>
      {links?.map(link => (
        <div className='archive-link-entry' key={link.id}>
          {selectEdit === link.id ? (
            <>
              <LinkField
                link={link}
                onBlur={(title, url) =>
                  updateLink({
                    variables: {
                      id: link.id,
                      data: {
                        title: title,
                        url: url,
                      },
                    },
                  })
                }
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
              <a href={`http://${link.url}/`}>{link.title}</a>
              <IconButton
                onClick={() => {
                  setSelectEdit(link.id);
                }}
              >
                <Edit />
              </IconButton>
            </>
          )}

          <IconButton
            onClick={() =>
              deleteLink({
                variables: {
                  id: link.id,
                },
              })
            }
          >
            <Delete />
          </IconButton>
        </div>
      ))}

      <Button
        className='button-filled'
        endIcon={<Add />}
        onClick={() =>
          createLink({
            variables: {
              title: '',
              url: '',
              archive_tag: archiveId,
            },
          }).then(value => setSelectEdit(value.data?.createLink?.data?.id ?? ''))
        }
      >
        Link hinzufügen
      </Button>
    </div>
  );
};

export default LinkForm;
