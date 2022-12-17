import { Button, OutlinedInput } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag } from '../../../types/additionalFlatTypes';
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

const extraOptions: Partial<Jodit['options']> = {
  preset: undefined,
  statusbar: false,
};

const ArchiveEditView = ({ archiveId }: ArchiveEditViewProps) => {
  const history: History = useHistory();

  const { data, loading, error } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });

  const [name, setName] = useState(archive?.name ?? '');
  const [shortDescription, setShortDescription] = useState(archive?.shortDescription ?? '');
  const [longDescription, setLongDescription] = useState(archive?.longDescription ?? '');

  useEffect(() => {
    setName(archive?.name ?? '');
    setShortDescription(archive?.shortDescription ?? '');
    setLongDescription(archive?.longDescription ?? '');
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
        <LinkForm links={archive?.links} archiveId={archiveId} />
      </form>
    </div>
  );
};

export default ArchiveEditView;
