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
import ArchiveLinkForm from './ArchiveLinkForm';
import uploadMediaFiles from '../../common/picture-gallery/helpers/upload-media-files';
import ArchiveInputField from './ArchiveInputField';
import ArchiveLogoInput from './ArchiveLogoInput';
import { Check } from '@mui/icons-material';
import useLinks from './helpers/link-helpers';
import { useDialog, DialogPreset } from '../../provider/DialogProvider';
import { useTranslation } from 'react-i18next';

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
  invalid?: boolean;
}

export enum LinkStatus {
  Created,
  Updated,
  Deleted,
}

export type LinkInfo = FlatLinkWithoutRelations & { status?: LinkStatus; invalid?: boolean };

const extraOptions: Partial<Jodit['options']> = {
  preset: undefined,
  statusbar: false,
  tabIndex: 0,
};

const ArchiveEditView = ({ archiveId }: ArchiveEditViewProps) => {
  const history: History = useHistory();
  const dialog = useDialog();
  const { t } = useTranslation();

  const { data } = useGetArchiveQuery({ variables: { archiveId } });
  const archive: FlatArchiveTag | undefined = useSimplifiedQueryResponseData(data)?.archiveTag;

  const [updateArchive, updateMutationResponse] = useUpdateArchiveMutation({
    refetchQueries: ['getArchive'],
    awaitRefetchQueries: true,
  });
  const { createLink, updateLink, deleteLink } = useLinks(archiveId);

  const [form, setForm] = useState<ArchiveForm>({
    name: '',
    shortDescription: '',
    longDescription: '',
    links: [],
    dirty: false,
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

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    if (form.dirty) {
      window.addEventListener('beforeunload', handler);
      return () => {
        window.removeEventListener('beforeunload', handler);
      };
    }
    return () => {};
  }, [form.dirty]);

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
          if (link.url === '') deleteLink(link);
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
    if (form.invalid) return;
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
    <div className='archive-edit-container'>
      <div className='archive-navigation'>
        <Button
          className='button-filled button-close'
          startIcon={<CloseIcon />}
          onClick={async () => {
            if (form.dirty) {
              const confirm = await dialog({
                title: t('archives.edit.confirm.title'),
                content: t('archives.edit.confirm.content'),
                preset: DialogPreset.CONFIRM,
              });
              if (!confirm) return;
            }
            history.push(`/archives/${archiveId}`);
          }}
        >
          {t('archives.edit.back')}
        </Button>
        <Button
          className='button-filled button-save'
          startIcon={form.dirty ? <SaveIcon /> : <Check />}
          onClick={handleSubmit}
          disabled={!form.dirty || updateMutationResponse.loading}
        >
          {updateMutationResponse.loading
            ? t('archives.edit.loading')
            : form.dirty
            ? t('archives.edit.save')
            : t('archives.edit.saved')}
        </Button>
      </div>

      <h1>{archive.name}</h1>

      <form className='archive-form'>
        <ArchiveInputField
          label={t('archives.edit.nameLabel')}
          id='name'
          defaultValue={archive.name}
          onBlur={value => setForm({ ...form, name: value, dirty: true })}
        />
        <ArchiveInputField
          label={t('archives.edit.shortDescription.label')}
          id='shortdescription'
          defaultValue={archive.shortDescription ?? ''}
          onBlur={value => setForm({ ...form, shortDescription: value, dirty: true })}
          helperText={t('archives.edit.shortDescription.helperText')}
        />
        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-long-description'>
            {t('archives.edit.longDescriptionLabel')}
          </label>
          <Editor
            value={archive.longDescription ?? ''}
            onChange={() => {}}
            onBlur={value => setForm({ ...form, longDescription: value, dirty: true })}
            extraOptions={extraOptions}
          />
        </div>
        <ArchiveLogoInput
          defaultUrl={src}
          onChange={file => setForm({ ...form, logo: file, dirty: true })}
        />
        <ArchiveLinkForm
          links={archive.links}
          onChange={(links, invalid) =>
            setForm({ ...form, links: links, dirty: true, invalid: invalid })
          }
        />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default ArchiveEditView;
