import { Check, Close, Save } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Jodit } from 'jodit-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { FlatArchiveTag, FlatLinkWithoutRelations } from '../../../types/additionalFlatTypes';
import TextEditor from '../../common/editors/TextEditor';
import uploadMediaFiles from '../../common/picture-gallery/helpers/upload-media-files';
import { DialogPreset, useDialog } from '../../provider/DialogProvider';
import { useVisit } from './../../../helpers/history';
import './ArchiveEditView.scss';
import ArchiveInputField from './ArchiveInputField';
import ArchiveLinkForm from './ArchiveLinkForm';
import ArchiveLogoInput from './ArchiveLogoInput';
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
  const { visit } = useVisit();
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
    setForm({
      dirty: false,
      name: archive?.name ?? '',
      shortDescription: archive?.shortDescription ?? '',
      longDescription: archive?.longDescription ?? '',
      links: archive?.links ?? [],
    });
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

  const logoSrc = archive?.logo?.formats?.thumbnail.url ?? '';

  const updateForm = useCallback((newForm: Partial<ArchiveForm>) => {
    setForm(form => {
      return { ...form, ...newForm };
    });
  }, []);

  const handleLinkChange = useCallback(
    (links: LinkInfo[], invalid: boolean) => {
      updateForm({ links, dirty: true, invalid });
    },
    [updateForm]
  );

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
    updateForm({ dirty: false });
  };

  return archive ? (
    <div className='archive-edit-container'>
      <div className='archive-navigation'>
        <Button
          className='button-filled button-close'
          startIcon={<Close />}
          onClick={async () => {
            if (form.dirty) {
              const confirm = await dialog({
                title: t('archives.edit.confirm.title'),
                content: t('archives.edit.confirm.content'),
                preset: DialogPreset.CONFIRM,
              });
              if (!confirm) return;
            }
            visit(`/archives/${archiveId}`);
          }}
        >
          {t('archives.edit.back')}
        </Button>
        <Button
          className='button-filled button-save'
          startIcon={form.dirty ? <Save /> : <Check />}
          onClick={handleSubmit}
          disabled={!form.dirty || updateMutationResponse.loading || form.invalid}
        >
          {updateMutationResponse.loading
            ? t('archives.edit.saving')
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
          onBlur={value => updateForm({ name: value, dirty: true })}
        />
        <ArchiveInputField
          label={t('archives.edit.shortDescription.label')}
          id='shortdescription'
          defaultValue={archive.shortDescription ?? ''}
          onBlur={value => updateForm({ shortDescription: value, dirty: true })}
          helperText={t('archives.edit.shortDescription.helperText')}
        />
        <div className='archive-form-div'>
          <label className='archive-form-label' htmlFor='archive-form-long-description'>
            {t('archives.edit.longDescriptionLabel')}
          </label>
          <TextEditor
            value={archive.longDescription ?? ''}
            onChange={() => {}}
            onBlur={value => updateForm({ longDescription: value, dirty: true })}
            extraOptions={extraOptions}
          />
        </div>
        <ArchiveLogoInput
          defaultUrl={logoSrc}
          onChange={file => updateForm({ logo: file, dirty: true })}
        />
        <ArchiveLinkForm links={archive.links} onChange={handleLinkChange} />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default ArchiveEditView;
