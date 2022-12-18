import { Button, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useGetArchiveQuery,
  useUpdateArchiveMutation,
  useUpdateLinkMutation,
} from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag, FlatLinkWithoutRelations } from '../../../types/additionalFlatTypes';
import './ArchiveEditView.scss';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import Editor from '../../common/editor/Editor';
import { Jodit } from 'jodit-react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';
import LinkForm from './LinkForm';

interface ArchiveEditViewProps {
  archiveId: string;
}

export enum LinkStatus {
  Created,
  Updated,
  Deleted,
}

export type LinkInfo = FlatLinkWithoutRelations & { status?: LinkStatus };

const extraOptions: Partial<Jodit['options']> = {
  preset: undefined,
  statusbar: false,
};

const ArchiveEditView = ({ archiveId }: ArchiveEditViewProps) => {
  const history: History = useHistory();

  const { data, refetch } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });
  const [createLink] = useCreateLinkMutation();
  const [updateLink] = useUpdateLinkMutation();
  const [deleteLink] = useDeleteLinkMutation();

  const [name, setName] = useState(archive?.name ?? '');
  const [shortDescription, setShortDescription] = useState(archive?.shortDescription ?? '');
  const [longDescription, setLongDescription] = useState(archive?.longDescription ?? '');
  const [links, setLinks] = useState<LinkInfo[]>(archive?.links ?? []);

  const handleLinks = () => {
    links.forEach(link => {
      switch (link.status) {
        case LinkStatus.Created: {
          if (link.url === '') return;
          createLink({
            variables: {
              title: link.title ?? '',
              url: link.url,
              archive_tag: archiveId,
            },
          });
          break;
        }
        case LinkStatus.Updated: {
          updateLink({
            variables: {
              id: link.id,
              data: {
                title: link.title,
                url: link.url,
              },
            },
          });
          break;
        }
        case LinkStatus.Deleted: {
          deleteLink({
            variables: {
              id: link.id,
            },
          });
          break;
        }
        default: {
          break;
        }
      }
    });
    refetch();
  };

  useEffect(() => {
    setName(archive?.name ?? '');
    setShortDescription(archive?.shortDescription ?? '');
    setLongDescription(archive?.longDescription ?? '');
    setLinks(archive?.links ?? []);
  }, [archive]);

  return (
    <div className='collection-picture-display'>
      <Button
        className='button-filled'
        endIcon={<CloseIcon />}
        onClick={() => {
          history.push(history.location.pathname.replace('edit', ''));
        }}
        style={{ float: 'left' }}
      >
        Änderungen verwerfen
      </Button>
      <Button
        className='button-filled'
        endIcon={<SaveIcon />}
        onClick={() => {
          updateArchive({
            variables: {
              archiveId,
              data: {
                name: name,
                shortDescription: shortDescription,
                longDescription: longDescription,
              },
            },
          });
          handleLinks();
          history.push(history.location.pathname.replace('edit', ''));
        }}
        style={{ float: 'right' }}
      >
        Änderungen speichern
      </Button>
      <h2>{archive?.name}</h2>

      <form className='archive-form'>
        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-name'>
            Archiv-Name:
          </label>
          <OutlinedInput
            className='archive-form-input'
            id='archive-form-name'
            name='name'
            type='text'
            onChange={event => setName(event.target.value)}
            value={name}
          />
        </div>
        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-short-description'>
            Kurzbeschreibung:
          </label>
          <OutlinedInput
            className='archive-form-input'
            id='archive-form-short-description'
            type='text'
            name='shortDescription'
            onChange={event => setShortDescription(event.target.value)}
            value={shortDescription}
          />
        </div>

        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-long-description'>
            Vorstellung:
          </label>
          <Editor
            value={longDescription}
            onChange={() => {}}
            onBlur={newValue => setLongDescription(newValue)}
            extraOptions={extraOptions}
          />
        </div>

        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-logo'>
            Logo:
          </label>
          <OutlinedInput
            className='archive-form-input'
            id='archive-form-logo'
            type='file'
            name='logo'
          />
        </div>
        <LinkForm links={links} archiveId={archiveId} />
      </form>
    </div>
  );
};

export default ArchiveEditView;
