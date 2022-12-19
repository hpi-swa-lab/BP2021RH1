import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../graphql/APIConnector';
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
import uploadMediaFiles from '../../common/picture-gallery/helpers/upload-media-files';
import ArchiveInputField from './ArchiveInputField';
import ArchiveLogoInput from './ArchiveLogoInput';
import { Check } from '@mui/icons-material';
import useLinks from './helpers/link-helpers';

interface ArchiveEditViewProps {
  archiveId: string;
}

interface ArchiveForm {
  name: string;
  shortDescription: string;
  longDescription: string;
  logo?: File;
  links: LinkInfo[];
  dirty: boolean;
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
  tabIndex: 0,
};

const ArchiveEditView = ({ archiveId }: ArchiveEditViewProps) => {
  const history: History = useHistory();

  const { data } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
  });
  const { createLink, updateLink, deleteLink } = useLinks(archiveId);

  const [form, setForm] = useState<ArchiveForm>({
    name: '',
    shortDescription: '',
    longDescription: '',
    links: [],
    dirty: true,
  });

  useEffect(() => {
    setForm(form => ({
      dirty: form.dirty,
      name: archive?.name ?? '',
      shortDescription: archive?.shortDescription ?? '',
      longDescription: archive?.longDescription ?? '',
      links: archive?.links ?? [],
    }));
  }, [archive]);

  const src = archive?.logo?.formats?.thumbnail.url ?? '';

  const handleLinks = () => {
    form.links.forEach(link => {
      switch (link.status) {
        case LinkStatus.Created: {
          if (link.url === '') return;
          createLink(link);
          break;
        }
        case LinkStatus.Updated: {
          updateLink(link);
          break;
        }
        case LinkStatus.Deleted: {
          deleteLink(link);
          break;
        }
        default: {
          break;
        }
      }
    });
  };

  const handleSubmit = () => {
    console.log(form.logo);
    handleLinks();
    if (form.logo) {
      uploadMediaFiles([form.logo]).then(ids => {
        updateArchive({
          variables: {
            archiveId,
            data: {
              name: form.name,
              shortDescription: form.shortDescription,
              longDescription: form.longDescription,
              logo: ids[0],
            },
          },
        });
      });
    } else {
      updateArchive({
        variables: {
          archiveId,
          data: {
            name: form.name,
            shortDescription: form.shortDescription,
            longDescription: form.longDescription,
          },
        },
      });
    }
    setForm({ ...form, dirty: false });
  };

  return archive ? (
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
        className='button-filled button-save'
        endIcon={form.dirty ? <SaveIcon /> : <Check />}
        onClick={handleSubmit}
        disabled={!form.dirty}
        style={{ float: 'right' }}
      >
        {form.dirty ? 'Änderungen speichern' : 'Änderungen gespeichert'}
      </Button>
      <h2>{archive.name}</h2>

      <form className='archive-form'>
        <ArchiveInputField
          label='Archiv-Name:'
          id='name'
          defaultValue={form.name}
          onBlur={value => setForm({ ...form, name: value, dirty: true })}
        />
        <ArchiveInputField
          label='Kurzbeschreibung:'
          id='shortdescription'
          defaultValue={form.shortDescription}
          onBlur={value => setForm({ ...form, shortDescription: value, dirty: true })}
        />

        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-long-description'>
            Vorstellung:
          </label>
          <Editor
            value={form.longDescription}
            onChange={() => {}}
            onBlur={value => setForm({ ...form, longDescription: value, dirty: true })}
            extraOptions={extraOptions}
          />
        </div>
        <ArchiveLogoInput
          defaultUrl={src}
          onChange={file => setForm({ ...form, logo: file, dirty: true })}
        />
        <LinkForm links={form.links} archiveId={archiveId} />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default ArchiveEditView;
