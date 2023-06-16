import { Check, Close, Save } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Jodit } from 'jodit-react';
import { pick } from 'lodash';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetArchiveQuery, useUpdateArchiveMutation } from '../../../graphql/APIConnector';
import { useSimplifiedQueryResponseData } from '../../../graphql/queryUtils';
import { asUploadPath } from '../../../helpers/app-helpers';
import { FlatArchiveTag, FlatLinkWithoutRelations } from '../../../types/additionalFlatTypes';
import { isValidClientId } from '../../common/checkPaypalClientId';
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
  email: string | null;
  paypalClient: string;
  paypalDonationText: string;
  paypalPurpose: string;
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
    refetchQueries: ['getArchive', 'getArchiveNames'],
    awaitRefetchQueries: true,
  });
  const { createLink, updateLink, deleteLink } = useLinks(archiveId);

  const [form, setForm] = useState<ArchiveForm>({
    name: '',
    shortDescription: '',
    longDescription: '',
    email: null,
    paypalClient: '',
    paypalDonationText: '',
    paypalPurpose: '',
    links: [],
    dirty: false,
  });

  useEffect(() => {
    setForm({
      dirty: false,
      name: archive?.name ?? '',
      shortDescription: archive?.shortDescription ?? '',
      longDescription: archive?.longDescription ?? '',
      email: archive?.email ?? null,
      paypalClient: archive?.paypalClient ?? '',
      paypalDonationText: archive?.paypalDonationText ?? '',
      paypalPurpose: archive?.paypalPurpose ?? '',
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.invalid) return;
    handleLinks();
    if (form.logo) {
      uploadMediaFiles([form.logo]).then(ids => {
        updateArchive({
          variables: {
            archiveId,
            data: {
              ...pick(form, [
                'name',
                'shortDescription',
                'longDescription',
                'email',
                'paypalClient',
                'paypalDonationText',
                'paypalPurpose',
              ]),
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
            ...pick(form, [
              'name',
              'shortDescription',
              'longDescription',
              'email',
              'paypalClient',
              'paypalDonationText',
              'paypalPurpose',
            ]),
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
          disabled={!form.dirty || updateMutationResponse.loading || form.invalid}
          type='submit'
          form='archive-form'
        >
          {updateMutationResponse.loading
            ? t('archives.edit.saving')
            : form.dirty
            ? t('archives.edit.save')
            : t('archives.edit.saved')}
        </Button>
      </div>

      <h1>{archive.name}</h1>

      <form id='archive-form' className='archive-form' onSubmit={handleSubmit}>
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
            {t('archives.edit.longDescriptionLabel')}:
          </label>
          <TextEditor
            value={archive.longDescription ?? ''}
            onChange={() => {}}
            onBlur={value => updateForm({ longDescription: value, dirty: true })}
            extraOptions={extraOptions}
          />
        </div>
        <ArchiveLogoInput
          defaultUrl={asUploadPath(archive.logo, { highQuality: false })}
          onChange={file => updateForm({ logo: file, dirty: true })}
        />
        <ArchiveInputField
          defaultValue={archive.email ?? ''}
          label={t('archives.edit.email.label')}
          id='email'
          type='email'
          onBlur={value => updateForm({ email: value || null, dirty: true })}
          helperText={t('archives.edit.email.helperText')}
        />

        <ArchiveLinkForm links={archive.links} onChange={handleLinkChange} />

        <ArchiveInputField
          label={t('archives.edit.paypal.client-label')}
          defaultValue={archive.paypalClient ?? ''}
          placeholder={t('archives.edit.paypal.client-placeholder')}
          id='paypal'
          errorText={t('archives.edit.paypal.client-error')}
          errorFn={async value => {
            if (value === '') return false;
            return !(await isValidClientId(value));
          }}
          onBlur={async value => {
            if (value === '') {
              updateForm({ paypalClient: '', dirty: true });
              return;
            }
            if (await isValidClientId(value)) {
              updateForm({ paypalClient: value, dirty: true });
            }
          }}
        />
        <ArchiveInputField
          defaultValue={archive.paypalDonationText ?? ''}
          label={t('archives.edit.paypal.donation-label')}
          id='donationText'
          onBlur={value => updateForm({ paypalDonationText: value, dirty: true })}
          placeholder={t('archives.edit.paypal.donation-placeholder')}
        />
        <ArchiveInputField
          defaultValue={archive.paypalPurpose ?? ''}
          label={t('archives.edit.paypal.purpose-label')}
          id='purpose'
          onBlur={value => updateForm({ paypalPurpose: value, dirty: true })}
          placeholder={t('archives.edit.paypal.purpose-placeholder')}
        />
      </form>
    </div>
  ) : (
    <></>
  );
};

export default ArchiveEditView;
